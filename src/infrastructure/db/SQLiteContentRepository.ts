import { IContentRepository } from '../../domain/repositories/IContentRepository';
import { Content } from '../../domain/entities/Content';
import { DatabaseManager } from './DatabaseManager';

export class SQLiteContentRepository implements IContentRepository {
  private dbManager: DatabaseManager;

  constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  async getRandomContent(excludeIds: string[]): Promise<Content | null> {
    const db = await this.dbManager.getDatabase();

    // Construct the query
    let query = 'SELECT * FROM content';
    const params: any[] = [];

    if (excludeIds.length > 0) {
      const placeholders = excludeIds.map(() => '?').join(',');
      query += ` WHERE id NOT IN (${placeholders})`;
      params.push(...excludeIds);
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await db.getFirstAsync(query, params);

    if (!result) return null;

    return result as Content;
  }

  async getRandomUnlearnedContent(): Promise<Content | null> {
    const db = await this.dbManager.getDatabase();

    // Efficiently select content not in history
    const query = `
      SELECT c.*
      FROM content c
      LEFT JOIN history h ON c.id = h.contentId
      WHERE h.contentId IS NULL
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const result = await db.getFirstAsync(query);
    if (!result) return null;
    return result as Content;
  }

  async getContentById(id: string): Promise<Content | null> {
    const db = await this.dbManager.getDatabase();
    const result = await db.getFirstAsync('SELECT * FROM content WHERE id = ?', [id]);
    return result as Content | null;
  }

  async seedData(data: Content[]): Promise<void> {
    const db = await this.dbManager.getDatabase();

    // Check if data already exists to avoid duplicates or re-seeding if unnecessary
    // Alternatively, we can use INSERT OR IGNORE

    for (const item of data) {
      await db.runAsync(
        `INSERT OR IGNORE INTO content (id, type, original, translation, pronunciation, exampleOriginal, exampleTranslation, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.type,
          item.original,
          item.translation,
          item.pronunciation || null,
          item.exampleOriginal || null,
          item.exampleTranslation || null,
          item.category || null
        ]
      );
    }
  }

  async getDailyContentId(date: string): Promise<string | null> {
    const db = await this.dbManager.getDatabase();
    const result = await db.getFirstAsync<{ contentId: string }>(
      'SELECT contentId FROM daily_content WHERE date = ?',
      [date]
    );
    return result ? result.contentId : null;
  }

  async setDailyContentId(date: string, contentId: string): Promise<void> {
    const db = await this.dbManager.getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO daily_content (date, contentId) VALUES (?, ?)',
      [date, contentId]
    );
  }
}
