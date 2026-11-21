import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/theme";
import { SanityPolicy } from "@/lib/sanity";

export interface PolicyModalProps {
  visible: boolean;
  onClose: () => void;
  policies?: SanityPolicy[];
  staySpecificRules?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  selectedPolicyType?: string;
}

export function PolicyModal({
  visible,
  onClose,
  policies = [],
  staySpecificRules = [],
  checkInTime = "3:00 PM",
  checkOutTime = "11:00 AM",
  selectedPolicyType,
}: PolicyModalProps) {
  // Sort policies so that if a specific one was tapped (e.g. cancellation), it shows prominently
  const sortedPolicies = [...policies].sort((a, b) => {
    if (selectedPolicyType && a.policyType === selectedPolicyType) return -1;
    if (selectedPolicyType && b.policyType === selectedPolicyType) return 1;
    return 0;
  });

  const getPolicyIcon = (type: string, iconName?: string) => {
    switch (type) {
      case "cancellation":
        return <Feather name="shield" size={18} color={colors.textPrimary} />;
      case "house_rules":
        return <Feather name="file-text" size={18} color={colors.textPrimary} />;
      case "pet_policy":
        return <Ionicons name="paw" size={18} color={colors.textPrimary} />;
      case "check_in":
        return <Feather name="clock" size={18} color={colors.textPrimary} />;
      case "safety":
        return <Feather name="alert-circle" size={18} color={colors.textPrimary} />;
      default:
        return <Feather name="info" size={18} color={colors.textPrimary} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onClose}
          accessibilityLabel="Close modal background"
        />

        <View
          style={{
            maxHeight: "88%",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ gap: 2 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 20,
                  color: colors.textPrimary,
                }}
              >
                Policies & House Rules
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  color: colors.textSecondary,
                }}
              >
                Official booking terms and stay guidelines
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close policies"
              onPress={onClose}
              hitSlop={10}
              style={({ pressed }) => ({
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: colors.surfaceGray,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather name="x" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Body Content */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: spacing.xxl + 24,
              gap: spacing.lg,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Check-In / Check-Out Summary Card */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.surfaceGray,
                borderRadius: radius.md,
                padding: spacing.md,
                gap: spacing.md,
              }}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: 13,
                    color: colors.textSecondary,
                  }}
                >
                  Check-in
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 16,
                    color: colors.textPrimary,
                  }}
                >
                  After {checkInTime}
                </Text>
              </View>

              <View
                style={{
                  width: 1,
                  backgroundColor: colors.border,
                  marginVertical: 2,
                }}
              />

              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: 13,
                    color: colors.textSecondary,
                  }}
                >
                  Checkout
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 16,
                    color: colors.textPrimary,
                  }}
                >
                  Before {checkOutTime}
                </Text>
              </View>
            </View>

            {/* Stay-Specific Rules (if present) */}
            {staySpecificRules && staySpecificRules.length > 0 && (
              <View style={{ gap: spacing.sm }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="sparkles" size={16} color="#0B0B1A" />
                  </View>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 16,
                      color: colors.textPrimary,
                    }}
                  >
                    Stay-Specific Rules
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                    padding: spacing.md,
                    gap: 10,
                  }}
                >
                  {staySpecificRules.map((rule, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <Feather
                        name="check"
                        size={15}
                        color={colors.primary}
                        style={{ marginTop: 2 }}
                      />
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: fonts.medium,
                          fontSize: 14,
                          lineHeight: 20,
                          color: colors.textPrimary,
                        }}
                      >
                        {rule}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Structured Sanity Policies */}
            {sortedPolicies.map((p) => (
              <View
                key={p._id || p.title}
                style={{
                  borderWidth: 1,
                  borderColor:
                    selectedPolicyType === p.policyType
                      ? colors.lavender
                      : colors.border,
                  backgroundColor:
                    selectedPolicyType === p.policyType
                      ? colors.lavenderLight
                      : "#FFFFFF",
                  borderRadius: radius.lg,
                  padding: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: colors.surfaceGray,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getPolicyIcon(p.policyType, p.icon)}
                    </View>

                    <Text
                      style={{
                        fontFamily: fonts.bold,
                        fontSize: 16,
                        color: colors.textPrimary,
                      }}
                    >
                      {p.title}
                    </Text>
                  </View>

                  {p.summary && (
                    <View
                      style={{
                        backgroundColor: colors.surfaceGray,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: radius.full,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.semiBold,
                          fontSize: 11,
                          color: colors.textSecondary,
                        }}
                      >
                        {p.policyType.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {p.summary && (
                  <Text
                    style={{
                      fontFamily: fonts.semiBold,
                      fontSize: 13.5,
                      color: colors.textPrimary,
                      lineHeight: 19,
                    }}
                  >
                    {p.summary}
                  </Text>
                )}

                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 22,
                  }}
                >
                  {p.content}
                </Text>
              </View>
            ))}

            {/* Close Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss policies"
              onPress={onClose}
              style={({ pressed }) => ({
                backgroundColor: colors.surfaceDark,
                borderRadius: radius.full,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
                marginTop: spacing.sm,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 15,
                  color: "#FFFFFF",
                }}
              >
                Close
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
