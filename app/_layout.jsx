import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{headerShadowVisible: false}}>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="home" 
          options={{ 
            title: 'Characters'
          }} 
        />
        <Stack.Screen 
          name="character" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="spells" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </View>
  );
}
