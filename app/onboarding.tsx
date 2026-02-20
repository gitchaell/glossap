import { useState } from 'react';
import { Box, VStack, Text, Button, ButtonText, Heading, Center } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { NotificationService } from '../src/infrastructure/notifications/NotificationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleStart = async () => {
    setLoading(true);
    try {
      const notifService = new NotificationService();
      const granted = await notifService.requestPermissions();

      if (granted) {
        // Default 9:00 AM notification
        await notifService.scheduleDailyNotification(9, 0);
      }

      await SecureStore.setItemAsync('hasOnboarded', 'true');
      router.replace('/(tabs)/home');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="$backgroundLight0" p="$4" pt={insets.top} pb={insets.bottom}>
      <Center flex={1}>
        <VStack space="xl" alignItems="center">
          <Heading size="2xl" color="$primary600" fontFamily="GoogleSans-Bold">
            Glosapp
          </Heading>
          <Text textAlign="center" size="lg" fontFamily="GoogleSans">
            Aprende una palabra nueva cada día.
            {"\n"}
            Portugués 🇧🇷 ↔️ Español 🇪🇸
          </Text>

          <Box mt="$8">
            <Button size="xl" variant="solid" action="primary" onPress={handleStart} isDisabled={loading}>
              <ButtonText fontFamily="GoogleSans-Bold">
                {loading ? 'Configurando...' : 'Empezar'}
              </ButtonText>
            </Button>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
}
