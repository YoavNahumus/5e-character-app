import { ScrollView } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedScrollView({ style, lightColor, darkColor, ...otherProps }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
