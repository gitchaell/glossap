import { IHistoryRepository } from '../../domain/repositories/IHistoryRepository';
import { IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { Streak } from '../../domain/entities/Streak';
import { format, isSameDay, subDays, parseISO } from 'date-fns';

export class MarkAsLearnedUseCase {
  constructor(
    private historyRepository: IHistoryRepository,
    private streakRepository: IStreakRepository
  ) {}

  async execute(contentId: string): Promise<Streak> {
    const isLearned = await this.historyRepository.isLearned(contentId);
    if (isLearned) {
      // Already learned, just return current streak
      return this.streakRepository.getStreak();
    }

    // 1. Mark as learned
    await this.historyRepository.markAsLearned(contentId);

    // 2. Update Streak
    const streak = await this.streakRepository.getStreak();
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastDate = streak.lastLearnedDate;

    let newCurrentStreak = streak.currentStreak;
    let newMaxStreak = streak.maxStreak;

    if (!lastDate) {
      // First time learning
      newCurrentStreak = 1;
    } else {
      const lastLearnedDate = parseISO(lastDate);
      const yesterday = subDays(new Date(), 1);

      if (lastDate === today) {
        // Already learned something today, streak stays same (or increments if logic is per word, but usually streak is per day)
        // Usually streak is "days in a row". So if I learned today already, streak doesn't increase.
        // We do nothing to currentStreak.
      } else if (isSameDay(lastLearnedDate, yesterday)) {
        // Learned yesterday, increment streak
        newCurrentStreak += 1;
      } else {
        // Missed a day or more, reset streak
        // Wait, if lastLearnedDate is older than yesterday, streak breaks.
        newCurrentStreak = 1;
      }
    }

    if (newCurrentStreak > newMaxStreak) {
      newMaxStreak = newCurrentStreak;
    }

    const newStreak: Streak = {
      currentStreak: newCurrentStreak,
      lastLearnedDate: today,
      maxStreak: newMaxStreak
    };

    await this.streakRepository.saveStreak(newStreak);

    return newStreak;
  }
}
