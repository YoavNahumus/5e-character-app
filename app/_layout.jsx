import { Stack } from 'expo-router';
import ThemedStack from '../components/ThemedStack';
import { View } from 'react-native-web';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemedStack screenOptions={{headerShadowVisible: false}}>
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
      </ThemedStack>
    </View>
  );
}
