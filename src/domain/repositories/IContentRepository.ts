import { Content } from '../entities/Content';

export interface IContentRepository {
  /**
   * Retrieves a random content item, excluding the specified IDs.
   * @param excludeIds List of content IDs to exclude (e.g., already learned)
   */
  getRandomContent(excludeIds: string[]): Promise<Content | null>;

  /**
   * Retrieves a random unlearned content item efficiently.
   */
  getRandomUnlearnedContent(): Promise<Content | null>;

  /**
   * Retrieves a content item by its ID.
   */
  getContentById(id: string): Promise<Content | null>;

  /**
   * Seeds the database with initial data if empty.
   */
  seedData(data: Content[]): Promise<void>;

  /**
   * Gets the content assigned to a specific date.
   */
  getDailyContentId(date: string): Promise<string | null>;

  /**
   * Assigns a content ID to a specific date.
   */
  setDailyContentId(date: string, contentId: string): Promise<void>;
}
