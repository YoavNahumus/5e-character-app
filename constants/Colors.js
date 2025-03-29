/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#000000',
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorLight,
    card: '#f8f9fa',
    border: '#e9ecef',
    inputBackground: '#ffffff',
    primary: '#6200ea',
    secondary: '#4b4ba5',
    accent: '#2196F3',
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196F3',
    surface: '#ffffff',
    onSurface: '#000000',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1a1c1d',
    border: '#2f3336',
    inputBackground: '#2f3336',
    primary: '#bb86fc',
    secondary: '#7c4dff',
    accent: '#03dac6',
    success: '#4CAF50',
    error: '#cf6679',
    warning: '#ff9800',
    info: '#2196F3',
    surface: '#121212',
    onSurface: '#ffffff',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
};
