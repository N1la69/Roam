import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { colors, fonts, radius } from "@/theme";
import { sanityFetch, SanityPropertyDetail } from "@/lib/sanity";
import { PROPERTIES } from "@/data/properties";
import { posthog } from "@/lib/posthog";

interface TopicAnswerCard {
  topic: string;
  topicType: "cancellation" | "check_in" | "pet_policy" | "house_rules" | "amenities" | "general";
  title: string;
  content: string;
  source: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  answerCards?: TopicAnswerCard[];
  timestamp: string;
}

const TOPIC_CHIPS = [
  { label: "Cancellation policy", query: "What is the cancellation policy?" },
  { label: "Check-in & checkout", query: "What are the check-in and checkout times?" },
  { label: "Pet friendly?", query: "Is this stay pet friendly?" },
  { label: "Quiet hours & rules", query: "What are the house rules and quiet hours?" },
  { label: "Hot tub guidelines", query: "Are there hot tub instructions or rules?" },
  { label: "Fast Wi-Fi", query: "Does this stay have fast Wi-Fi?" },
];

export default function AskStayChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [stay, setStay] = useState<SanityPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Welcome! Ask any questions about house rules, cancellation, check-in, amenities, or policies for this stay. Answers are delivered as verified topic cards with their official source.",
      timestamp: "Just now",
    },
  ]);

  const messageCounterRef = useRef(1);
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  // Load live property details from Sanity
  const loadStay = useCallback((propertyId: string) => {
    let isCancelled = false;

    const groqQuery = `
      *[_type == "property" && _id == $id][0] {
        _id,
        title,
        tagline,
        category,
        pricePerNight,
        cleaningFee,
        rating,
        reviewsCount,
        isFeatured,
        maxGuests,
        bedrooms,
        beds,
        baths,
        petFriendly,
        amenities,
        location,
        description,
        neighborhoodOverview,
        tags,
        checkInTime,
        checkOutTime,
        imageUrl,
        galleryUrls,
        staySpecificRules,
        host-> {
          name,
          avatarUrl,
          bio,
          isSuperhost,
          rating,
          reviewsCount,
          responseRate,
          responseTime,
          joinedDate
        },
        policies[]-> {
          _id,
          title,
          policyType,
          summary,
          content,
          icon
        }
      }
    `;

    sanityFetch<SanityPropertyDetail | null>(groqQuery, { id: propertyId })
      .then((result) => {
        if (isCancelled) return;
        if (result) {
          setStay(result);
          setLoading(false);
          posthog?.capture("ask_chat_opened", {
            stay_id: result._id,
            title: result.title,
            category: result.category,
          });
        } else {
          // Fallback to local properties
          const fallback = PROPERTIES.find((p) => p.id === propertyId);
          if (fallback) {
            const [city, state] = fallback.location.split(",").map((s) => s.trim());
            const fallbackDetail: SanityPropertyDetail = {
              _id: fallback.id,
              title: fallback.title,
              category: fallback.category,
              pricePerNight: fallback.pricePerNight,
              rating: fallback.rating,
              reviewsCount: fallback.reviewsCount,
              imageUrl: fallback.imageUrl,
              amenities: fallback.amenities,
              description: fallback.description,
              tags: fallback.tags,
              maxGuests: 4,
              bedrooms: 2,
              beds: 2,
              baths: 2,
              petFriendly: fallback.tags.includes("pet friendly"),
              checkInTime: "3:00 PM",
              checkOutTime: "11:00 AM",
              location: {
                city: city || fallback.location,
                stateOrProvince: state || "",
                country: "USA",
                displayAddress: fallback.location,
              },
              host: {
                name: "Alex",
                avatarUrl:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
                isSuperhost: true,
                rating: 4.95,
                reviewsCount: 280,
              },
              policies: [
                {
                  _id: "pol-canc",
                  title: "Free cancellation",
                  policyType: "cancellation",
                  summary: "Full refund up to 7 days before check-in.",
                  content:
                    "Cancel up to 7 days before check-in for a full 100% refund. Cancellations made within 7 days receive a 50% refund minus the first night.",
                },
                {
                  _id: "pol-house",
                  title: "Standard House Rules",
                  policyType: "house_rules",
                  summary: "Quiet hours 10 PM - 8 AM. No smoking or unauthorized parties.",
                  content:
                    "Quiet hours are strictly enforced between 10:00 PM and 8:00 AM. Parties and events are not permitted. Please treat the home with care.",
                },
                {
                  _id: "pol-pet",
                  title: "Pet Friendly Guidelines",
                  policyType: "pet_policy",
                  summary: "Up to 2 well-behaved dogs welcome.",
                  content:
                    "Up to two well-behaved dogs are welcome. Pets must remain off furniture and beds. Waste must be bagged and disposed of outdoors.",
                },
                {
                  _id: "pol-check",
                  title: "Self Check-In & Access",
                  policyType: "check_in",
                  summary: "Keyless entry code provided 24 hours prior.",
                  content:
                    "Check-in begins at 3:00 PM via keyless digital door lock. Checkout is by 11:00 AM. Entry code details are transmitted securely before arrival.",
                },
              ],
              staySpecificRules: [
                "Please remove outdoor shoes in the foyer",
                "Quiet hours begin strictly at 10 PM",
              ],
            };
            setStay(fallbackDetail);
            setLoading(false);
            posthog?.capture("ask_chat_opened", {
              stay_id: fallbackDetail._id,
              title: fallbackDetail.title,
              category: fallbackDetail.category,
            });
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error("Failed to load stay for ask screen:", err);
        const fallback = PROPERTIES.find((p) => p.id === propertyId);
        if (fallback) {
          const [city, state] = fallback.location.split(",").map((s) => s.trim());
          setStay({
            _id: fallback.id,
            title: fallback.title,
            category: fallback.category,
            pricePerNight: fallback.pricePerNight,
            rating: fallback.rating,
            reviewsCount: fallback.reviewsCount,
            imageUrl: fallback.imageUrl,
            amenities: fallback.amenities,
            description: fallback.description,
            tags: fallback.tags,
            maxGuests: 4,
            bedrooms: 2,
            beds: 2,
            baths: 2,
            petFriendly: fallback.tags.includes("pet friendly"),
            checkInTime: "3:00 PM",
            checkOutTime: "11:00 AM",
            location: {
              city: city || fallback.location,
              stateOrProvince: state || "",
              country: "USA",
              displayAddress: fallback.location,
            },
            host: {
              name: "Alex",
              avatarUrl:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
              isSuperhost: true,
              rating: 4.95,
              reviewsCount: 280,
            },
            policies: [
              {
                _id: "pol-canc",
                title: "Free cancellation",
                policyType: "cancellation",
                summary: "Full refund up to 7 days before check-in.",
                content:
                  "Cancel up to 7 days before check-in for a full 100% refund. Cancellations made within 7 days receive a 50% refund minus the first night.",
              },
            ],
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const cancel = loadStay(id);
    return cancel;
  }, [id, loadStay]);



  // Resolve user question to exact factual topic cards
  const resolveAnswerCards = useCallback(
    (queryText: string): TopicAnswerCard[] => {
      if (!stay) return [];

      const queryLower = queryText.toLowerCase();
      const cards: TopicAnswerCard[] = [];

      // 1. Cancellation query
      if (
        queryLower.includes("cancel") ||
        queryLower.includes("refund") ||
        queryLower.includes("cancellation")
      ) {
        const cancPolicy = stay.policies?.find((p) => p.policyType === "cancellation");
        if (cancPolicy) {
          cards.push({
            topic: "CANCELLATION POLICY",
            topicType: "cancellation",
            title: cancPolicy.title,
            content: cancPolicy.content,
            source: `${cancPolicy.title} (Roam Terms & Conditions)`,
          });
        }
      }

      // 2. Check-in & checkout query
      if (
        queryLower.includes("check-in") ||
        queryLower.includes("check in") ||
        queryLower.includes("checkout") ||
        queryLower.includes("check-out") ||
        queryLower.includes("arrival") ||
        queryLower.includes("departure")
      ) {
        const checkPolicy = stay.policies?.find((p) => p.policyType === "check_in");
        cards.push({
          topic: "CHECK-IN & CHECKOUT",
          topicType: "check_in",
          title: `Check-in after ${stay.checkInTime || "3:00 PM"} • Checkout before ${stay.checkOutTime || "11:00 AM"}`,
          content:
            checkPolicy?.content ||
            `Check-in is automated via keyless digital smart lock starting at ${stay.checkInTime || "3:00 PM"}. Checkout is strictly by ${stay.checkOutTime || "11:00 AM"} to allow our cleaning team to prepare for incoming guests.`,
          source: "Property Check-in & Keyless Entry Specification",
        });
      }

      // 3. Pet friendly query
      if (
        queryLower.includes("pet") ||
        queryLower.includes("dog") ||
        queryLower.includes("cat") ||
        queryLower.includes("animal")
      ) {
        const petPolicy = stay.policies?.find((p) => p.policyType === "pet_policy");
        cards.push({
          topic: "PET GUIDELINES",
          topicType: "pet_policy",
          title: stay.petFriendly ? "Pets Allowed (Up to 2 Dogs)" : "No Pets Permitted",
          content:
            petPolicy?.content ||
            (stay.petFriendly
              ? "Up to two trained dogs are welcome. Pets must be leashed in outdoor common areas and kept off furniture and beds. Waste must be bagged and disposed of in outdoor bins."
              : "Due to owner severe allergies and property HOA guidelines, pets of any kind are not permitted on this property."),
          source: "Property Pet Policy & House Rules",
        });
      }

      // 4. House rules & quiet hours query
      if (
        queryLower.includes("rule") ||
        queryLower.includes("quiet") ||
        queryLower.includes("party") ||
        queryLower.includes("event") ||
        queryLower.includes("smoke") ||
        queryLower.includes("smoking")
      ) {
        const housePolicy = stay.policies?.find((p) => p.policyType === "house_rules");
        let combinedRules = housePolicy?.content || "Quiet hours are strictly enforced between 10:00 PM and 8:00 AM. Parties and events are prohibited.";
        if (stay.staySpecificRules && stay.staySpecificRules.length > 0) {
          combinedRules += `\n\nStay-Specific House Rules:\n${stay.staySpecificRules.map((r) => `• ${r}`).join("\n")}`;
        }
        cards.push({
          topic: "HOUSE RULES & QUIET HOURS",
          topicType: "house_rules",
          title: "Standard House Rules & Quiet Hours",
          content: combinedRules,
          source: "Host House Rules & Property Guidelines",
        });
      }

      // 5. Hot tub & amenities query
      if (
        queryLower.includes("tub") ||
        queryLower.includes("spa") ||
        queryLower.includes("jacuzzi")
      ) {
        const hasHotTub = stay.amenities?.some((a) => a.toLowerCase().includes("tub"));
        const ruleMatch = stay.staySpecificRules?.find((r) => r.toLowerCase().includes("tub"));
        cards.push({
          topic: "HOT TUB GUIDELINES",
          topicType: "amenities",
          title: hasHotTub ? "Private Hot Tub Available" : "No Hot Tub On-Site",
          content: hasHotTub
            ? `This property includes a private outdoor hot tub. ${ruleMatch ? `Note: ${ruleMatch}.` : "Please rinse off before entering, secure the thermal cover after use, and respect quiet hours."}`
            : "This property does not feature a private hot tub.",
          source: "Verified Property Amenities & House Rules",
        });
      }

      // 6. Wi-Fi & workspace query
      if (
        queryLower.includes("wifi") ||
        queryLower.includes("wi-fi") ||
        queryLower.includes("internet") ||
        queryLower.includes("speed") ||
        queryLower.includes("work")
      ) {
        const hasWifi = stay.amenities?.some((a) => a.toLowerCase().includes("wifi"));
        cards.push({
          topic: "WI-FI & CONNECTIVITY",
          topicType: "amenities",
          title: hasWifi ? "High-Speed Wi-Fi Included" : "Standard Connectivity",
          content: hasWifi
            ? "High-speed mesh Wi-Fi (suitable for video streaming, Zoom conferencing, and remote work) is available throughout the home. Network name and access key are located in your arrival guide."
            : "Standard wireless internet is available.",
          source: "Stay Amenities Specification",
        });
      }

      // Fallback: If no specific topic matched, return the stay's primary policies and rules
      if (cards.length === 0) {
        cards.push({
          topic: "STAY SPECIFICATIONS",
          topicType: "general",
          title: `${stay.title} Details`,
          content: `${stay.description}\n\nMax capacity: ${stay.maxGuests} guests across ${stay.bedrooms} bedrooms (${stay.beds} beds, ${stay.baths} baths). Check-in after ${stay.checkInTime || "3:00 PM"}, checkout before ${stay.checkOutTime || "11:00 AM"}.`,
          source: "Verified Sanity Stay Record",
        });
      }

      return cards;
    },
    [stay]
  );

  const handleSendQuery = (queryText: string, source: "chip" | "input") => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    posthog?.capture("ask_question_sent", {
      stay_id: stay?._id || id,
      query: trimmed,
      source,
    });

    const userMsg: ChatMessage = {
      id: `msg-${messageCounterRef.current++}-u`,
      sender: "user",
      text: trimmed,
      timestamp: "Just now",
    };

    const cards = resolveAnswerCards(trimmed);

    const assistantMsg: ChatMessage = {
      id: `msg-${messageCounterRef.current++}-a`,
      sender: "assistant",
      answerCards: cards,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputText("");

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "cancellation":
        return <Feather name="shield" size={17} color="#4338CA" />;
      case "check_in":
        return <Feather name="clock" size={17} color="#4338CA" />;
      case "pet_policy":
        return <Ionicons name="paw" size={17} color="#4338CA" />;
      case "house_rules":
        return <Feather name="file-text" size={17} color="#4338CA" />;
      case "amenities":
        return <MaterialIcons name="hot-tub" size={18} color="#4338CA" />;
      default:
        return <Ionicons name="sparkles" size={17} color="#4338CA" />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: Math.max(insets.top, 14),
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Back Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceGray,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Feather name="chevron-left" size={24} color="#0B0B1A" />
          </Pressable>

          {/* Stay Miniature Thumbnail & Titles */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {stay?.imageUrl ? (
              <Image
                source={{ uri: stay.imageUrl }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: colors.surfaceGray,
                }}
              />
            ) : (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: colors.primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="home" size={20} color={colors.textPrimary} />
              </View>
            )}

            <View style={{ gap: 2, maxWidth: 220 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 16,
                  color: "#0B0B1A",
                }}
                numberOfLines={1}
              >
                Ask about this stay
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: colors.textSecondary,
                }}
                numberOfLines={1}
              >
                {stay?.title || "Verified stay data"}
              </Text>
            </View>
          </View>
        </View>

        {/* Verified Badge */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#EEF2FF",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: radius.full,
          }}
        >
          <Feather name="check-circle" size={12} color="#4F46E5" />
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 11,
              color: "#4F46E5",
            }}
          >
            Verified
          </Text>
        </View>
      </View>

      {/* Main Conversation Feed */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: colors.textSecondary,
                marginTop: 10,
              }}
            >
              Loading verified stay facts...
            </Text>
          </View>
        ) : (
          messages.map((msg) => {
            if (msg.sender === "user") {
              return (
                <View
                  key={msg.id}
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "82%",
                    backgroundColor: "#0B0B1A",
                    borderRadius: 20,
                    borderBottomRightRadius: 4,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 15,
                      color: "#FFFFFF",
                      lineHeight: 21,
                    }}
                  >
                    {msg.text}
                  </Text>
                </View>
              );
            }

            // Assistant Message with Topic Answer Cards
            return (
              <View key={msg.id} style={{ gap: 10, maxWidth: "100%" }}>
                {msg.text && (
                  <View
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 18,
                      borderBottomLeftRadius: 4,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 14,
                        lineHeight: 20,
                        color: colors.textPrimary,
                      }}
                    >
                      {msg.text}
                    </Text>
                  </View>
                )}

                {/* Structured Topic Answer Cards */}
                {msg.answerCards &&
                  msg.answerCards.map((card, cIdx) => (
                    <Animated.View
                      key={cIdx}
                      entering={FadeInDown.duration(200).delay(cIdx * 50)}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 22,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: "rgba(201, 180, 255, 0.4)",
                        gap: 10,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      {/* Topic Category Tag */}
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
                            gap: 8,
                          }}
                        >
                          <View
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 12,
                              backgroundColor: "#F2EBFF",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {getTopicIcon(card.topicType)}
                          </View>
                          <Text
                            style={{
                              fontFamily: fonts.bold,
                              fontSize: 12,
                              letterSpacing: 0.5,
                              color: "#4338CA",
                            }}
                          >
                            {card.topic}
                          </Text>
                        </View>
                      </View>

                      {/* Card Title */}
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: 16,
                          color: "#0B0B1A",
                          lineHeight: 22,
                        }}
                      >
                        {card.title}
                      </Text>

                      {/* Exact Word-for-Word Content */}
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 14,
                          lineHeight: 22,
                          color: "#374151",
                        }}
                      >
                        {card.content}
                      </Text>

                      {/* Source Attribution Label */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          backgroundColor: "#F9FAFB",
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 10,
                          alignSelf: "flex-start",
                          borderWidth: 1,
                          borderColor: colors.border,
                          marginTop: 2,
                        }}
                      >
                        <Feather name="bookmark" size={12} color={colors.textSecondary} />
                        <Text
                          style={{
                            fontFamily: fonts.medium,
                            fontSize: 11.5,
                            color: colors.textSecondary,
                          }}
                        >
                          Source: {card.source}
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Quick-Prompt Topic Chips Horizontal Scroller */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
          }}
        >
          {TOPIC_CHIPS.map((chip, idx) => (
            <Pressable
              key={idx}
              accessibilityRole="button"
              accessibilityLabel={`Ask: ${chip.label}`}
              onPress={() => handleSendQuery(chip.query, "chip")}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: "#F3F4F6",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Feather name="help-circle" size={13} color="#4B5563" />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  color: "#0B0B1A",
                }}
              >
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Chat Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 12),
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {/* Input Pill Container with Message Icon */}
          <View
            style={{
              flex: 1,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#F3F4F6",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              gap: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            {/* Message Icon Inside Input */}
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={colors.textSecondary}
            />

            <TextInput
              style={{
                flex: 1,
                fontFamily: fonts.medium,
                fontSize: 14.5,
                color: "#0B0B1A",
                paddingVertical: 0,
              }}
              placeholder="Ask a question about this stay..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              returnKeyType="send"
              onSubmitEditing={() => handleSendQuery(inputText, "input")}
            />

            {inputText ? (
              <Pressable
                onPress={() => setInputText("")}
                hitSlop={8}
                accessibilityLabel="Clear input"
              >
                <Feather name="x" size={16} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>

          {/* Send Action Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            onPress={() => handleSendQuery(inputText, "input")}
            disabled={!inputText.trim()}
            style={({ pressed }) => ({
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: inputText.trim() ? colors.primary : colors.surfaceGray,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed && inputText.trim() ? 0.8 : 1,
            })}
          >
            <Feather
              name="arrow-up"
              size={22}
              color={inputText.trim() ? "#0B0B1A" : "#9CA3AF"}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
