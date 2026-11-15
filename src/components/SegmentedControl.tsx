import { View, Pressable, ViewStyle, StyleProp } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string = string>({
  options,
  selected,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: colors.surfaceGray,
          padding: spacing.xs,
          borderRadius: radius.full,
          alignSelf: "flex-start",
          gap: 2,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs + 2,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: isSelected ? colors.surfaceDark : "transparent",
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            {option.icon}
            <ThemedText
              variant="caption"
              style={{
                color: isSelected ? colors.textWhite : colors.textSecondary,
                fontWeight: isSelected ? "600" : "500",
              }}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
