import { View, ViewStyle, StyleProp } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export function AppleIcon({
  size = 20,
  color = "#0B0B1A",
  style,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" }, style]}>
      <FontAwesome name="apple" size={size} color={color} />
    </View>
  );
}
