import { IContentRepository } from '../../domain/repositories/IContentRepository';
import { Content } from '../../domain/entities/Content';
import { format } from 'date-fns';

export class GetDailyContentUseCase {
  constructor(
    private contentRepository: IContentRepository
  ) {}

  async execute(): Promise<Content | null> {
    const today = format(new Date(), 'yyyy-MM-dd');

    // 1. Check if we already have content for today
    const dailyId = await this.contentRepository.getDailyContentId(today);
    if (dailyId) {
      return this.contentRepository.getContentById(dailyId);
    }

    // 2. If not, get random content excluding learned ones
    const newContent = await this.contentRepository.getRandomUnlearnedContent();

    if (newContent) {
      // 3. Save as today's content
      await this.contentRepository.setDailyContentId(today, newContent.id);
      return newContent;
    }

    return null; // All content learned or empty DB
  }
}
