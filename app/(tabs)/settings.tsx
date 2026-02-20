import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Box, VStack, Heading, Button, ButtonText, Text } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NotificationService } from '../../src/infrastructure';
import { DatabaseManager } from '../../src/infrastructure';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Settings() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);

    if (event.type === 'set' || Platform.OS === 'ios') {
      const notifService = new NotificationService();
      await notifService.scheduleDailyNotification(currentDate.getHours(), currentDate.getMinutes());
      Alert.alert('Notificación configurada', `Recibirás una palabra diaria a las ${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}`);
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Reiniciar Progreso',
      '¿Estás seguro? Perderás todo tu historial y racha.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            const db = await DatabaseManager.getInstance().getDatabase();
            await db.runAsync('DELETE FROM history');
            await db.runAsync('UPDATE streak SET currentStreak=0, maxStreak=0, lastLearnedDate=NULL WHERE id=1');
            await db.runAsync('DELETE FROM daily_content');
            // await SecureStore.setItemAsync('hasOnboarded', '');
            Alert.alert('Progreso reiniciado');
          }
        }
      ]
    );
  };

  return (
    <Box flex={1} bg="$backgroundLight0" p="$4" pt={insets.top}>
      <VStack space="xl">
        <Heading size="xl" fontFamily="GoogleSans-Bold" color="$primary600">
          Ajustes
        </Heading>

        <VStack space="md">
          <Text size="md" fontFamily="GoogleSans-Bold">Notificaciones</Text>
          <Text size="sm" fontFamily="GoogleSans">Elige la hora para recibir tu palabra diaria.</Text>

          <Button onPress={() => setShowPicker(true)} variant="outline">
            <ButtonText>
              {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
            </ButtonText>
          </Button>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </VStack>

        <VStack space="md" mt="$8">
          <Text size="md" fontFamily="GoogleSans-Bold" color="$error600">Zona de Peligro</Text>
          <Button action="negative" onPress={handleReset}>
            <ButtonText>Reiniciar Progreso</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
