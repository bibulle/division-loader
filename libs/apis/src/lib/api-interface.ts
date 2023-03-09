import { CharacterStats, StatDescription } from './character-stats';
import { Version } from './version';

/**
 * API content
 */
export interface ApiReturn {
  version: Version;
  data: CharacterStats[] | StatDescription[];
}
