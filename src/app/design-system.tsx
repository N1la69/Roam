import { useState } from "react";
import {
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Feather,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { colors, spacing, radius, shadows } from "@/theme";
import {
  ThemedText,
  Button,
  IconButton,
  InputField,
  FilterChip,
  CategoryTab,
  Badge,
  StatusAlert,
  PolicyCard,
  ProfileRow,
  SegmentedControl,
  ToggleSwitch,
  Stepper,
  ListingCard,
  GlassTabBar,
  GoogleIcon,
  TabKey,
} from "@/components";

export default function DesignSystemScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [nameValue, setNameValue] = useState("Joanna Smith");
  const [passwordValue, setPasswordValue] = useState("secret123");
  const [selectedCategory, setSelectedCategory] = useState("All Stays");
  const [selectedFilter, setSelectedFilter] = useState("Cabins");
  const [segmentValue, setSegmentValue] = useState<"list" | "map">("list");
  const [toggleActive, setToggleActive] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfaceGray }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: 100,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 01. Brand */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            01. Brand
          </ThemedText>
          <View style={{ gap: spacing.xs }}>
            <ThemedText
              variant="display"
              style={{
                fontSize: 48,
                lineHeight: 48,
                letterSpacing: -2,
                color: colors.textPrimary,
              }}
            >
              roam
            </ThemedText>
            <ThemedText
              variant="body"
              style={{ color: colors.textSecondary, fontSize: 17 }}
            >
              Find unforgettable stays for every kind of trip.
            </ThemedText>
          </View>
        </View>

        {/* 02. Color palette */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            02. Color palette
          </ThemedText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <ColorSwatch name="Primary Yellow" hex="#FFC629" desc="Primary actions, active states" />
            <ColorSwatch name="Lavender" hex="#C9B4FF" desc="Secondary actions, highlights" />
            <ColorSwatch name="Text Primary" hex="#0B0B1A" desc="Headings, primary text" isDark />
            <ColorSwatch name="Text Secondary" hex="#6B7280" desc="Body text, secondary text" isDark />
            <ColorSwatch name="Surface White" hex="#FFFFFF" desc="Cards, sheets, modals" hasBorder />
            <ColorSwatch name="Surface Gray" hex="#F4F5F7" desc="App background, input fields" hasBorder />
            <ColorSwatch name="Border Gray" hex="#E5E7EB" desc="Dividers, borders" />
            <ColorSwatch name="Glass Blur" hex="rgba(255,255,255,0.7)" desc="Tab bar, glass surfaces" hasBorder />
          </View>
        </View>

        {/* 03. Typography */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            03. Typography
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            <View>
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                Display · Geometric Sans (Bold) · Size: 44 · Line height: 1.0
              </ThemedText>
              <ThemedText
                variant="display"
                style={{ fontSize: 44, lineHeight: 46 }}
              >
                Find your next stay
              </ThemedText>
            </View>

            <View>
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                Heading · Geometric Sans (Bold) · Size: 28 · Line height: 1.2
              </ThemedText>
              <ThemedText variant="heading">
                Modern Cabin with Hot Tub
              </ThemedText>
            </View>

            <View>
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                Body · Geometric Sans (Regular) · Size: 16 · Line height: 1.5
              </ThemedText>
              <ThemedText variant="body">
                From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.
              </ThemedText>
            </View>

            <View>
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                Caption · Geometric Sans (Medium) · Size: 14
              </ThemedText>
              <ThemedText variant="caption">
                Lake Arrowhead, CA
              </ThemedText>
            </View>

            <View>
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                Button · Geometric Sans (Medium) · Size: 17
              </ThemedText>
              <View style={{ alignSelf: "flex-start", marginTop: 4 }}>
                <Button title="Book this stay" size="sm" />
              </View>
            </View>
          </View>
        </View>

        {/* 04. Buttons */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            04. Buttons
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            <Button
              title="Book this stay"
              showArrow
              onPress={() => {}}
            />

            <Button
              variant="secondary"
              title="Continue with Google"
              icon={<GoogleIcon size={18} />}
              onPress={() => {}}
            />

            <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
              <IconButton
                accessibilityLabel="Like"
                icon={<Feather name="heart" size={20} color={colors.textPrimary} />}
              />
              <IconButton
                accessibilityLabel="Share"
                icon={<Feather name="share" size={20} color={colors.textPrimary} />}
              />
              <IconButton
                accessibilityLabel="Search"
                icon={<Feather name="search" size={20} color={colors.textPrimary} />}
              />
              <IconButton
                accessibilityLabel="Bookmark"
                icon={<Feather name="bookmark" size={20} color={colors.textPrimary} />}
              />
            </View>
          </View>
        </View>

        {/* 05. Input Fields */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            05. Input Fields
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            <InputField
              variant="search"
              placeholder="Cabins in California"
              value={searchValue}
              onChangeText={setSearchValue}
              leftIcon={<Feather name="search" size={20} color={colors.textPrimary} />}
              rightIcon={<Feather name="sliders" size={18} color={colors.textPrimary} />}
            />

            <InputField
              placeholder="Enter your name"
              leftIcon={<Feather name="user" size={18} color={colors.textSecondary} />}
            />

            <InputField
              placeholder="Enter your name"
              value={nameValue}
              onChangeText={setNameValue}
              leftIcon={<Feather name="user" size={18} color={colors.textPrimary} />}
            />

            <InputField
              placeholder="Password"
              value={passwordValue}
              onChangeText={setPasswordValue}
              isPassword
              leftIcon={<Feather name="lock" size={18} color={colors.textSecondary} />}
            />
          </View>
        </View>

        {/* 06. Filter chips */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            06. Filter chips
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {["Cabins", "Under $300", "Pet Friendly", "Quiet"].map((chip) => (
                <FilterChip
                  key={chip}
                  label={chip}
                  active={selectedFilter === chip}
                  onPress={() => setSelectedFilter(chip)}
                />
              ))}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              <CategoryTab
                label="All Stays"
                active={selectedCategory === "All Stays"}
                icon={<Feather name="home" size={16} color={colors.textPrimary} />}
                onPress={() => setSelectedCategory("All Stays")}
              />
              <CategoryTab
                label="Cabins"
                active={selectedCategory === "Cabins"}
                icon={<FontAwesome5 name="campground" size={14} color={colors.textPrimary} />}
                onPress={() => setSelectedCategory("Cabins")}
              />
              <CategoryTab
                label="Beach"
                active={selectedCategory === "Beach"}
                icon={<Feather name="sun" size={16} color={colors.textPrimary} />}
                onPress={() => setSelectedCategory("Beach")}
              />
              <CategoryTab
                label="City"
                active={selectedCategory === "City"}
                icon={<Feather name="briefcase" size={16} color={colors.textPrimary} />}
                onPress={() => setSelectedCategory("City")}
              />
              <CategoryTab
                label="Villas"
                active={selectedCategory === "Villas"}
                icon={<Ionicons name="business-outline" size={16} color={colors.textPrimary} />}
                onPress={() => setSelectedCategory("Villas")}
              />
            </View>
          </View>
        </View>

        {/* 07. Listing card */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            07. Listing card
          </ThemedText>
          <ListingCard
            title="Modern Cabin with Hot Tub"
            location="Lake Arrowhead, CA"
            rating={4.9}
            reviewsCount={342}
            pricePerNight={280}
            amenities={["Hot Tub", "Pet Friendly"]}
          />
        </View>

        {/* 08. Policy card */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            08. Policy card
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            <PolicyCard
              title="Ask about policies"
              description="Cancellation, house rules, pets, check-in and more."
              icon={<Ionicons name="chatbubbles-outline" size={22} color="#7C3AED" />}
            />
            <PolicyCard
              title="Free cancellation"
              description="Full refund up to 7 days before check-in."
              icon={<Ionicons name="document-text-outline" size={22} color="#7C3AED" />}
            />
          </View>
        </View>

        {/* 09. Profile row */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            09. Profile row
          </ThemedText>
          <View style={{ gap: 2 }}>
            <ProfileRow
              label="Personal info"
              icon={<Feather name="user" size={18} color={colors.textPrimary} />}
            />
            <ProfileRow
              label="Payment methods"
              icon={<Feather name="credit-card" size={18} color={colors.textPrimary} />}
            />
            <ProfileRow
              label="Trips"
              icon={<Feather name="briefcase" size={18} color={colors.textPrimary} />}
            />
          </View>
        </View>

        {/* 10. Bottom navigation */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            10. Bottom navigation (Liquid glass tab bar)
          </ThemedText>
          <GlassTabBar
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        </View>

        {/* 11. Iconography */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            11. Iconography
          </ThemedText>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm }}>
            <IconButton accessibilityLabel="Home" variant="surface" icon={<Feather name="home" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="Search" variant="surface" icon={<Feather name="search" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="Heart" variant="surface" icon={<Feather name="heart" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="Calendar" variant="surface" icon={<Feather name="calendar" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="User" variant="surface" icon={<Feather name="user" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="Settings" variant="surface" icon={<Feather name="settings" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="Map Pin" variant="surface" icon={<Feather name="map-pin" size={20} color={colors.textPrimary} />} />
            <IconButton accessibilityLabel="Sliders" variant="surface" icon={<Feather name="sliders" size={20} color={colors.textPrimary} />} />
          </View>
        </View>

        {/* 12. Segmented control */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            12. Segmented control
          </ThemedText>
          <SegmentedControl
            selected={segmentValue}
            onChange={(val) => setSegmentValue(val as "list" | "map")}
            options={[
              {
                value: "list",
                label: "List",
                icon: (
                  <Feather
                    name="list"
                    size={16}
                    color={segmentValue === "list" ? colors.textWhite : colors.textSecondary}
                  />
                ),
              },
              {
                value: "map",
                label: "Map",
                icon: (
                  <Feather
                    name="map"
                    size={16}
                    color={segmentValue === "map" ? colors.textWhite : colors.textSecondary}
                  />
                ),
              },
            ]}
          />
        </View>

        {/* 13. Toggles / Steppers */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            13. Toggles / Steppers
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xl }}>
            <ToggleSwitch
              value={toggleActive}
              onValueChange={setToggleActive}
            />
            <Stepper
              value={guestCount}
              onChange={setGuestCount}
              min={1}
              max={10}
            />
          </View>
        </View>

        {/* 14. Status / Alerts */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            14. Status / Alerts
          </ThemedText>
          <View style={{ gap: spacing.md }}>
            <StatusAlert
              type="success"
              message="Account created successfully"
            />
            <StatusAlert
              type="error"
              message="Something went wrong. Please try again."
            />
          </View>
        </View>

        {/* 15. Tags / Badges */}
        <View style={sectionCardStyle}>
          <ThemedText variant="footnote" style={sectionHeaderStyle}>
            15. Tags / Badges
          </ThemedText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <Badge variant="guestFavorite" />
            <Badge variant="new" />
            <Badge variant="sale" />
            <Badge variant="superhost" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorSwatch({
  name,
  hex,
  desc,
  isDark,
  hasBorder,
}: {
  name: string;
  hex: string;
  desc: string;
  isDark?: boolean;
  hasBorder?: boolean;
}) {
  return (
    <View
      style={{
        width: "48%",
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        padding: spacing.sm,
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          height: 40,
          borderRadius: radius.sm,
          backgroundColor: hex,
          borderWidth: hasBorder ? 1 : 0,
          borderColor: colors.border,
        }}
      />
      <View>
        <ThemedText variant="caption" style={{ fontWeight: "700", color: colors.textPrimary }}>
          {name}
        </ThemedText>
        <ThemedText variant="footnote" style={{ color: colors.textSecondary, fontSize: 11 }}>
          {hex}
        </ThemedText>
        <ThemedText variant="footnote" style={{ color: colors.textMuted, fontSize: 11 }} numberOfLines={1}>
          {desc}
        </ThemedText>
      </View>
    </View>
  );
}

const sectionCardStyle = {
  backgroundColor: colors.surface,
  borderRadius: radius.xl,
  borderCurve: "continuous" as const,
  padding: spacing.md,
  gap: spacing.md,
  boxShadow: shadows.card,
};

const sectionHeaderStyle = {
  fontWeight: "700" as const,
  color: colors.textSecondary,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
};
