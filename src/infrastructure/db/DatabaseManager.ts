import * as SQLite from 'expo-sqlite';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private dbPromise: Promise<SQLite.SQLiteDatabase>;

  private constructor() {
    this.dbPromise = SQLite.openDatabaseAsync('glosapp.db');
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async getDatabase(): Promise<SQLite.SQLiteDatabase> {
    return this.dbPromise;
  }

  public async initialize(): Promise<void> {
    const db = await this.getDatabase();

    // Create tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        original TEXT NOT NULL,
        translation TEXT NOT NULL,
        pronunciation TEXT,
        exampleOriginal TEXT,
        exampleTranslation TEXT,
        category TEXT
      );

      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        contentId TEXT NOT NULL,
        learnedAt TEXT NOT NULL,
        FOREIGN KEY (contentId) REFERENCES content (id)
      );

      CREATE TABLE IF NOT EXISTS streak (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        currentStreak INTEGER DEFAULT 0,
        lastLearnedDate TEXT,
        maxStreak INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS daily_content (
        date TEXT PRIMARY KEY,
        contentId TEXT NOT NULL,
        FOREIGN KEY (contentId) REFERENCES content (id)
      );
    `);

    // Initialize streak row if not exists
    const streakResult = await db.getFirstAsync('SELECT * FROM streak WHERE id = 1');
    if (!streakResult) {
      await db.runAsync('INSERT INTO streak (id, currentStreak, lastLearnedDate, maxStreak) VALUES (1, 0, NULL, 0)');
    }
  }
}
