import { IHistoryRepository, LearnedContent } from '../../domain/repositories/IHistoryRepository';
import { History } from '../../domain/entities/History';
import { DatabaseManager } from './DatabaseManager';
import * as Crypto from 'expo-crypto';

export class SQLiteHistoryRepository implements IHistoryRepository {
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  async markAsLearned(contentId: string): Promise<History> {
    const db = await this.dbManager.getDatabase();
    const id = Crypto.randomUUID();
    const learnedAt = new Date().toISOString();

    await db.runAsync(
      'INSERT INTO history (id, contentId, learnedAt) VALUES (?, ?, ?)',
      [id, contentId, learnedAt]
    );

    return { id, contentId, learnedAt };
  }

  async getLearnedContentIds(): Promise<string[]> {
    const db = await this.dbManager.getDatabase();
    const result = await db.getAllAsync<{ contentId: string }>('SELECT contentId FROM history');
    return result.map(row => row.contentId);
  }

  async isLearned(contentId: string): Promise<boolean> {
    const db = await this.dbManager.getDatabase();
    const result = await db.getFirstAsync('SELECT 1 FROM history WHERE contentId = ?', [contentId]);
    return !!result;
  }

  async getAllHistory(): Promise<History[]> {
    const db = await this.dbManager.getDatabase();
    const result = await db.getAllAsync<History>('SELECT * FROM history ORDER BY learnedAt DESC');
    return result;
  }

  async getLearnedContent(): Promise<LearnedContent[]> {
    const db = await this.dbManager.getDatabase();
    const query = `
      SELECT c.*, h.learnedAt
      FROM history h
      JOIN content c ON h.contentId = c.id
      ORDER BY h.learnedAt DESC
    `;
    const result = await db.getAllAsync<LearnedContent>(query);
    return result;
  }
}
