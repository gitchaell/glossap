import { IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { Streak } from '../../domain/entities/Streak';
import { DatabaseManager } from './DatabaseManager';

export class SQLiteStreakRepository implements IStreakRepository {
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  async getStreak(): Promise<Streak> {
    const db = await this.dbManager.getDatabase();
    const result = await db.getFirstAsync('SELECT * FROM streak WHERE id = 1');

    if (!result) {
      // This should have been initialized in DatabaseManager
      // But in case of edge cases, return default
      return { currentStreak: 0, lastLearnedDate: null, maxStreak: 0 };
    }

    return result as Streak;
  }

  async saveStreak(streak: Streak): Promise<void> {
    const db = await this.dbManager.getDatabase();

    await db.runAsync(
      'UPDATE streak SET currentStreak = ?, lastLearnedDate = ?, maxStreak = ? WHERE id = 1',
      [streak.currentStreak, streak.lastLearnedDate, streak.maxStreak]
    );
  }
}
