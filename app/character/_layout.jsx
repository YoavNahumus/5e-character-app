import { Stack } from 'expo-router';
import ThemedStack from '../../components/ThemedStack';

export default function CharacterLayout() {
  return (
    <ThemedStack>
      <Stack.Screen 
        name="new" 
        options={{ 
          title: 'Create Character',
          headerShadowVisible: false,
        }} 
      />
    </ThemedStack>
  );
}
