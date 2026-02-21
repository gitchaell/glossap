import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Text, Button, ButtonText, Heading, Center } from '@gluestack-ui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useToken } from '@gluestack-style/react';
import {
  GetDailyContentUseCase,
  MarkAsLearnedUseCase,
  GetStreakUseCase
} from '../../src/application';
import {
  SQLiteContentRepository,
  SQLiteHistoryRepository,
  SQLiteStreakRepository,
  WidgetDataService
} from '../../src/infrastructure';
import { Content } from '../../src/domain/entities/Content';
import { Streak } from '../../src/domain/entities/Streak';

// Singleton instances
const contentRepo = new SQLiteContentRepository();
const historyRepo = new SQLiteHistoryRepository();
const streakRepo = new SQLiteStreakRepository();
const widgetService = new WidgetDataService();

const getDailyContentUseCase = new GetDailyContentUseCase(contentRepo);
const markAsLearnedUseCase = new MarkAsLearnedUseCase(historyRepo, streakRepo);
const getStreakUseCase = new GetStreakUseCase(streakRepo);

export default function Home() {
  const [content, setContent] = useState<Content | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLearned, setIsLearned] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const primary600 = useToken('colors', 'primary600');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const dailyContent = await getDailyContentUseCase.execute();
      const currentStreak = await getStreakUseCase.execute();

      setContent(dailyContent);
      setStreak(currentStreak);

      if (dailyContent) {
        const learned = await historyRepo.isLearned(dailyContent.id);
        setIsLearned(learned);

        await widgetService.updateWidgetData(dailyContent);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLearn = async () => {
    if (!content) return;
    try {
      const newStreak = await markAsLearnedUseCase.execute(content.id);
      setStreak(newStreak);
      setIsLearned(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <Center flex={1}><ActivityIndicator /></Center>;
  }

  if (!content) {
    return (
      <Center flex={1}>
        <Text>No hay contenido disponible. ¡Has aprendido todo!</Text>
      </Center>
    );
  }

  return (
    <Box flex={1} bg="$backgroundLight0" p="$4" pt={insets.top}>
       <VStack space="md" alignItems="center" mt="$4">
          <HStack space="xs" alignItems="center">
            <Heading size="md" color="$primary600">Racha: {streak?.currentStreak || 0}</Heading>
            <MaterialCommunityIcons name="fire" size={24} color={primary600} />
          </HStack>
       </VStack>

       <Center flex={1}>
         <Box
           bg="$white"
           p="$6"
           borderRadius="$lg"
           w="$full"
           shadowColor="$black"
           shadowOffset={{ width: 0, height: 2 }}
           shadowOpacity={0.1}
           shadowRadius={4}
           elevation={2}
         >
            <VStack space="lg" alignItems="center">
              <Text size="sm" color="$textLight500" fontFamily="GoogleSans">
                {content.type === 'word' ? 'Palabra del día' : 'Frase del día'}
              </Text>

              <Heading size="3xl" textAlign="center" fontFamily="GoogleSans-Bold" color="$primary700">
                {content.original}
              </Heading>

              {content.pronunciation && (
                 <Text size="sm" fontFamily="GoogleSansCode" color="$textLight400">
                   {content.pronunciation}
                 </Text>
              )}

              <Box bg="$primary50" p="$4" borderRadius="$md" w="$full" alignItems="center">
                <Text size="xl" fontFamily="GoogleSans" textAlign="center" color="$textLight800">
                  {content.translation}
                </Text>
              </Box>

              {content.exampleOriginal && (
                <VStack space="xs" w="$full" mt="$2">
                   <Text size="sm" fontFamily="GoogleSans" color="$textLight500">Ejemplo:</Text>
                   <Text fontFamily="GoogleSans" fontStyle="italic">"{content.exampleOriginal}"</Text>
                   <Text fontFamily="GoogleSans" color="$textLight500">{content.exampleTranslation}</Text>
                </VStack>
              )}
            </VStack>
         </Box>
       </Center>

       <Box p="$4" mb="$8">
         {!isLearned ? (
           <Button size="xl" onPress={handleLearn}>
             <ButtonText fontFamily="GoogleSans-Bold">Marcar como Aprendido</ButtonText>
           </Button>
         ) : (
           <Button size="xl" variant="outline" isDisabled>
             <ButtonText fontFamily="GoogleSans-Bold">¡Aprendido hoy!</ButtonText>
           </Button>
         )}
       </Box>
    </Box>
  );
}
