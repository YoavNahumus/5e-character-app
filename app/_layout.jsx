import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
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
