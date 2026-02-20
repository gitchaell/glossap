import * as FileSystem from 'expo-file-system';
import { Content } from '../../domain/entities/Content';

// @ts-ignore
const WIDGET_DATA_FILE = (FileSystem.documentDirectory || '') + 'widget_data.json';

export class WidgetDataService {
  /**
   * Updates the widget data with the current content.
   * In a real app with native extensions, this would write to shared storage (UserDefaults/SharedPrefs).
   * Note: For iOS Widgets, you must use App Groups and write to a shared container path,
   * not documentDirectory. This implementation simulates the data update.
   */
  async updateWidgetData(content: Content): Promise<void> {
    try {
      const data = {
        title: content.original,
        subtitle: content.translation,
        updatedAt: new Date().toISOString(),
      };

      await FileSystem.writeAsStringAsync(WIDGET_DATA_FILE, JSON.stringify(data));
      // console.log('Widget data updated:', data);
    } catch (error) {
      console.error('Error updating widget data:', error);
    }
  }

  /**
   * Reads the current widget data (for debugging/verification).
   */
  async getWidgetData(): Promise<any | null> {
    try {
      const info = await FileSystem.getInfoAsync(WIDGET_DATA_FILE);
      if (!info.exists) return null;

      const content = await FileSystem.readAsStringAsync(WIDGET_DATA_FILE);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading widget data:', error);
      return null;
    }
  }
}
