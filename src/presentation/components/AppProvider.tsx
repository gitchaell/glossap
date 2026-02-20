import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config } from '../theme/config';
import { useFonts } from 'expo-font';
import {
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { DatabaseManager } from '../../infrastructure/db/DatabaseManager';
import { SQLiteContentRepository } from '../../infrastructure/db/SQLiteContentRepository';
import { INITIAL_CONTENT } from '../../infrastructure/seed/contentSeed';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = useFonts({
    'GoogleSans': OpenSans_400Regular,
    'GoogleSans-Bold': OpenSans_700Bold,
    'GoogleSansCode': RobotoMono_400Regular,
  });

  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const dbManager = DatabaseManager.getInstance();
        await dbManager.initialize();

        const contentRepo = new SQLiteContentRepository();
        await contentRepo.seedData(INITIAL_CONTENT);

        setDbReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && dbReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <GluestackUIProvider config={config}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        {children}
      </View>
    </GluestackUIProvider>
  );
};
