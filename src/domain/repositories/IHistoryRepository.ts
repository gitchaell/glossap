import { History } from '../entities/History';
import { Content } from '../entities/Content';

export type LearnedContent = Content & { learnedAt: string };

export interface IHistoryRepository {
  /**
   * Records a content item as learned.
   */
  markAsLearned(contentId: string): Promise<History>;

  /**
   * Retrieves all learned content IDs.
   */
  getLearnedContentIds(): Promise<string[]>;

  /**
   * Checks if a content item has been learned.
   */
  isLearned(contentId: string): Promise<boolean>;

  /**
   * Get all history records
   */
  getAllHistory(): Promise<History[]>;

  /**
   * Get all learned content with details.
   */
  getLearnedContent(): Promise<LearnedContent[]>;
}
