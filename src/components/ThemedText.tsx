import { Text, TextProps } from "react-native";
import { type, TypographyVariant, colors } from "@/theme";

export interface ThemedTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

export function ThemedText({
  variant = "body",
  color,
  style,
  ...props
}: ThemedTextProps) {
  const resolvedColor =
    color && color in colors
      ? (colors[color as keyof typeof colors] as string)
      : color;

  return (
    <Text
      style={[
        type[variant],
        resolvedColor ? { color: resolvedColor } : undefined,
        style,
      ]}
      {...props}
    />
  );
}
