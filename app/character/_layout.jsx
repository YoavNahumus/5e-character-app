import { Stack } from 'expo-router';

export default function CharacterLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="new" 
        options={{ 
          title: 'Create Character',
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
