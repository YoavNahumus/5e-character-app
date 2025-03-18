import { Stack } from 'expo-router';

export default function SpellsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Spells',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}
