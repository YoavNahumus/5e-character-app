import { TouchableOpacity } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemedTouchableOpacity({ style, lightColor, darkColor, ...otherProps }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  
  return <TouchableOpacity style={[{ backgroundColor: color }, style]} {...otherProps} />;
}