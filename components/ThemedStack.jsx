import { Stack } from "expo-router";

import { useThemeColor } from "../hooks/useThemeColor";

export default function ThemedStack({ style, lightColor, darkColor, screenOptions, ...otherProps }) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    style = { ...style, backgroundColor: backgroundColor };
    screenOptions = { ...screenOptions, headerStyle: style, contentStyle: style, headerTitleStyle: { color: textColor } };

    return <Stack style={style} screenOptions={screenOptions} {...otherProps} />;
}