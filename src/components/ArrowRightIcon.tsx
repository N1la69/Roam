import { View, ViewStyle, StyleProp } from "react-native";

export function ArrowRightIcon({
  size = 18,
  color = "#0B0B1A",
  style,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const stemWidth = Math.round(size * 0.7);
  const headSize = Math.round(size * 0.4);
  const strokeWidth = 2.2;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {/* Horizontal Stem */}
      <View
        style={{
          width: stemWidth,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      {/* Angled Arrow Head */}
      <View
        style={{
          position: "absolute",
          right: Math.round((size - stemWidth) / 2),
          width: headSize,
          height: headSize,
          borderTopWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [{ rotate: "45deg" }],
        }}
      />
    </View>
  );
}
