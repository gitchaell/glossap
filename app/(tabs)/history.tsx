import { useEffect, useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, VStack, Text, Heading, Center, HStack } from '@gluestack-ui/themed';
import { SQLiteHistoryRepository } from '../../src/infrastructure';
import { LearnedContent } from '../../src/domain/repositories/IHistoryRepository';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const historyRepo = new SQLiteHistoryRepository();

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<LearnedContent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await historyRepo.getLearnedContent();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <Box flex={1} bg="$backgroundLight0" pt={insets.top}>
      <VStack space="md" p="$4" flex={1}>
        <Heading size="xl" color="$primary600" fontFamily="GoogleSans-Bold" mb="$4">
          Historial de Aprendizaje
        </Heading>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadHistory} />
          }
          ListEmptyComponent={
            <Center mt="$10">
              <Text fontFamily="GoogleSans">Aún no has aprendido ninguna palabra.</Text>
            </Center>
          }
          renderItem={({ item }) => (
            <Box
              bg="$white"
              p="$4"
              mb="$3"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$borderLight200"
            >
              <HStack justifyContent="space-between" alignItems="center">
                <VStack>
                  <Text size="lg" fontFamily="GoogleSans-Bold" color="$textLight800">
                    {item.original}
                  </Text>
                  <Text size="sm" fontFamily="GoogleSans" color="$textLight500">
                    {item.translation}
                  </Text>
                </VStack>
                <Text size="xs" fontFamily="GoogleSansCode" color="$textLight400">
                  {format(new Date(item.learnedAt), 'd MMM', { locale: es })}
                </Text>
              </HStack>
            </Box>
          )}
        />
      </VStack>
    </Box>
  );
}
