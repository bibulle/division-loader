import * as Mongoose from 'mongoose';

export interface ICharacterStats extends Mongoose.Document {
  dateStart: Date;
  dateEnd: Date;
  userId: string;

  platformInfo: {
    platformSlug: string;
    platformUserId: string;
    platformUserHandle: string;
    platformUserIdentifier: string;
    avatarUrl: string;
  };
  userInfo: {
    userId: number;
  };
  stats: {
    timePlayed: IStat;
    killsPvP: IStat;
    killsNpc: IStat;
    killsSkill: IStat;
    headshots: IStat;
    itemsLooted: IStat;
    xPTotal: IStat;
    xPClan: IStat;
    specialization: IStat;
    killsSpecializationSharpshooter: IStat;
    killsSpecializationSurvivalist: IStat;
    killsSpecializationDemolitionist: IStat;
    eCreditBalance: IStat;
    commendationCount: IStat;
    commendationScore: IStat;
    latestGearScore: IStat;
    highestPlayerLevel: IStat;
    xPPve: IStat;
    timePlayedPve: IStat;
    killsRoleElite: IStat;
    killsRoleNamed: IStat;
    killsFactionBlackbloc: IStat;
    killsFactionCultists: IStat;
    killsFactionMilitia: IStat;
    killsFactionEndgame: IStat;
    rankDZ: IStat;
    xPDZ: IStat;
    timePlayedDarkZone: IStat;
    roguesKilled: IStat;
    timePlayedRogue: IStat;
    timePlayedRogueLongest: IStat;
    killsFactionDzBlackbloc: IStat;
    killsFactionDzCultists: IStat;
    killsFactionDzMilitia: IStat;
    killsFactionDzEndgame: IStat;
    killsRoleDzElite: IStat;
    killsRoleDzNamed: IStat;
    latestConflictRank: IStat;
    xPPvp: IStat;
    timePlayedConflict: IStat;
    killsBleeding: IStat;
    killsBurning: IStat;
    killsShocked: IStat;
    killsEnsnare: IStat;
    killsHeadshot: IStat;
    killsWeaponShotgun: IStat;
    killsWeaponSubMachinegun: IStat;
    killsWeaponMounted: IStat;
    killsWeaponPistol: IStat;
    killsWeaponRifle: IStat;
    killsWeaponGrenade: IStat;
    itemsLootedPerMin: IStat;
    killsPvPPerMin: IStat;
    killsNpcPerMin: IStat;
    playersKilled: IStat;
    killsSkillPerMin: IStat;
  };
}

export interface IStat {
  rank: number;
  percentile: number;
  displayName: string;
  displayCategory: string;
  category: string;
  description: string;
  // "metadata": {},
  value: number | string;
  displayValue: string;
  displayType: string;
}
