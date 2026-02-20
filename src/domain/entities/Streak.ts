export interface Streak {
  currentStreak: number;
  lastLearnedDate: string | null; // ISO date string (YYYY-MM-DD)
  maxStreak: number;
}
