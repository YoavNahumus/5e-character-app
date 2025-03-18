import { Stack } from 'expo-router';

export default function CharacterLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="new" 
        options={{ 
          title: 'Create Character',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
