const fields = foundry.data.fields;

/**
 * Data model for Rune items.
 *
 * Runes are the deep secrets of fairy-kind. No roll to activate.
 * Usage frequency depends on magnitude and actor level.
 * Usage counts are stored as actor flags (dolmendark.runeUsage)
 * so the rune item itself stays stateless.
 *
 * Magnitudes:
 *   Lesser  — LV 1-4: 1/day | LV 5-9: 2/day | LV 10: 3/day
 *   Greater — LV 1-4: 1/level-up | LV 5-9: 1/week | LV 10: 1/day
 *   Mighty  — LV 1-9: once ever | LV 10: 1/year
 */
export class RuneSD extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			description: new fields.HTMLField({ blank: true, initial: "" }),

			magnitude: new fields.StringField({
				initial: "lesser",
				choices: ["lesser", "greater", "mighty"],
			}),

			range: new fields.StringField({ blank: true, initial: "" }),
			duration: new fields.StringField({ blank: true, initial: "" }),
		};
	}

	/* ----------------------- */
	/* Getters                 */
	/* ----------------------- */

	get isRune() { return true; }
	get isRollable() { return false; }

	get magnitudeLabel() {
		const labels = {
			lesser:  game.i18n.localize("DOLMENDARK.rune.magnitude.lesser"),
			greater: game.i18n.localize("DOLMENDARK.rune.magnitude.greater"),
			mighty:  game.i18n.localize("DOLMENDARK.rune.magnitude.mighty"),
		};
		return labels[this.magnitude] ?? labels.lesser;
	}

	get subtext() {
		return [this.magnitudeLabel, this.range, this.duration].filter(Boolean).join(", ");
	}

	/* ----------------------- */
	/* Methods                 */
	/* ----------------------- */

	/**
	 * How many times this rune can be used at a given actor level.
	 * @param {number} actorLevel
	 * @returns {number}
	 */
	maxUsesForLevel(actorLevel) {
		switch (this.magnitude) {
			case "lesser":
				if (actorLevel >= 10) return 3;
				if (actorLevel >= 5)  return 2;
				return 1;
			case "greater": return 1;
			case "mighty":  return 1;
			default:        return 1;
		}
	}

	/**
	 * The reset schedule for this rune at a given actor level.
	 * @param {number} actorLevel
	 * @returns {"daily"|"weekly"|"levelUp"|"yearly"|"never"}
	 */
	resetScheduleForLevel(actorLevel) {
		switch (this.magnitude) {
			case "lesser":  return "daily";
			case "greater":
				if (actorLevel >= 10) return "daily";
				if (actorLevel >= 5)  return "weekly";
				return "levelUp";
			case "mighty":
				if (actorLevel >= 10) return "yearly";
				return "never";
			default: return "daily";
		}
	}
}
