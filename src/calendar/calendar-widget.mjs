/* global game, Hooks, CONFIG, foundry, ChatMessage, ui */

import {
	worldTimeToCalendar, calendarToWorldTime,
	getSeason, getDaylightHours, getMoonForDay,
	getCelestialPosition, ordinalDay, getDayName, getHoliday,
	getMoonChangesForMonth
} from './calendar-time.mjs'

const { DialogV2 } = foundry.applications.api

const ARC_WIDTH = 120
const ARC_HEIGHT = 62
const ARC_RADIUS = 42
const ARC_CX = ARC_WIDTH / 2
const ARC_CY = ARC_HEIGHT - 2

// ---------------------------------------------------------------------------
// Inline roll table helper (replaces dolmenwood's drawFromTableRaw import)
// ---------------------------------------------------------------------------

async function drawFromTableRaw(tableName) {
	const table = game.tables.find(t => t.name === tableName)
		?? await (async () => {
			for (const pack of game.packs) {
				if (pack.documentName !== 'RollTable') continue
				const index = await pack.getIndex()
				const entry = index.find(e => e.name === tableName)
				if (entry) return pack.getDocument(entry._id)
			}
			return null
		})()
	if (!table) return null
	const draw = await table.draw({ displayChat: false })
	const result = draw.results[0]
	if (!result) return null
	return { result, roll: draw.roll }
}

// ---------------------------------------------------------------------------
// Arc renderer
// ---------------------------------------------------------------------------

function renderArc(position, isDay, phaseIcon) {
	const angle = position * Math.PI
	const cx = ARC_CX - ARC_RADIUS * Math.cos(angle)
	const cy = ARC_CY - ARC_RADIUS * Math.sin(angle)

	const arcStart = `${ARC_CX - ARC_RADIUS},${ARC_CY}`
	const arcEnd = `${ARC_CX + ARC_RADIUS},${ARC_CY}`

	const BODY_SIZE = 12
	let celestialBody
	if (isDay) {
		celestialBody = `
			<defs>
				<filter id="sun-glow">
					<feGaussianBlur stdDeviation="2" result="blur"/>
					<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
				</filter>
			</defs>
			<circle cx="${cx}" cy="${cy}" r="6" fill="#FFD700" filter="url(#sun-glow)"/>
		`
	} else {
		celestialBody = `
			<image href="systems/shadowdark/assets/calendar/${phaseIcon}.webp"
				x="${cx - BODY_SIZE / 2}" y="${cy - BODY_SIZE / 2}"
				width="${BODY_SIZE}" height="${BODY_SIZE}"/>
		`
	}

	return `
		<svg class="calendar-arc-svg" width="${ARC_WIDTH}" height="${ARC_HEIGHT}" viewBox="0 0 ${ARC_WIDTH} ${ARC_HEIGHT}">
			<path d="M ${arcStart} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${arcEnd}"
				fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="3,3"/>
			${celestialBody}
		</svg>
	`
}

// ---------------------------------------------------------------------------
// Sky background
// ---------------------------------------------------------------------------

function computeSkyOpacities(hour, sunrise, sunset) {
	const dayLen = sunset - sunrise
	const nightLen = 24 - dayLen

	const nightEnd = sunrise - 0.25 * nightLen
	const morningEnd = sunrise + 0.25 * dayLen
	const afternoonStart = sunset - 0.25 * dayLen
	const eveningEnd = sunset + 0.25 * nightLen

	const o = { night: 0, sunrise: 0, midday: 0, evening: 0 }

	if (hour < nightEnd) {
		o.night = 1
	} else if (hour < sunrise) {
		const p = (hour - nightEnd) / (sunrise - nightEnd)
		o.night = 1
		o.sunrise = p
	} else if (hour < morningEnd) {
		const p = (hour - sunrise) / (morningEnd - sunrise)
		o.sunrise = 1
		o.midday = p
	} else if (hour < afternoonStart) {
		o.midday = 1
	} else if (hour < sunset) {
		const p = (hour - afternoonStart) / (sunset - afternoonStart)
		o.midday = 1
		o.evening = p
	} else if (hour < eveningEnd) {
		const p = (hour - sunset) / (eveningEnd - sunset)
		o.night = 1
		o.evening = 1 - p
	} else {
		o.night = 1
	}

	return o
}

// ---------------------------------------------------------------------------
// Weather helpers
// ---------------------------------------------------------------------------

function parseWeatherDescription(desc) {
	if (!desc) return { text: '', effects: '' }
	const parts = desc.split(/<br\s*\/?>/i)
	const text = parts[0].replace(/<[^>]+>/g, '').trim()
	let effects = ''
	const rest = parts.slice(1).join(' ')
	if (/travel\s+impeded/i.test(rest)) effects += 'I'
	if (/poor\s+visibility/i.test(rest)) effects += 'V'
	if (/wet\s+conditions/i.test(rest)) effects += 'W'
	return { text, effects }
}

function getWeatherIcon(text) {
	const t = text.toLowerCase()
	if (/blizzard|snow/.test(t)) return 'fa-snowflake'
	if (/storm|thunder/.test(t)) return 'fa-cloud-bolt'
	if (/rain|drizzle|downpour|torrential/.test(t)) return 'fa-cloud-rain'
	if (/fog|mist/.test(t)) return 'fa-smog'
	if (/wind|blustery|bracing/.test(t)) return 'fa-wind'
	if (/sun|sunny|clear|bright/.test(t)) return 'fa-sun'
	if (/cloud|overcast|gloomy|brooding/.test(t)) return 'fa-cloud'
	if (/hot|humid|sweltering|baking|balmy/.test(t)) return 'fa-temperature-high'
	if (/cold|frigid|freezing|icy|frost|chill|bitter/.test(t)) return 'fa-temperature-low'
	if (/dew|damp/.test(t)) return 'fa-droplet'
	return 'fa-cloud-sun'
}

let lastWeatherDay = null
async function rollWeather(autoRoll = false) {
	if (!game.user.isGM) return
	if (autoRoll) {
		const cal = worldTimeToCalendar(game.time.worldTime)
		const dayKey = getNoteKey(cal.year, cal.monthKey, cal.day)
		if (lastWeatherDay === dayKey) return
		lastWeatherDay = dayKey
	}

	const cal = worldTimeToCalendar(game.time.worldTime)
	const season = getSeason(cal.monthKey)
	const activeUnseason = game.settings.get('shadowdark', 'activeUnseason')

	let tableKey = season
	if (activeUnseason && CONFIG.DOLMENWOOD.unseasonWeatherTable[activeUnseason]) {
		tableKey = CONFIG.DOLMENWOOD.unseasonWeatherTable[activeUnseason]
	}
	const tableName = CONFIG.DOLMENWOOD.weatherTableNames[tableKey]
	if (!tableName) return

	const draw = await drawFromTableRaw(tableName)
	if (!draw) return

	const desc = draw.result.description || draw.result.text || ''
	const { text, effects } = parseWeatherDescription(desc)
	const roll = draw.roll.total

	await game.settings.set('shadowdark', 'currentWeather', { text, effects, roll })

	const effectLabels = {
		I: game.i18n.localize('DOLMEN.Calendar.Weather.Impeded'),
		V: game.i18n.localize('DOLMEN.Calendar.Weather.Visibility'),
		W: game.i18n.localize('DOLMEN.Calendar.Weather.Wet')
	}
	let effectsHtml = ''
	for (const flag of effects) {
		if (effectLabels[flag]) {
			effectsHtml += `<div style="margin-top: 0.25rem; font-size: 0.6875rem; opacity: 0.85;">\u26a0 ${effectLabels[flag]}</div>`
		}
	}

	const icon = getWeatherIcon(text)
	const chatTitle = game.i18n.localize('DOLMEN.Calendar.Weather.ChatTitle')
	const content = `
		<div style="padding: 0.25rem 0;">
			<div style="font-weight: 700; margin-bottom: 0.25rem;">
				<i class="fa-solid ${icon}"></i> ${chatTitle}
			</div>
			<div>
				<strong>${roll}</strong> &mdash; ${text}
			</div>
			${effectsHtml}
		</div>
	`

	ChatMessage.create({
		content,
		speaker: { alias: chatTitle },
		sound: CONFIG.sounds.dice
	})
}

// ---------------------------------------------------------------------------
// Widget renderer
// ---------------------------------------------------------------------------

function renderWidget() {
	const worldTime = game.time.worldTime
	const cal = worldTimeToCalendar(worldTime)
	const season = getSeason(cal.monthKey)
	const { sunrise, sunset } = getDaylightHours(cal.monthKey)
	const { moon, phase, phaseIcon } = getMoonForDay(cal.dayOfYear)
	const { position, isDay } = getCelestialPosition(cal.hour + cal.minute / 60, sunrise, sunset)

	const monthName = game.i18n.localize(`DOLMEN.Months.${cal.monthKey}`)
	const seasonName = game.i18n.localize(`DOLMEN.Calendar.Seasons.${season}`)
	const moonName = game.i18n.localize(`DOLMEN.MoonNames.${moon}`)
	const phaseName = game.i18n.localize(`DOLMEN.MoonPhases.${phase}`)
	const seasonData = CONFIG.DOLMENWOOD.seasons[season]
	const activeUnseason = game.settings.get('shadowdark', 'activeUnseason')
	const timeStr = `${String(cal.hour).padStart(2, '0')}:${String(cal.minute).padStart(2, '0')}`
	const dateStr = game.i18n.format('DOLMEN.Calendar.DateFormat', { day: ordinalDay(cal.day), dayNum: cal.day, month: monthName, year: cal.year })

	const { name: dayNameKey, isWysenday } = getDayName(cal.monthKey, cal.day)
	const dayDisplayName = isWysenday
		? dayNameKey
		: game.i18n.localize(`DOLMEN.Calendar.WeekDays.${dayNameKey}`)

	const holiday = getHoliday(cal.monthKey, cal.day)
	let holidayHtml = ''
	if (holiday) {
		const holidays = holiday.split(' & ')
		if (holidays.length > 1) {
			const tooltipLines = holidays.map(h => `<div class="calendar-holiday-line"><i class="fa-solid fa-star"></i><span>${h}</span></div>`).join('')
			holidayHtml = `<div class="calendar-holiday-stripe">
				<div class="calendar-holiday-line tooltip"><i class="fa-solid fa-star"></i><span>${game.i18n.localize('DOLMEN.Calendar.MultipleHolidays')}</span>
					<span class="tooltiptext calendar-holiday-tooltip">${tooltipLines}</span>
				</div>
			</div>`
		} else {
			holidayHtml = `<div class="calendar-holiday-stripe">
				<div class="calendar-holiday-line"><i class="fa-solid fa-star"></i><span>${holidays[0]}</span></div>
			</div>`
		}
	}

	const arcSvg = renderArc(position, isDay, phaseIcon)
	const sky = computeSkyOpacities(cal.hour + cal.minute / 60, sunrise, sunset)
	const arcBg = `
		<img class="calendar-arc-bg" src="systems/shadowdark/assets/calendar/night.webp" alt="" style="opacity: ${sky.night}">
		<img class="calendar-arc-bg" src="systems/shadowdark/assets/calendar/sunrise.webp" alt="" style="opacity: ${sky.sunrise}">
		<img class="calendar-arc-bg" src="systems/shadowdark/assets/calendar/midday.webp" alt="" style="opacity: ${sky.midday}">
		<img class="calendar-arc-bg" src="systems/shadowdark/assets/calendar/evening.webp" alt="" style="opacity: ${sky.evening}">
	`

	const isGM = game.user.isGM
	const gmControls = isGM ? `
		<div class="calendar-gm-controls">
			<button type="button" class="calendar-gm-btn" data-advance="600" title="${game.i18n.localize('DOLMEN.Calendar.Advance10Min')}">+10m</button>
			<button type="button" class="calendar-gm-btn" data-advance="3600" title="${game.i18n.localize('DOLMEN.Calendar.Advance1Hr')}">+1h</button>
			<button type="button" class="calendar-gm-btn" data-advance="28800" title="${game.i18n.localize('DOLMEN.Calendar.Advance8Hr')}">+8h</button>
		</div>
	` : ''

	const weather = game.settings.get('shadowdark', 'currentWeather')
	const hasWeather = weather && weather.text
	let weatherBarHtml = ''
	if (hasWeather) {
		const wIcon = getWeatherIcon(weather.text)
		let badges = ''
		const badgeInfo = {
			I: game.i18n.localize('DOLMEN.Calendar.Weather.Impeded'),
			V: game.i18n.localize('DOLMEN.Calendar.Weather.Visibility'),
			W: game.i18n.localize('DOLMEN.Calendar.Weather.Wet')
		}
		for (const flag of (weather.effects || '')) {
			if (badgeInfo[flag]) {
				badges += `<span class="weather-badge weather-badge-${flag}" title="${badgeInfo[flag]}">${flag}</span>`
			}
		}
		const rollBtn = isGM
			? `<a class="calendar-weather-roll" title="${game.i18n.localize('DOLMEN.Calendar.Weather.RollWeather')}"><i class="fa-solid fa-dice"></i></a>`
			: ''
		weatherBarHtml = `
			<div class="calendar-weather-bar">
				<i class="fa-solid ${wIcon}"></i>
				<span class="calendar-weather-text">${weather.text}</span>
				${badges}
				${rollBtn}
			</div>`
	} else if (isGM) {
		weatherBarHtml = `
			<div class="calendar-weather-bar">
				<span class="calendar-weather-text">${game.i18n.localize('DOLMEN.Calendar.Weather.NoWeather')}</span>
				<a class="calendar-weather-roll" title="${game.i18n.localize('DOLMEN.Calendar.Weather.RollWeather')}"><i class="fa-solid fa-dice"></i></a>
			</div>`
	}

	return `
		<div class="calendar-arc-container">${arcBg}${arcSvg}</div>
		<div class="calendar-row">
			${weatherBarHtml}
			<div class="calendar-bar">
				<div class="calendar-section calendar-day-name${isWysenday ? ' wysenday' : ''}">
					<span>${dayDisplayName}</span>
				</div>
				<div class="calendar-divider"></div>
				<div class="calendar-section calendar-date clickable">
					${holidayHtml}
					<i class="fa-solid fa-calendar-day"></i>
					<span>${dateStr}</span>
				</div>
				<div class="calendar-divider"></div>
				<div class="calendar-section calendar-time${isGM ? ' gm-clickable' : ''}">
					${gmControls}
					<i class="fa-solid fa-angles-up"></i>
					<i class="fa-solid fa-clock"></i>
					<span>${timeStr}</span>
					<i class="fa-solid fa-angles-up"></i>
				</div>
				<div class="calendar-divider"></div>
				<div class="calendar-section calendar-season${isGM ? ' gm-clickable' : ''}">
					${activeUnseason ? `<div class="calendar-unseason-stripe">
						<i class="${CONFIG.DOLMENWOOD.unseasons[activeUnseason]?.icon ?? 'fa-solid fa-bolt'}"></i>
						<span>${game.i18n.localize(`DOLMEN.Calendar.Unseasons.${activeUnseason}`)}</span>
					</div>` : ''}
					<i class="${seasonData.icon}"></i>
					<span>${seasonName}</span>
				</div>
				<div class="calendar-divider"></div>
				<div class="calendar-section calendar-moon">
					<img class="calendar-moon-icon" src="systems/shadowdark/assets/calendar/${phaseIcon}.webp" alt="${phaseName}">
					<span>${moonName} (${phaseName})</span>
				</div>
			</div>
			${isGM ? `<div class="calendar-settings-bar">
				<a class="calendar-settings-btn" title="${game.i18n.localize('DOLMEN.Calendar.SetDateTitle')}"><i class="fa-solid fa-gear"></i></a>
			</div>` : ''}
		</div>
	`
}

// ---------------------------------------------------------------------------
// DOM injection & positioning
// ---------------------------------------------------------------------------

function updateWidgetPosition(widget) {
	const hotbar = document.getElementById('hotbar')
	if (!hotbar) return

	hotbar.classList.add('dolmen-calendar-active')
	hotbar.style.setProperty('--hotbar-size', '50px')
	const slot6 = hotbar.querySelector('#action-bar .slot:nth-child(6)')
	if (slot6) slot6.style.marginLeft = `${ARC_WIDTH}px`

	hotbar.style.marginBottom = '3rem'

	const actionBar = hotbar.querySelector('#action-bar')
	if (!actionBar) return
	const actionRect = actionBar.getBoundingClientRect()
	const widgetRect = widget.getBoundingClientRect()
	widget.style.left = `${actionRect.left + actionRect.width / 2 - widgetRect.width / 2}px`
}

function injectWidget() {
	let widget = document.getElementById('dolmen-calendar-widget')
	if (!widget) {
		widget = document.createElement('div')
		widget.id = 'dolmen-calendar-widget'
		widget.classList.add('dolmen')
		document.body.appendChild(widget)
	}
	widget.innerHTML = renderWidget()
	attachListeners(widget)
	requestAnimationFrame(() => updateWidgetPosition(widget))
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

function attachListeners(widget) {
	for (const btn of widget.querySelectorAll('.calendar-gm-btn[data-advance]')) {
		btn.addEventListener('click', (e) => {
			e.stopPropagation()
			widget.classList.add('controls-active')
			const seconds = parseInt(btn.dataset.advance)
			game.time.advance(seconds)
		})
	}
	const dateSection = widget.querySelector('.calendar-date.clickable')
	if (dateSection) dateSection.addEventListener('click', openNotesDialog)

	const settingsBtn = widget.querySelector('.calendar-settings-btn')
	if (settingsBtn) {
		settingsBtn.addEventListener('click', (e) => {
			e.stopPropagation()
			openSetDateDialog()
		})
	}
	const timeSection = widget.querySelector('.calendar-time.gm-clickable')
	if (timeSection) {
		timeSection.addEventListener('click', openSetTimeDialog)
		timeSection.addEventListener('mouseleave', () => {
			const wasActive = widget.classList.contains('controls-active')
			widget.classList.remove('controls-active')
			if (wasActive) injectWidget()
		})
	}
	const seasonSection = widget.querySelector('.calendar-season.gm-clickable')
	if (seasonSection) seasonSection.addEventListener('click', openSetUnseasonDialog)

	const weatherBtn = widget.querySelector('.calendar-weather-roll')
	if (weatherBtn) {
		weatherBtn.addEventListener('click', (e) => {
			e.stopPropagation()
			rollWeather()
		})
	}
}

// ---------------------------------------------------------------------------
// Calendar picker (shared by set-date and notes dialogs)
// ---------------------------------------------------------------------------

function buildPickerContent(year, monthKey, selectedDay, { noteDays, readOnly } = {}) {
	const monthName = game.i18n.localize(`DOLMEN.Months.${monthKey}`)
	const weekDays = CONFIG.DOLMENWOOD.weekDays
	const holidays = CONFIG.DOLMENWOOD.holidays[monthKey] || {}
	const wysendays = CONFIG.DOLMENWOOD.wysendays[monthKey]
	const yearLabel = game.i18n.localize('DOLMEN.Calendar.Year')
	const moonChanges = getMoonChangesForMonth(monthKey)

	const headers = weekDays.map(key => {
		const short = game.i18n.localize(`DOLMEN.Calendar.WeekDaysShort.${key}`)
		return `<th>${short}</th>`
	}).join('')

	let gridRows = ''
	for (let row = 0; row < 4; row++) {
		let cells = ''
		for (let col = 0; col < 7; col++) {
			const day = row * 7 + col + 1
			const selected = day === selectedDay ? ' selected' : ''
			const holiday = holidays[day]
			const holidayClass = holiday ? ' holiday' : ''
			const hasNotes = noteDays?.has(day) ? ' has-notes' : ''
			const moonChange = moonChanges.get(day)
			const moonDot = moonChange ? '<span class="moon-change-dot"></span>' : ''
			const titleParts = []
			if (moonChange) {
				const mn = game.i18n.localize(`DOLMEN.MoonNames.${moonChange.moon}`)
				const mp = game.i18n.localize(`DOLMEN.MoonPhases.${moonChange.phase}`)
				titleParts.push(`${mn} (${mp})`)
			}
			if (holiday) titleParts.push(holiday)
			const titleAttr = titleParts.length ? ` title="${titleParts.join(' | ')}"` : ''
			cells += `<td><div class="calendar-picker-day${selected}${holidayClass}${hasNotes}" data-calendar-day="${day}"${titleAttr}>${day}${moonDot}</div></td>`
		}
		gridRows += `<tr>${cells}</tr>`
	}

	let wysendayHtml = ''
	if (wysendays && wysendays.length > 0) {
		const pills = wysendays.map((name, i) => {
			const day = 29 + i
			const selected = day === selectedDay ? ' selected' : ''
			const holiday = holidays[day]
			const holidayClass = holiday ? ' holiday' : ''
			const hasNotes = noteDays?.has(day) ? ' has-notes' : ''
			const moonChange = moonChanges.get(day)
			const moonDot = moonChange ? '<span class="moon-change-dot"></span>' : ''
			const titleParts = []
			if (moonChange) {
				const mn = game.i18n.localize(`DOLMEN.MoonNames.${moonChange.moon}`)
				const mp = game.i18n.localize(`DOLMEN.MoonPhases.${moonChange.phase}`)
				titleParts.push(`${mn} (${mp})`)
			}
			if (holiday) titleParts.push(holiday)
			const titleAttr = titleParts.length ? ` title="${titleParts.join(' | ')}"` : ''
			return `<div class="calendar-picker-wysenday${selected}${holidayClass}${hasNotes}" data-calendar-day="${day}"${titleAttr}>${name}${moonDot}</div>`
		}).join('')
		wysendayHtml = `<div class="calendar-picker-wysendays">${pills}</div>`
	}

	const yearHtml = readOnly
		? `<span>${year}</span>`
		: `<input type="number" class="calendar-picker-year" value="${year}" min="1">`

	return `
		<div class="calendar-picker-nav">
			<button type="button" data-calendar-nav="prev-year" title="Previous year">\u00AB</button>
			<button type="button" data-calendar-nav="prev-month" title="Previous month">\u2039</button>
			<div class="calendar-picker-title">${monthName}, ${yearLabel} ${yearHtml}</div>
			<button type="button" data-calendar-nav="next-month" title="Next month">\u203A</button>
			<button type="button" data-calendar-nav="next-year" title="Next year">\u00BB</button>
		</div>
		<table class="calendar-picker-grid">
			<thead><tr>${headers}</tr></thead>
			<tbody>${gridRows}</tbody>
		</table>
		${wysendayHtml}
	`
}

// ---------------------------------------------------------------------------
// Set Date dialog
// ---------------------------------------------------------------------------

function openSetDateDialog() {
	const cal = worldTimeToCalendar(game.time.worldTime)
	const monthKeys = Object.keys(CONFIG.DOLMENWOOD.months)

	const content = `<div class="calendar-picker" data-year="${cal.year}" data-month="${cal.monthKey}" data-selected-day="${cal.day}">
		${buildPickerContent(cal.year, cal.monthKey, cal.day)}
	</div>`

	function handlePickerClick(event) {
		const picker = document.querySelector('.calendar-picker')
		if (!picker) return

		const dayEl = event.target.closest('[data-calendar-day]')
		if (dayEl && picker.contains(dayEl)) {
			picker.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
			dayEl.classList.add('selected')
			picker.dataset.selectedDay = dayEl.dataset.calendarDay
			return
		}

		const navBtn = event.target.closest('[data-calendar-nav]')
		if (navBtn && picker.contains(navBtn)) {
			const action = navBtn.dataset.calendarNav
			let year = parseInt(picker.dataset.year)
			let monthIndex = monthKeys.indexOf(picker.dataset.month)
			let selectedDay = parseInt(picker.dataset.selectedDay)

			if (action === 'prev-year') year = Math.max(1, year - 1)
			else if (action === 'next-year') year++
			else if (action === 'prev-month') {
				monthIndex--
				if (monthIndex < 0) { monthIndex = monthKeys.length - 1; year = Math.max(1, year - 1) }
			} else if (action === 'next-month') {
				monthIndex++
				if (monthIndex >= monthKeys.length) { monthIndex = 0; year++ }
			}

			const newMonthKey = monthKeys[monthIndex]
			const maxDays = CONFIG.DOLMENWOOD.months[newMonthKey].days
			selectedDay = Math.min(selectedDay, maxDays)

			picker.dataset.year = year
			picker.dataset.month = newMonthKey
			picker.dataset.selectedDay = selectedDay
			picker.innerHTML = buildPickerContent(year, newMonthKey, selectedDay)
		}
	}

	function handleYearInput(event) {
		if (!event.target.classList.contains('calendar-picker-year')) return
		const picker = document.querySelector('.calendar-picker')
		if (!picker) return
		picker.dataset.year = Math.max(1, parseInt(event.target.value) || 1)
	}

	document.addEventListener('click', handlePickerClick, true)
	document.addEventListener('input', handleYearInput, true)

	DialogV2.wait({
		window: { title: game.i18n.localize('DOLMEN.Calendar.SetDateTitle') },
		content,
		buttons: [
			{
				action: 'set',
				label: game.i18n.localize('DOLMEN.Calendar.SetTimeConfirm'),
				icon: 'fas fa-check',
				callback: () => {
					const picker = document.querySelector('.calendar-picker')
					if (!picker) return
					const current = worldTimeToCalendar(game.time.worldTime)
					const year = parseInt(picker.dataset.year) || 1
					const monthKey = picker.dataset.month
					const day = parseInt(picker.dataset.selectedDay) || 1
					const newTime = calendarToWorldTime(year, monthKey, day, current.hour, current.minute)
					game.time.advance(newTime - game.time.worldTime)
				}
			},
			{ action: 'cancel', label: game.i18n.localize('DOLMEN.Cancel'), icon: 'fas fa-times' }
		]
	}).finally(() => {
		document.removeEventListener('click', handlePickerClick, true)
		document.removeEventListener('input', handleYearInput, true)
	})
}

// ---------------------------------------------------------------------------
// Set Time dialog
// ---------------------------------------------------------------------------

function openSetTimeDialog() {
	const cal = worldTimeToCalendar(game.time.worldTime)

	const content = `
		<div class="calendar-time-form">
			<input type="number" class="calendar-time-hour" value="${String(cal.hour).padStart(2, '0')}" min="0" max="23">
			<span class="calendar-time-colon">:</span>
			<input type="number" class="calendar-time-minute" value="${String(cal.minute).padStart(2, '0')}" min="0" max="59">
		</div>
	`

	DialogV2.wait({
		window: { title: game.i18n.localize('DOLMEN.Calendar.SetTimeTitle') },
		content,
		buttons: [
			{
				action: 'set',
				label: game.i18n.localize('DOLMEN.Calendar.SetTimeConfirm'),
				icon: 'fas fa-check',
				callback: (event, button) => {
					const form = button.closest('.dialog-content') ?? button.closest('.window-content')
					const hour = Math.min(Math.max(parseInt(form.querySelector('.calendar-time-hour')?.value) || 0, 0), 23)
					const minute = Math.min(Math.max(parseInt(form.querySelector('.calendar-time-minute')?.value) || 0, 0), 59)
					const current = worldTimeToCalendar(game.time.worldTime)
					const newTime = calendarToWorldTime(current.year, current.monthKey, current.day, hour, minute)
					game.time.advance(newTime - game.time.worldTime)
				}
			},
			{ action: 'cancel', label: game.i18n.localize('DOLMEN.Cancel'), icon: 'fas fa-times' }
		]
	})
}

// ---------------------------------------------------------------------------
// Set Unseason dialog
// ---------------------------------------------------------------------------

function openSetUnseasonDialog() {
	const cal = worldTimeToCalendar(game.time.worldTime)
	const current = game.settings.get('shadowdark', 'activeUnseason')
	const unseasons = CONFIG.DOLMENWOOD.unseasons

	let options = `<label class="calendar-unseason-option">
		<input type="radio" name="unseason" value="" ${!current ? 'checked' : ''}>
		<span>${game.i18n.localize('DOLMEN.Calendar.UnseasonsNone')}</span>
	</label>`
	for (const [key, data] of Object.entries(unseasons)) {
		const valid = data.months.includes(cal.monthKey)
		const checked = current === key ? ' checked' : ''
		const disabled = !valid && current !== key ? ' disabled' : ''
		const name = game.i18n.localize(`DOLMEN.Calendar.Unseasons.${key}`)
		const cls = valid ? '' : ' class="calendar-unseason-unavailable"'
		options += `<label class="calendar-unseason-option"${cls}>
			<input type="radio" name="unseason" value="${key}"${checked}${disabled}>
			<i class="${data.icon}"></i>
			<span>${name}</span>
		</label>`
	}

	DialogV2.wait({
		window: { title: game.i18n.localize('DOLMEN.Calendar.SetUnseasonTitle') },
		content: `<div class="calendar-unseason-form">${options}</div>`,
		buttons: [
			{
				action: 'set',
				label: game.i18n.localize('DOLMEN.Calendar.SetTimeConfirm'),
				icon: 'fas fa-check',
				callback: (event, button) => {
					const form = button.closest('.dialog-content') ?? button.closest('.window-content')
					const selected = form.querySelector('input[name="unseason"]:checked')
					game.settings.set('shadowdark', 'activeUnseason', selected ? selected.value : '')
				}
			},
			{ action: 'cancel', label: game.i18n.localize('DOLMEN.Cancel'), icon: 'fas fa-times' }
		]
	})
}

// ---------------------------------------------------------------------------
// Calendar notes
// ---------------------------------------------------------------------------

function getNoteKey(year, monthKey, day) {
	return `${year}-${monthKey}-${day}`
}

function rebuildNotesContainer() {
	const c = document.querySelector('.calendar-notes-container')
	if (!c) return
	const year = parseInt(c.dataset.year)
	const monthKey = c.dataset.month
	const selectedDay = parseInt(c.dataset.selectedDay)
	const noteDays = getNoteDays(year, monthKey)
	c.innerHTML = `
		${buildPickerContent(year, monthKey, selectedDay, { noteDays, readOnly: true })}
		<div class="calendar-notes-panel">
			${buildNotesPanel(year, monthKey, selectedDay)}
		</div>
	`
}

export function handleCalendarSocket(data) {
	if (!game.user.isGM) return
	if (data.action === 'addCalendarNote') {
		const notes = foundry.utils.deepClone(game.settings.get('shadowdark', 'calendarNotes'))
		if (!notes[data.key]) notes[data.key] = []
		notes[data.key].push(data.note)
		game.settings.set('shadowdark', 'calendarNotes', notes)
	} else if (data.action === 'deleteCalendarNote') {
		const notes = foundry.utils.deepClone(game.settings.get('shadowdark', 'calendarNotes'))
		if (!notes[data.key]) return
		notes[data.key] = notes[data.key].filter(n => n.id !== data.noteId)
		if (notes[data.key].length === 0) delete notes[data.key]
		game.settings.set('shadowdark', 'calendarNotes', notes)
	}
}

function getNoteDays(year, monthKey) {
	const notes = game.settings.get('shadowdark', 'calendarNotes')
	const isGM = game.user.isGM
	const days = new Set()
	const maxDays = CONFIG.DOLMENWOOD.months[monthKey].days
	for (let d = 1; d <= maxDays; d++) {
		const dayNotes = notes[getNoteKey(year, monthKey, d)]
		if (!dayNotes || dayNotes.length === 0) continue
		if (isGM || dayNotes.some(n => !n.gmOnly)) days.add(d)
	}
	return days
}

function buildNotesPanel(year, monthKey, day) {
	const notes = game.settings.get('shadowdark', 'calendarNotes')
	const isGM = game.user.isGM
	const key = getNoteKey(year, monthKey, day)
	const dayNotes = (notes[key] || []).filter(n => isGM || !n.gmOnly)
	const monthName = game.i18n.localize(`DOLMEN.Months.${monthKey}`)

	const dayOfYear = CONFIG.DOLMENWOOD.monthOffsets[monthKey] + day
	const { moon, phase, phaseIcon } = getMoonForDay(dayOfYear)
	const moonName = game.i18n.localize(`DOLMEN.MoonNames.${moon}`)
	const phaseName = game.i18n.localize(`DOLMEN.MoonPhases.${phase}`)
	const moonInfoHtml = `
		<div class="calendar-note-moon">
			<img class="calendar-note-moon-icon" src="systems/shadowdark/assets/calendar/${phaseIcon}.webp" alt="${phaseName}">
			<span class="calendar-note-moon-text">${moonName} (${phaseName})</span>
		</div>
	`

	const holidays = CONFIG.DOLMENWOOD.holidays[monthKey] || {}
	const holiday = holidays[day]
	let holidayHtml = ''
	if (holiday) {
		holidayHtml = holiday.split(' & ').map(h =>
			`<div class="calendar-note-item calendar-note-holiday"><i class="fa-solid fa-star"></i><span class="calendar-note-text">${h}</span></div>`
		).join('')
	}

	let notesList = ''
	if (dayNotes.length === 0 && !holiday) {
		notesList = `<div class="calendar-notes-empty">${game.i18n.localize('DOLMEN.Calendar.Notes.NoNotes')}</div>`
	} else {
		notesList = dayNotes.map(n => {
			const badge = n.gmOnly
				? `<span class="calendar-note-badge gm-only">${game.i18n.localize('DOLMEN.Calendar.Notes.GmOnly')}</span>`
				: `<span class="calendar-note-badge everyone">${game.i18n.localize('DOLMEN.Calendar.Notes.Everyone')}</span>`
			const canDelete = isGM || !n.gmOnly
			const del = canDelete
				? `<a class="calendar-note-delete" data-delete-note="${n.id}" title="${game.i18n.localize('DOLMEN.Calendar.Notes.DeleteNote')}"><i class="fa-solid fa-trash"></i></a>`
				: ''
			return `<div class="calendar-note-item">${badge}<span class="calendar-note-text">${n.text}</span>${del}</div>`
		}).join('')
	}

	const gmCheckbox = isGM
		? `<label class="calendar-notes-gm-label"><input type="checkbox" class="calendar-notes-gm-check" checked> ${game.i18n.localize('DOLMEN.Calendar.Notes.GmOnly')}</label>`
		: ''
	const addForm = `
		<div class="calendar-notes-add">
			<input type="text" class="calendar-notes-input" placeholder="${game.i18n.localize('DOLMEN.Calendar.Notes.Placeholder')}">
			<button type="button" class="calendar-notes-add-btn" title="${game.i18n.localize('DOLMEN.Calendar.Notes.AddNote')}"><i class="fa-solid fa-plus"></i></button>
			${gmCheckbox}
		</div>
	`

	return `
		<div class="calendar-notes-header">${ordinalDay(day)} ${monthName}</div>
		${moonInfoHtml}
		<div class="calendar-notes-list">${holidayHtml}${notesList}</div>
		${addForm}
	`
}

function openNotesDialog() {
	const cal = worldTimeToCalendar(game.time.worldTime)
	const monthKeys = Object.keys(CONFIG.DOLMENWOOD.months)

	function buildFullContent(year, monthKey, selectedDay) {
		const noteDays = getNoteDays(year, monthKey)
		return `
			${buildPickerContent(year, monthKey, selectedDay, { noteDays, readOnly: true })}
			<div class="calendar-notes-panel">
				${buildNotesPanel(year, monthKey, selectedDay)}
			</div>
		`
	}

	function rebuildContainer() {
		const c = document.querySelector('.calendar-notes-container')
		if (!c) return
		c.innerHTML = buildFullContent(parseInt(c.dataset.year), c.dataset.month, parseInt(c.dataset.selectedDay))
	}

	async function addNote() {
		const c = document.querySelector('.calendar-notes-container')
		if (!c) return
		const input = c.querySelector('.calendar-notes-input')
		const checkbox = c.querySelector('.calendar-notes-gm-check')
		const text = input?.value?.trim()
		if (!text) return
		const key = getNoteKey(parseInt(c.dataset.year), c.dataset.month, parseInt(c.dataset.selectedDay))
		const gmOnly = game.user.isGM ? (checkbox?.checked ?? true) : false
		const note = { id: foundry.utils.randomID(), text, gmOnly }
		if (game.user.isGM) {
			const notes = foundry.utils.deepClone(game.settings.get('shadowdark', 'calendarNotes'))
			if (!notes[key]) notes[key] = []
			notes[key].push(note)
			await game.settings.set('shadowdark', 'calendarNotes', notes)
			rebuildContainer()
		} else {
			game.socket.emit('system.shadowdark', { action: 'addCalendarNote', key, note })
		}
	}

	async function deleteNote(noteId) {
		const c = document.querySelector('.calendar-notes-container')
		if (!c) return
		const key = getNoteKey(parseInt(c.dataset.year), c.dataset.month, parseInt(c.dataset.selectedDay))
		if (game.user.isGM) {
			const notes = foundry.utils.deepClone(game.settings.get('shadowdark', 'calendarNotes'))
			if (!notes[key]) return
			notes[key] = notes[key].filter(n => n.id !== noteId)
			if (notes[key].length === 0) delete notes[key]
			await game.settings.set('shadowdark', 'calendarNotes', notes)
			rebuildContainer()
		} else {
			game.socket.emit('system.shadowdark', { action: 'deleteCalendarNote', key, noteId })
		}
	}

	function handleClick(event) {
		const c = document.querySelector('.calendar-notes-container')
		if (!c) return

		const dayEl = event.target.closest('[data-calendar-day]')
		if (dayEl && c.contains(dayEl)) {
			c.dataset.selectedDay = dayEl.dataset.calendarDay
			rebuildContainer()
			return
		}

		const navBtn = event.target.closest('[data-calendar-nav]')
		if (navBtn && c.contains(navBtn)) {
			const action = navBtn.dataset.calendarNav
			let year = parseInt(c.dataset.year)
			let monthIndex = monthKeys.indexOf(c.dataset.month)
			let selectedDay = parseInt(c.dataset.selectedDay)
			if (action === 'prev-year') year = Math.max(1, year - 1)
			else if (action === 'next-year') year++
			else if (action === 'prev-month') {
				monthIndex--
				if (monthIndex < 0) { monthIndex = monthKeys.length - 1; year = Math.max(1, year - 1) }
			} else if (action === 'next-month') {
				monthIndex++
				if (monthIndex >= monthKeys.length) { monthIndex = 0; year++ }
			}
			const newMonthKey = monthKeys[monthIndex]
			selectedDay = Math.min(selectedDay, CONFIG.DOLMENWOOD.months[newMonthKey].days)
			c.dataset.year = year
			c.dataset.month = newMonthKey
			c.dataset.selectedDay = selectedDay
			rebuildContainer()
			return
		}

		const delBtn = event.target.closest('[data-delete-note]')
		if (delBtn && c.contains(delBtn)) {
			deleteNote(delBtn.dataset.deleteNote)
			return
		}

		if (event.target.closest('.calendar-notes-add-btn') && c.contains(event.target)) {
			addNote()
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && event.target.classList.contains('calendar-notes-input')) {
			event.preventDefault()
			addNote()
		}
	}

	const content = `<div class="calendar-notes-container calendar-picker" data-year="${cal.year}" data-month="${cal.monthKey}" data-selected-day="${cal.day}">
		${buildFullContent(cal.year, cal.monthKey, cal.day)}
	</div>`

	document.addEventListener('click', handleClick, true)
	document.addEventListener('keydown', handleKeydown, true)

	DialogV2.wait({
		window: { title: game.i18n.localize('DOLMEN.Calendar.Notes.Title') },
		content,
		buttons: [{ action: 'close', label: game.i18n.localize('DOLMEN.Close'), icon: 'fas fa-times' }]
	}).finally(() => {
		document.removeEventListener('click', handleClick, true)
		document.removeEventListener('keydown', handleKeydown, true)
	})
}

// ---------------------------------------------------------------------------
// Day-change notifications
// ---------------------------------------------------------------------------

function showDayNoteNotifications(year, monthKey, day) {
	const notes = game.settings.get('shadowdark', 'calendarNotes')
	const dayNotes = notes[getNoteKey(year, monthKey, day)]
	if (!dayNotes || dayNotes.length === 0) return
	const isGM = game.user.isGM
	const label = game.i18n.localize('DOLMEN.Calendar.Notes.Notification')
	for (const note of dayNotes) {
		if (note.gmOnly && !isGM) continue
		ui.notifications.info(`${label}: ${note.text}`)
	}
}

// ---------------------------------------------------------------------------
// Toggle & init (exported)
// ---------------------------------------------------------------------------

export function toggleWidget(visible) {
	const widget = document.getElementById('dolmen-calendar-widget')
	if (visible && !widget) {
		injectWidget()
	} else if (widget) {
		widget.classList.toggle('hidden', !visible)
		if (visible) {
			updateWidgetPosition(widget)
		} else {
			const hotbar = document.getElementById('hotbar')
			if (hotbar) {
				hotbar.style.marginBottom = ''
				hotbar.style.removeProperty('--hotbar-size')
				hotbar.classList.remove('dolmen-calendar-active')
				const slot6 = hotbar.querySelector('#action-bar .slot:nth-child(6)')
				if (slot6) slot6.style.marginLeft = ''
			}
		}
	}
}

let resizeHandler = null
let lastNotifiedDay = null

export function initCalendarWidget() {
	const enabled = game.settings.get('shadowdark', 'showCalendar')
	if (enabled) injectWidget()

	const initCal = worldTimeToCalendar(game.time.worldTime)
	lastNotifiedDay = getNoteKey(initCal.year, initCal.monthKey, initCal.day)
	lastWeatherDay = lastNotifiedDay

	Hooks.on('renderHotbar', () => {
		if (game.settings.get('shadowdark', 'showCalendar')) injectWidget()
	})

	Hooks.on('collapseSidebar', () => {
		const widget = document.getElementById('dolmen-calendar-widget')
		if (widget && game.settings.get('shadowdark', 'showCalendar')) {
			setTimeout(() => updateWidgetPosition(widget), 300)
		}
	})

	Hooks.on('updateWorldTime', () => {
		if (game.settings.get('shadowdark', 'showCalendar')) injectWidget()
		const cal = worldTimeToCalendar(game.time.worldTime)
		const dayKey = getNoteKey(cal.year, cal.monthKey, cal.day)
		const dayChanged = lastNotifiedDay !== null && dayKey !== lastNotifiedDay
		lastNotifiedDay = dayKey
		if (dayChanged) {
			showDayNoteNotifications(cal.year, cal.monthKey, cal.day)
			if (game.user === game.users.activeGM && game.settings.get('shadowdark', 'autoWeather')) {
				rollWeather(true)
			}
		}
	})

	const onSettingChange = (setting) => {
		if ((setting.key === 'shadowdark.activeUnseason' || setting.key === 'shadowdark.currentWeather')
			&& game.settings.get('shadowdark', 'showCalendar')) {
			injectWidget()
		}
		if (setting.key === 'shadowdark.calendarNotes') {
			rebuildNotesContainer()
		}
	}
	Hooks.on('createSetting', onSettingChange)
	Hooks.on('updateSetting', onSettingChange)

	resizeHandler = foundry.utils.debounce(() => {
		const widget = document.getElementById('dolmen-calendar-widget')
		if (widget && game.settings.get('shadowdark', 'showCalendar')) {
			updateWidgetPosition(widget)
		}
	}, 100)
	window.addEventListener('resize', resizeHandler)
	document.addEventListener('fullscreenchange', resizeHandler)
}
