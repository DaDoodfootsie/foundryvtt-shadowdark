// Namespace Configuration Values
const SHADOWDARK = {};

SHADOWDARK.ABILITIES_LONG = {
	str: "SHADOWDARK.ability_strength",
	int: "SHADOWDARK.ability_intelligence",
	wis: "SHADOWDARK.ability_wisdom",
	con: "SHADOWDARK.ability_constitution",
	cha: "SHADOWDARK.ability_charisma",
	dex: "SHADOWDARK.ability_dexterity",
};

SHADOWDARK.ABILITY_KEYS = [
	"str",
	"int",
	"dex",
	"wis",
	"con",
	"cha",
];

SHADOWDARK.ALIGNMENTS = {
	lawful: "SHADOWDARK.alignment.lawful",
	neutral: "SHADOWDARK.alignment.neutral",
	chaotic: "SHADOWDARK.alignment.chaotic",
};

SHADOWDARK.ARMOR_BONUS_ATTRIBUTES = {
	dex: "SHADOWDARK.ability_dex",
};

SHADOWDARK.DICE = {
	d2: "d2",
	d4: "d4",
	d6: "d6",
	d8: "d8",
	d10: "d10",
	d12: "d12",
	d20: "d20",
};

SHADOWDARK.DAMAGE_DICE = [
	"d4",
	"d6",
	"d8",
	"d10",
	"d12",
];

SHADOWDARK.BOON_TYPES = {
	blessing: "SHADOWDARK.boons.blessing",
	oath: "SHADOWDARK.boons.oath",
	secret: "SHADOWDARK.boons.secret",
};

SHADOWDARK.DEFAULTS = {
	ACTOR_IMAGES: {
		Light: "icons/sundries/lights/torch-purple.webp",
		NPC: "systems/shadowdark/assets/tokens/cowled_token_red.webp",
		Player: "systems/shadowdark/assets/tokens/cowled_token_green.webp",
	},
	BASE_ARMOR_CLASS: 10,
	GEAR_SLOTS: 10,
	GEMS_PER_SLOT: 10,
	FREE_COIN_CARRY: 100,
	LEARN_SPELL_DC: 15,
	LIGHT_TRACKER_UPDATE_INTERVAL_SECS: 30,
	ITEM_IMAGES: {
		"Ancestry": "icons/environment/people/group.webp",
		"Armor": "icons/equipment/chest/breastplate-banded-steel-gold.webp",
		"Background": "icons/environment/people/commoner.webp",
		"Basic": "icons/containers/bags/pouch-simple-brown.webp",
		"Boon": "icons/skills/social/diplomacy-writing-letter.webp",
		"Class Ability": "icons/tools/navigation/map-chart-tan.webp",
		"Class": "icons/sundries/documents/document-sealed-brown-red.webp",
		"Deity": "icons/magic/holy/yin-yang-balance-symbol.webp",
		"Effect": "icons/commodities/tech/cog-brass.webp",
		"Gem": "icons/commodities/gems/gem-faceted-navette-red.webp",
		"Language": "icons/tools/scribal/ink-quill-pink.webp",
		"NPC Attack": "icons/skills/melee/weapons-crossed-swords-yellow.webp",
		"NPC Feature": "icons/creatures/abilities/dragon-breath-purple.webp",
		"NPC Special Attack": "icons/magic/death/weapon-sword-skull-purple.webp",
		"Patron": "icons/magic/unholy/silhouette-light-fire-blue.webp",
		"Potion": "icons/consumables/potions/bottle-corked-red.webp",
		"Property": "icons/sundries/documents/document-torn-diagram-tan.webp",
		"Scroll": "icons/sundries/scrolls/scroll-runed-brown-purple.webp",
		"Spell": "icons/magic/symbols/runes-star-blue.webp",
		"Talent": "icons/sundries/books/book-worn-brown-grey.webp",
		"Wand": "icons/weapons/wands/wand-gem-violet.webp",
		"Weapon": "icons/weapons/swords/swords-short.webp",
	},
};

SHADOWDARK.LANGUAGE_RARITY = {
	common: "SHADOWDARK.language.rarity.common",
	rare: "SHADOWDARK.language.rarity.rare",
};

SHADOWDARK.LIGHT_SETTING_NAMES = {
	lantern: "SHADOWDARK.light_source.lantern",
	lightSpellDouble: "SHADOWDARK.light_source.light_spell.double_near",
	lightSpellNear: "SHADOWDARK.light_source.light_spell.near",
	torch: "SHADOWDARK.light_source.torch",
};

SHADOWDARK.LIGHT_SOURCE_ITEM_IDS = [
	"PkQXG3AaHNMVwGTc", // Light Spell
	"rjNBToTJCYLLdVcT", // Light Spell (Double Time)
	"BBDG7QpHOFXG6sKe", // Light Spell (Double Range)
];

SHADOWDARK.NPC_ATTACK_TYPES = {
	physical: "SHADOWDARK.npc_attack.type.physical",
	special: "SHADOWDARK.npc_attack.type.special",
};

SHADOWDARK.NPC_MOVES = {
	none: "SHADOWDARK.npc_move.none",
	close: "SHADOWDARK.npc_move.close",
	near: "SHADOWDARK.npc_move.near",
	doubleNear: "SHADOWDARK.range.double_near",
	tripleNear: "SHADOWDARK.npc_move.triple_near",
	far: "SHADOWDARK.npc_move.far",
	special: "SHADOWDARK.npc_move.special",
};

SHADOWDARK.PROPERTY_TYPES = {
	armor: "SHADOWDARK.property.type.option.armor",
	weapon: "SHADOWDARK.property.type.option.weapon",
};

SHADOWDARK.RANGES = {
	close: "SHADOWDARK.range.close",
	near: "SHADOWDARK.range.near",
	far: "SHADOWDARK.range.far",
	nearLine: "SHADOWDARK.range.nearLine",
};

SHADOWDARK.RANGES_SHORT = {
	close: "SHADOWDARK.range.close_short",
	near: "SHADOWDARK.range.near_short",
	far: "SHADOWDARK.range.far_short",
	self: "SHADOWDARK.range.self_short",
};

SHADOWDARK.OFFICIAL_SOURCES = {
	"bard-and-ranger": "SHADOWDARK.source.bard-and-ranger",
	"core-rules": "SHADOWDARK.source.core-rules",
	"cursed-scroll-1": "SHADOWDARK.source.cursed-scroll-1",
	"cursed-scroll-2": "SHADOWDARK.source.cursed-scroll-2",
	"cursed-scroll-3": "SHADOWDARK.source.cursed-scroll-3",
	"cursed-scroll-4": "SHADOWDARK.source.cursed-scroll-4",
	"cursed-scroll-5": "SHADOWDARK.source.cursed-scroll-5",
	"cursed-scroll-6": "SHADOWDARK.source.cursed-scroll-6",
	"quickstart": "SHADOWDARK.source.quickstart",
};

SHADOWDARK.SPELL_DURATIONS = {
	focus: "SHADOWDARK.spell_duration.focus",
	instant: "SHADOWDARK.spell_duration.instant",
	rounds: "SHADOWDARK.spell_duration.rounds",
	turns: "SHADOWDARK.spell_duration.turns",
	days: "SHADOWDARK.spell_duration.days",
	realTime: "SHADOWDARK.spell_duration.real_time",
	permanent: "SHADOWDARK.spell_duration.permanent",
};

SHADOWDARK.EFFECT_CATEGORIES = {
	effect: "SHADOWDARK.item.effect.category.effect",
	condition: "SHADOWDARK.item.effect.category.condition",
};

SHADOWDARK.EFFECT_DURATIONS = {
	instant: "SHADOWDARK.spell_duration.instant",
	rounds: "SHADOWDARK.spell_duration.rounds",
	turns: "SHADOWDARK.effect_duration.turns",
	seconds: "SHADOWDARK.effect_duration.seconds",
	minutes: "SHADOWDARK.effect_duration.minutes",
	hours: "SHADOWDARK.effect_duration.hours",
	days: "SHADOWDARK.spell_duration.days",
	focus: "SHADOWDARK.spell_duration.focus",
	permanent: "SHADOWDARK.spell_duration.permanent",
	unlimited: "SHADOWDARK.effect_duration.unlimited",
};

SHADOWDARK.EFFECT_TRANSLATIONS = {
	"system.abilities.cha.base": "SHADOWDARK.ability_cha",
	"system.abilities.cha.bonus": "SHADOWDARK.ability_cha",
	"system.abilities.con.base": "SHADOWDARK.ability_con",
	"system.abilities.con.bonus": "SHADOWDARK.ability_con",
	"system.abilities.dex.base": "SHADOWDARK.ability_dex",
	"system.abilities.dex.bonus": "SHADOWDARK.ability_dex",
	"system.abilities.int.base": "SHADOWDARK.ability_int",
	"system.abilities.int.bonus": "SHADOWDARK.ability_int",
	"system.abilities.str.base": "SHADOWDARK.ability_str",
	"system.abilities.str.bonus": "SHADOWDARK.ability_str",
	"system.abilities.wis.base": "SHADOWDARK.ability_wis",
	"system.abilities.wis.bonus": "SHADOWDARK.ability_wis",
	"system.bonuses.acBonus": "SHADOWDARK.talent.type.armor_bonus",
	"system.bonuses.advantage": "SHADOWDARK.talent.type.advantage.title",
	"system.bonuses.armorMastery": "SHADOWDARK.item.effect.predefined_effect.armorMastery",
	"system.bonuses.attackBonus": "SHADOWDARK.item.magic_item.type.attackBonus",
	"system.bonuses.backstabDie": "SHADOWDARK.talent.type.backstab_die",
	"system.bonuses.critical.failureThreshold": "SHADOWDARK.item.magic_item.type.criticalFailureThreshold",
	"system.bonuses.critical.multiplier": "SHADOWDARK.item.magic_item.type.critMultiplier",
	"system.bonuses.critical.successThreshold": "SHADOWDARK.item.magic_item.type.criticalSuccessThreshold",
	"system.bonuses.damageBonus": "SHADOWDARK.item.magic_item.type.damageBonus",
	"system.bonuses.gearSlots": "SHADOWDARK.inventory.slots",
	"system.bonuses.meleeAttackBonus": "SHADOWDARK.talent.type.melee_attack_bonus",
	"system.bonuses.meleeDamageBonus": "SHADOWDARK.talent.type.melee_damage_bonus",
	"system.bonuses.rangedAttackBonus": "SHADOWDARK.talent.type.ranged_attack_bonus",
	"system.bonuses.rangedDamageBonus": "SHADOWDARK.talent.type.ranged_damage_bonus",
	"system.bonuses.stoneSkinTalent": "SHADOWDARK.talent.type.stoneSkinTalent",
	"system.bonuses.spellcastingCheckBonus": "SHADOWDARK.talent.type.spell_bonus",
	"system.bonuses.spellcastingClasses": "SHADOWDARK.talent.type.bonus_caster_classes",
	"system.bonuses.weaponMastery": "SHADOWDARK.talent.type.weapon_mastery",
};

SHADOWDARK.JOURNAL_UUIDS = {
	RELEASE_NOTES: "Compendium.shadowdark.documentation.JournalEntry.UJ60Lf9ecijEOO6I",
};

SHADOWDARK.PREDEFINED_EFFECTS = {
	abilityImprovementCha: {
		defaultValue: 1,
		effectKey: "system.abilities.cha.value",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.abilityImprovementCha",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	abilityImprovementCon: {
		defaultValue: 1,
		effectKey: "system.abilities.con.value",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.abilityImprovementCon",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	abilityImprovementDex: {
		defaultValue: 1,
		effectKey: "system.abilities.dex.value",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.abilityImprovementDex",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	abilityImprovementInt: {
		defaultValue: 1,
		effectKey: "system.abilities.int.value",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.abilityImprovementInt",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	abilityImprovementStr: {
		defaultValue: 1,
		effectKey: "system.abilities.str.value",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.abilityImprovementStr",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	abilityImprovementWis: {
		defaultValue: 1,
		effectKey: "system.abilities.wis.value",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.abilityImprovementWis",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	acBonus: {
		defaultValue: 1,
		effectKey: "system.attributes.ac.value",
		img: "icons/skills/melee/shield-block-gray-orange.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.acBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	acBonusFromAttribute: {
		defaultValue: "system.attributes.REPLACEME.mod",
		effectKey: "system.attributes.ac.value",
		img: "icons/skills/melee/shield-block-gray-orange.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.acBonusFromAttribute",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	additionalGearSlots: {
		defaultValue: 1,
		effectKey: "system.slots",
		img: "icons/magic/defensive/shield-barrier-deflect-teal.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.additionalGearSlots",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	armorMastery: {
		defaultValue: 1,
		effectKey: "system.attributes.ac.REPLACEME",
		img: "icons/magic/defensive/shield-barrier-deflect-teal.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.armorMastery",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	criticalFailureThreshold: {
		defaultValue: 3,
		effectKey: "system.roll.attack.critical-failure.this",
		img: "icons/magic/life/cross-area-circle-green-white.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.criticalFailureThreshold",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	criticalSuccessThreshold: {
		defaultValue: 18,
		effectKey: "system.roll.attack.critical-success.this",
		img: "icons/magic/fire/flame-burning-fist-strike.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.criticalSuccessThreshold",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	critMultiplier: {
		defaultValue: 4,
		effectKey: "system.roll.attack.critical-multiplier.this",
		img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.critMultiplier",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	damageMultiplier: {
		defaultValue: 2,
		effectKey: "system.roll.attack.damage.this",
		img: "icons/skills/melee/strike-hammer-destructive-orange.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.damageMultiplier",
		mode: "CONST.ACTIVE_EFFECT_MODES.MULTIPLY",
	},
	hpAdvantage: {
		defaultValue: 1,
		effectKey: "system.roll.hp.advantage",
		img: "icons/magic/life/cross-area-circle-green-white.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.hpAdvantage",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	initAdvantage: {
		defaultValue: 1,
		effectKey: "system.roll.initiative.advantage",
		img: "icons/skills/movement/feet-winged-boots-glowing-yellow.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.initAdvantage",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	lightSource: {
		defaultValue: "REPLACEME",
		effectKey: "system.light.template",
		img: "icons/magic/light/torch-fire-orange.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.lightSource",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	meleeAttackBonus: {
		defaultValue: 1,
		effectKey: "system.roll.melee.bonus.all",
		img: "icons/skills/melee/strike-polearm-glowing-white.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.meleeAttackBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	meleeDamageBonus: {
		defaultValue: 1,
		effectKey: "system.roll.melee.damage.all",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.meleeDamageBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	permanentAbilityCha: {
		defaultValue: 18,
		effectKey: "system.abilities.cha.value",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.permanentAbilityCha",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	permanentAbilityCon: {
		defaultValue: 18,
		effectKey: "system.abilities.con.value",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.permanentAbilityCon",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	permanentAbilityDex: {
		defaultValue: 18,
		effectKey: "system.abilities.dex.value",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.permanentAbilityDex",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	permanentAbilityInt: {
		defaultValue: 18,
		effectKey: "system.abilities.int.value",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.permanentAbilityInt",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	permanentAbilityStr: {
		defaultValue: 18,
		effectKey: "system.abilities.str.value",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.permanentAbilityStr",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	permanentAbilityWis: {
		defaultValue: 18,
		effectKey: "system.abilities.wis.value",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.permanentAbilityWis",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	rangedAttackBonus: {
		defaultValue: 1,
		effectKey: "system.roll.ranged.bonus.all",
		img: "icons/weapons/ammunition/arrow-head-war-flight.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.rangedAttackBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	rangedDamageBonus: {
		defaultValue: 1,
		effectKey: "system.roll.ranged.damage.all",
		img: "icons/skills/melee/strike-axe-blood-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.rangedDamageBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	spellAdvantage: {
		defaultValue: 1,
		effectKey: "system.roll.spell.advantage.REPLACEME",
		img: "icons/magic/air/air-smoke-casting.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.spellAdvantage",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	spellCastingBonus: {
		defaultValue: 1,
		effectKey: "system.roll.spell.advantage.all",
		img: "icons/magic/fire/flame-burning-fist-strike.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.spellCastingBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	spellcastingClasses: {
		defaultValue: "REPLACEME",
		effectKey: "system.spellcasting.classes",
		img: "icons/sundries/documents/document-sealed-brown-red.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.spellcastingClasses",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	spellDamageBonus: {
		defaultValue: 1,
		effectKey: "system.roll.spell.damage",
		img: "icons/magic/lightning/orb-ball-blue.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.spellDamageBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	stoneSkinTalent: {
		defaultValue: "2+floor(@level.value/2)",
		effectKey: "system.attributes.ac.value",
		icon: "icons/magic/earth/strike-fist-stone-gray.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.stoneSkinTalent",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	unarmoredAcBonus: {
		defaultValue: 1,
		effectKey: "system.attributes.ac.unarmored",
		img: "icons/skills/melee/shield-block-gray-orange.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.unarmoredAcBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	weaponAttackBonus: {
		defaultValue: 1,
		effectKey: "system.roll.attack.bonus.this",
		img: "icons/skills/melee/strike-polearm-glowing-white.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.weaponAttackBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
		restriction: "Weapon",
	},
	weaponDamageBonus: {
		defaultValue: 1,
		effectKey: "system.roll.attack.damage.this",
		img: "icons/weapons/ammunition/arrow-head-war-flight.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.weaponDamageBonus",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
		restriction: "Weapon",
	},
	weaponDamageDieD12: {
		defaultValue: 4,
		effectKey: "system.roll.attack.upgrade-damage-die.REPLACEME",
		img: "icons/skills/ranged/arrows-flying-salvo-blue-light.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.weaponDamageDieD12",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	weaponDamageDieImprovementByProperty: {
		defaultValue: 1,
		effectKey: "system.roll.attack.upgrade-damage-die.REPLACEME",
		img: "icons/skills/ranged/arrows-flying-salvo-blue-light.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.weaponDamageDieImprovementByProperty",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
	weaponDamageMultiplier: {
		defaultValue: 2,
		effectKey: "system.roll.attack.damage.this",
		img: "icons/skills/melee/strike-hammer-destructive-orange.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.damageMultiplier",
		mode: "CONST.ACTIVE_EFFECT_MODES.OVERRIDE",
	},
	weaponMastery: {
		defaultValue: 1,
		effectKey: "system.bonuses.weaponMastery",
		img: "icons/skills/melee/weapons-crossed-swords-white-blue.webp",
		name: "SHADOWDARK.item.effect.predefined_effect.weaponMastery",
		mode: "CONST.ACTIVE_EFFECT_MODES.ADD",
	},
};

SHADOWDARK.VARIABLE_DURATIONS = [
	"days",
	"hours",
	"minutes",
	"realTime",
	"rounds",
	"seconds",
	"turns",
];

SHADOWDARK.DURATION_UNITS = {
	seconds: 1,
	rounds: 6,
	minutes: 60,
	turns: 600,
	hours: 3600,
	days: 86400,
};

SHADOWDARK.SPELL_RANGES = {
	self: "SHADOWDARK.range.self",
	touch: "SHADOWDARK.range.touch",
	close: "SHADOWDARK.range.close",
	near: "SHADOWDARK.range.near",
	doubleNear: "SHADOWDARK.range.double_near",
	far: "SHADOWDARK.range.far",
	oneMile: "SHADOWDARK.range.oneMile",
	samePlane: "SHADOWDARK.range.samePlane",
	unlimited: "SHADOWDARK.range.unlimited",
};

SHADOWDARK.SPELL_DAMAGE_TYPES = {
	none: "SHADOWDARK.spell_damage.types.none",
	damage: "SHADOWDARK.spell_damage.types.damage",
	healing: "SHADOWDARK.spell_damage.types.healing",
};

SHADOWDARK.TALENT_CLASSES = {
	ancestry: "SHADOWDARK.talent.class.ancestry",
	class: "SHADOWDARK.talent.class.class",
	level: "SHADOWDARK.talent.class.level",
	patronBoon: "SHADOWDARK.talent.class.patronBoon",
};

SHADOWDARK.TOKEN_HP_COLORS = {
	damage: 0xDD0000,
	healing: 0x00DD00,
	defeated: 0x303030,
};

SHADOWDARK.WEAPON_BASE_DAMAGE = {
	1: "1",
	d2: "1d2",
	d4: "1d4",
	d6: "1d6",
	d8: "1d8",
	d10: "1d10",
	d12: "1d12",
};

SHADOWDARK.WEAPON_BASE_DAMAGE_DIE_ONLY = {
	d2: "d2",
	d4: "d4",
	d6: "d6",
	d8: "d8",
	d10: "d10",
	d12: "d12",
};

SHADOWDARK.WEAPON_TYPES = {
	melee: "SHADOWDARK.weapon.type.melee",
	ranged: "SHADOWDARK.weapon.type.ranged",
};

// ---------------------------------------------------------------------------
// Fairy Magic
// ---------------------------------------------------------------------------

SHADOWDARK.GLAMOUR_USAGE_TYPES = {
	unlimited:  "SHADOWDARK.glamour.usage.unlimited",
	daily:      "SHADOWDARK.glamour.usage.daily",
	hourly:     "SHADOWDARK.glamour.usage.hourly",
	perSubject: "SHADOWDARK.glamour.usage.per_subject",
};

SHADOWDARK.RUNE_MAGNITUDES = {
	lesser:  "SHADOWDARK.rune.magnitude.lesser",
	greater: "SHADOWDARK.rune.magnitude.greater",
	mighty:  "SHADOWDARK.rune.magnitude.mighty",
};

// 2d6 Rune Granted table thresholds
SHADOWDARK.RUNE_GRANTED_TABLE = [
	{ max: 2,  result: "none" },
	{ max: 7,  result: "lesser" },
	{ max: 11, result: "greater" },
	{ max: 99, result: "mighty" },
];

// ---------------------------------------------------------------------------
// Dolmenwood Calendar
// ---------------------------------------------------------------------------

const DOLMENWOOD = {}

DOLMENWOOD.months = {
	grimvold:   { days: 30, sunrise: 8.0, sunset: 16.0 },
	lymewald:   { days: 28, sunrise: 8.0, sunset: 16.5 },
	haggryme:   { days: 30, sunrise: 7.5, sunset: 17.0 },
	symswald:   { days: 29, sunrise: 6.5, sunset: 18.0 },
	harchment:  { days: 29, sunrise: 6.0, sunset: 20.0 },
	iggwyld:    { days: 30, sunrise: 5.0, sunset: 21.0 },
	chysting:   { days: 31, sunrise: 4.5, sunset: 21.5 },
	lillipythe: { days: 29, sunrise: 5.0, sunset: 21.0 },
	haelhold:   { days: 28, sunrise: 6.0, sunset: 20.5 },
	reedwryme:  { days: 30, sunrise: 6.5, sunset: 19.5 },
	obthryme:   { days: 28, sunrise: 7.5, sunset: 18.0 },
	braghold:   { days: 30, sunrise: 7.5, sunset: 16.5 },
}

DOLMENWOOD.monthOffsets = {
	grimvold: 0, lymewald: 30, haggryme: 58, symswald: 88,
	harchment: 117, iggwyld: 146, chysting: 176, lillipythe: 207,
	haelhold: 236, reedwryme: 264, obthryme: 294, braghold: 322,
}

DOLMENWOOD.moonSignTable = [
	[1,3,'black','waning'],[4,17,'grinning','waxing'],[18,20,'grinning','full'],
	[21,33,'grinning','waning'],[34,46,'dead','waxing'],[47,49,'dead','full'],
	[50,62,'dead','waning'],[63,76,'beast','waxing'],[77,79,'beast','full'],
	[80,91,'beast','waning'],[92,105,'squamous','waxing'],[106,108,'squamous','full'],
	[109,121,'squamous','waning'],[122,134,'knights','waxing'],[135,137,'knights','full'],
	[138,150,'knights','waning'],[151,164,'rotting','waxing'],[165,167,'rotting','full'],
	[168,179,'rotting','waning'],[180,193,'maidens','waxing'],[194,196,'maidens','full'],
	[197,209,'maidens','waning'],[210,222,'witch','waxing'],[223,225,'witch','full'],
	[226,238,'witch','waning'],[239,252,'robbers','waxing'],[253,255,'robbers','full'],
	[256,267,'robbers','waning'],[268,281,'goat','waxing'],[282,284,'goat','full'],
	[285,297,'goat','waning'],[298,311,'narrow','waxing'],[312,314,'narrow','full'],
	[315,326,'narrow','waning'],[327,340,'black','waxing'],[341,343,'black','full'],
	[344,352,'black','waning'],
]

DOLMENWOOD.seasons = {
	winter: { months: ['grimvold','lymewald','haggryme'],   icon: 'fa-solid fa-snowflake' },
	spring: { months: ['symswald','harchment','iggwyld'],   icon: 'fa-solid fa-seedling' },
	summer: { months: ['chysting','lillipythe','haelhold'], icon: 'fa-solid fa-sun' },
	autumn: { months: ['reedwryme','obthryme','braghold'],  icon: 'fa-solid fa-leaf' },
}

DOLMENWOOD.unseasons = {
	hitching:    { icon: 'fa-solid fa-moon',     months: ['grimvold'] },
	vague:       { icon: 'fa-solid fa-smog',     months: ['lymewald','haggryme'] },
	colliggwyld: { icon: 'fa-solid fa-mushroom', months: ['iggwyld'] },
	chame:       { icon: 'fa-solid fa-snake',    months: ['haelhold'] },
}

DOLMENWOOD.BASE_YEAR      = 1089
DOLMENWOOD.DAYS_PER_YEAR  = 352
DOLMENWOOD.SECONDS_PER_DAY = 86400

DOLMENWOOD.monthToSeason = {}
for (const [season, data] of Object.entries(DOLMENWOOD.seasons)) {
	for (const month of data.months) DOLMENWOOD.monthToSeason[month] = season
}

DOLMENWOOD.weekDays = ['colly','chime','hayme','moot','frisk','eggfast','sunning']

DOLMENWOOD.wysendays = {
	grimvold:   ['Hanglemas', "Dyboll's Day"],
	haggryme:   ["Yarl's Day", 'The Day of Virgins'],
	symswald:   ['Hopfast'],
	harchment:  ['Smithing'],
	iggwyld:    ['Shortening', "Longshank's Day"],
	chysting:   ['Bradging', 'Copsewallow', 'Chalice'],
	lillipythe: ["Old Dobey's Day"],
	reedwryme:  ["Shub's Eve", 'Druden Day'],
	braghold:   ['The Day of Doors', 'Dolmenday'],
}

DOLMENWOOD.holidays = {
	grimvold:   { 1:'Feast of St. Vinicus', 4:'Feast of St. Albert', 5:'Feast of St. Offrid', 9:'Feast of St. Choad', 17:'Feast of St. Clyde', 19:'Winter Solstice & Feast of St. Elsa', 21:'Feast of St. Baldric', 27:'Feast of St. Cantius', 29:'Feast of St. Joane' },
	lymewald:   { 2:'Feast of St. Waylord', 3:'Feast of St. Gondyw', 9:'Feast of St. Calafredus', 15:'Feast of St. Wynne', 19:'Feast of St. Albrith', 23:'Feast of St. Fredulus', 28:'Feast of St. Eggort' },
	haggryme:   { 5:'Feast of St. Clister', 6:'Feast of St. Ponch', 11:'Feast of St. Flatius', 12:'Feast of St. Quister', 13:'Feast of St. Aeynid', 18:'Feast of St. Visyg', 22:'Feast of St. Pannard', 23:'Feast of St. Simone', 25:'Feast of St. Sortia', 27:'Feast of St. Pastery', 28:'Feast of St. Bethany', 29:'Feast of St. Tumbel', 30:'Feast of St. Lillibeth' },
	symswald:   { 1:'Feast of St. Gwigh', 2:'The Feast of Cats', 3:'Feast of St. Medigor', 5:'Feast of St. Ingrid', 7:'Feast of St. Neblit', 8:'Feast of St. Dullard', 10:'Feast of St. Whittery', 12:'Feast of St. Pious', 14:'Feast of St. Thorm', 18:'Feast of St. Goodenough', 20:'Vernal Equinox' },
	harchment:  { 7:'Feast of St. Craven', 9:'Feast of St. Rhilma', 10:'Feast of St. Talambeth', 16:'Feast of St. Jorrael', 19:'Feast of St. Hoargrime', 22:'Feast of St. Abthius', 24:'Feast of St. Primace', 26:'Feast of St. Knock', 29:'Feast of St. Wilbranch' },
	iggwyld:    { 3:'Feast of St. Gripe', 9:'Feast of St. Puriphon', 19:'Feast of St. Hildace', 27:'Feast of St. Maternis', 30:'Feast of St. Waylaine' },
	chysting:   { 6:'Feast of St. Nuncy', 10:'Feast of St. Apoplect', 16:'Feast of St. Cornice', 18:'Summer Solstice', 20:'Feast of St. Dougan', 27:'Feast of St. Sabian', 31:'Feast of St. Jubilant' },
	lillipythe: { 4:'Feast of St. Foggarty', 5:'Feast of St. Keye', 9:'Feast of St. Primula', 16:'Feast of St. Dillage', 20:'Feast of St. Torphia', 25:'Feast of St. Esther', 27:'Feast of St. Philodeus', 28:'Feast of St. Lummox', 29:'Feast of St. Capernott' },
	haelhold:   { 5:'Feast of St. Willibart', 8:'Feast of St. Sanguine', 10:'Feast of St. Benester', 15:'Feast of St. Faxis', 25:'Feast of St. Gretchen', 28:'Feast of St. Galaunt' },
	reedwryme:  { 1:'Feast of St. Dextre', 3:'Feast of St. Wick', 4:'Feast of St. Elephantine', 8:'Feast of St. Moribund', 13:'Feast of St. Loame', 18:'Feast of St. Shank', 19:'Autumnal Equinox', 21:'Feast of St. Hollyhock', 22:'Feast of St. Egbert', 25:'Feast of St. Clewyd', 26:'Feast of St. Howarth', 27:'Feast of St. Howdych', 29:'Feast of St. Signis', 30:'Festival of the Green Man' },
	obthryme:   { 7:'Feast of St. Horace', 9:'Feast of St. Hamfast', 13:'Feast of St. Woad', 22:'Feast of St. Hodwich', 24:'Feast of St. Wort', 27:'Feast of St. Godfrey', 28:'Feast of St. Dank' },
	braghold:   { 9:'Feast of St. Poltry', 10:'Feast of St. Sedge', 15:'Feast of St. Clyve', 21:'Feast of St. Gawain', 25:'Feast of St. Thridgold', 28:'Feast of St. Therese', 29:'Feast of St. Habicus', 30:'The Hunting of the Winter Hart & Feast of St. Willofrith' },
}

DOLMENWOOD.weatherTableNames = {
	winter: 'Weather — Winter', spring: 'Weather — Spring',
	summer: 'Weather — Summer', autumn: 'Weather — Autumn',
	hitching: 'Weather — Hitching', vague: 'Weather — Vague',
}

DOLMENWOOD.unseasonWeatherTable = {
	hitching: 'hitching', vague: 'vague',
	colliggwyld: 'spring', chame: 'summer',
}

export { DOLMENWOOD };
export default SHADOWDARK;
