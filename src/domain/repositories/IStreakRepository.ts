import { Streak } from '../entities/Streak';

export interface IStreakRepository {
  /**
   * Gets the current streak data.
   */
  getStreak(): Promise<Streak>;

  /**
   * Saves the streak state.
   */
  saveStreak(streak: Streak): Promise<void>;
}
