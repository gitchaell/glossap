import { IStreakRepository } from '../../domain/repositories/IStreakRepository';
import { Streak } from '../../domain/entities/Streak';

export class GetStreakUseCase {
  constructor(private streakRepository: IStreakRepository) {}

  async execute(): Promise<Streak> {
    return this.streakRepository.getStreak();
  }
}
