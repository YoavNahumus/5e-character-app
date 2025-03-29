import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ThemeProvider } from '../constants/Theme';
import { Colors } from '../constants/Colors';
import { useTheme } from '../constants/Theme';

function ThemedLayout() {
  const { theme } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      <Stack 
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
          headerTintColor: Colors[theme].text,
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
          name="renderer_demo" 
          options={{ 
            headerShown: false 
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

export default function Layout() {
  return (
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  );
}
