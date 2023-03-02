export class CharacterStats {
  _id?: string;
  dateStart: Date = new Date(0);
  dateEnd: Date = new Date(0);
  userId = '';

  platformInfo = {
    platformSlug: '',
    platformUserId: '',
    platformUserHandle: '',
    platformUserIdentifier: '',
    avatarUrl: '',
  };
  userInfo = {
    userId: 0,
  };
  stats = {
    timePlayed: new Stat(),
    killsPvP: new Stat(),
    killsNpc: new Stat(),
    killsSkill: new Stat(),
    headshots: new Stat(),
    itemsLooted: new Stat(),
    xPTotal: new Stat(),
    xPClan: new Stat(),
    specialization: new Stat(),
    killsSpecializationSharpshooter: new Stat(),
    killsSpecializationSurvivalist: new Stat(),
    killsSpecializationDemolitionist: new Stat(),
    eCreditBalance: new Stat(),
    commendationCount: new Stat(),
    commendationScore: new Stat(),
    latestGearScore: new Stat(),
    highestPlayerLevel: new Stat(),
    xPPve: new Stat(),
    timePlayedPve: new Stat(),
    killsRoleElite: new Stat(),
    killsRoleNamed: new Stat(),
    killsFactionBlackbloc: new Stat(),
    killsFactionCultists: new Stat(),
    killsFactionMilitia: new Stat(),
    killsFactionEndgame: new Stat(),
    rankDZ: new Stat(),
    xPDZ: new Stat(),
    timePlayedDarkZone: new Stat(),
    roguesKilled: new Stat(),
    timePlayedRogue: new Stat(),
    timePlayedRogueLongest: new Stat(),
    killsFactionDzBlackbloc: new Stat(),
    killsFactionDzCultists: new Stat(),
    killsFactionDzMilitia: new Stat(),
    killsFactionDzEndgame: new Stat(),
    killsRoleDzElite: new Stat(),
    killsRoleDzNamed: new Stat(),
    latestConflictRank: new Stat(),
    xPPvp: new Stat(),
    timePlayedConflict: new Stat(),
    killsBleeding: new Stat(),
    killsBurning: new Stat(),
    killsShocked: new Stat(),
    killsEnsnare: new Stat(),
    killsHeadshot: new Stat(),
    killsWeaponShotgun: new Stat(),
    killsWeaponSubMachinegun: new Stat(),
    killsWeaponMounted: new Stat(),
    killsWeaponPistol: new Stat(),
    killsWeaponRifle: new Stat(),
    killsWeaponGrenade: new Stat(),
    itemsLootedPerMin: new Stat(),
    killsPvPPerMin: new Stat(),
    killsNpcPerMin: new Stat(),
    playersKilled: new Stat(),
    killsSkillPerMin: new Stat(),
  };
}

export class Stat {
  rank: number | null = null;
  percentile: number | null = null;
  displayName = '';
  displayCategory = '';
  category = '';
  description: string | null = null;
  value: number | null = null;
  displayValue: string | null = null;
  displayType = '';
}
