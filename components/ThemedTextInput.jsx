import { TextInput } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemedTextInput({ style, lightColor, darkColor, ...otherProps }) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
    
    return <TextInput style={[{ color }, { borderColor }, { backgroundColor }, style]} {...otherProps} />;
}
