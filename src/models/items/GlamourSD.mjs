const fields = foundry.data.fields;

/**
 * Data model for Glamour items.
 *
 * Glamours are fairy magic abilities activated by thought alone — no roll
 * required. Usage limits vary per glamour (daily, hourly, unlimited).
 * Usage state (used/lastUsedTime) lives on the item itself.
 */
export class GlamourSD extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			description: new fields.HTMLField({ blank: true, initial: "" }),

			// Free-text range and duration (e.g. "Near", "1d4 Rounds")
			range: new fields.StringField({ blank: true, initial: "" }),
			duration: new fields.StringField({ blank: true, initial: "" }),

			// How often this glamour can be used
			usageType: new fields.StringField({
				initial: "daily",
				choices: ["unlimited", "daily", "hourly", "perSubject"],
			}),

			// Timestamp (ms) of last use — for hourly cooldown enforcement
			lastUsedTime: new fields.NumberField({
				integer: true,
				initial: 0,
				min: 0,
			}),

			// Whether this glamour has been used today (reset on rest)
			used: new fields.BooleanField({ initial: false }),
		};
	}

	/* ----------------------- */
	/* Getters                 */
	/* ----------------------- */

	get isGlamour() { return true; }
	get isRollable() { return false; }

	get isAvailable() {
		if (this.usageType === "unlimited") return true;
		if (this.usageType === "daily") return !this.used;
		if (this.usageType === "hourly") {
			return (Date.now() - this.lastUsedTime) >= (60 * 60 * 1000);
		}
		return !this.used;
	}

	get usageLabel() {
		const labels = {
			unlimited:  game.i18n.localize("DOLMENDARK.glamour.usage.unlimited"),
			daily:      game.i18n.localize("DOLMENDARK.glamour.usage.daily"),
			hourly:     game.i18n.localize("DOLMENDARK.glamour.usage.hourly"),
			perSubject: game.i18n.localize("DOLMENDARK.glamour.usage.per_subject"),
		};
		return labels[this.usageType] ?? labels.daily;
	}

	get subtext() {
		return [this.range, this.duration].filter(Boolean).join(", ");
	}

	/* ----------------------- */
	/* Methods                 */
	/* ----------------------- */

	async markUsed() {
		if (this.usageType === "unlimited") return;
		await this.parent.update({
			"system.used": true,
			"system.lastUsedTime": Date.now(),
		});
	}

	async reset() {
		await this.parent.update({
			"system.used": false,
			"system.lastUsedTime": 0,
		});
	}
}
