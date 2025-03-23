import { ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack } from "expo-router";

import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedScrollView({ style, lightColor, darkColor, ...otherProps }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export default function ThemedStack({ style, lightColor, darkColor, screenOptions, ...otherProps }) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    style = { backgroundColor: backgroundColor, ...style };
    screenOptions = { headerStyle: style, contentStyle: style, headerTitleStyle: { color: textColor }, ...screenOptions };

    return <Stack style={style} screenOptions={screenOptions} {...otherProps} />;
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

export function ThemedTextInput({ style, lightColor, darkColor, ...otherProps }) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
    
    return <TextInput style={[{ color }, { borderColor }, { backgroundColor }, style]} {...otherProps} />;
}

export function ThemedTouchableOpacity({ style, lightColor, darkColor, ...otherProps }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  
  return <TouchableOpacity style={[{ backgroundColor: color }, style]} {...otherProps} />;
}

export function ThemedView({ style, lightColor, darkColor, ...otherProps }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
