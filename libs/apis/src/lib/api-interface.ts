import { CharacterStats, CategoryDescription } from './character-stats';
import { Version } from './version';

/**
 * API content
 */
export interface ApiReturn {
  version: Version;
  data: CharacterStats[] | CategoryDescription[];
}
