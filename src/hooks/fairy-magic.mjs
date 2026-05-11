/**
 * Fairy Magic Hooks
 *
 * Watches for actor updates that signal a rest (HP restored to max)
 * and resets daily glamour usage and daily/weekly rune usage accordingly.
 *
 * Also hooks into level-up to reset per-level rune uses.
 */
export const FairyMagicHooks = {
	attach: () => {

		/**
		 * When an actor's HP is updated to its maximum, treat this as a rest
		 * and reset all daily glamours and daily runes.
		 */
		Hooks.on("updateActor", async (actor, changes, _options, _userId) => {
			// Only care about Player actors with fairy magic enabled
			if (actor.type !== "Player") return;
			if (!actor.system.fairyMagic?.enabled) return;

			const hpChange = foundry.utils.getProperty(changes, "system.attributes.hp.value");
			if (hpChange === undefined) return;

			const hpMax = actor.system.attributes.hp.max;
			if (hpChange < hpMax) return; // Not a full rest

			// Reset daily glamours
			await actor.system.resetDailyGlamours();

			// Reset daily runes
			await actor.system.resetRunesBySchedule("daily");
		});

		/**
		 * When a Player actor's level increases, reset per-level-up Greater runes.
		 */
		Hooks.on("updateActor", async (actor, changes, _options, _userId) => {
			if (actor.type !== "Player") return;
			if (!actor.system.fairyMagic?.enabled) return;

			const levelChange = foundry.utils.getProperty(changes, "system.level.value");
			if (levelChange === undefined) return;

			await actor.system.resetRunesBySchedule("levelUp");
		});
	},
};
