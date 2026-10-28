import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, layout } from "@/constants/kotoku-theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Category = {
  id: "upload" | "manual" | "scan";
  title: string;
  description: string;
  icon: IconName;
  tint: string;
};

const categories: Category[] = [
  {
    id: "upload",
    title: "Upload card",
    description: "Pick a photo of your card from your gallery",
    icon: "image-plus",
    tint: colors.sage,
  },
  {
    id: "manual",
    title: "Add manually",
    description: "Type in your card details yourself",
    icon: "keyboard-outline",
    tint: colors.goldLight,
  },
  {
    id: "scan",
    title: "Scan with camera",
    description: "Point your camera at the card to capture it",
    icon: "camera-outline",
    tint: colors.mist,
  },
];

export default function AddScreen() {
  const router = useRouter();

  function choose(category: Category) {
    // TODO: open the form for this category, e.g. router.push(`/add/${category.id}`)
    console.log("Selected category:", category.id);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.forest} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add to wallet</Text>
        <Text style={styles.subtitle}>How would you like to add your card?</Text>

        <View style={styles.list}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityLabel={`${category.title}. ${category.description}`}
              onPress={() => choose(category)}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={[styles.iconWrap, { backgroundColor: category.tint }]}>
                <MaterialCommunityIcons name={category.icon} size={26} color={colors.forest} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{category.title}</Text>
                <Text style={styles.cardSub}>{category.description}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.inkSoft} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  topBar: {
    paddingHorizontal: layout.screenPadding - 8,
    paddingTop: 4,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: colors.forest,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: colors.inkSoft,
  },
  list: {
    marginTop: 28,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: colors.white,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.ink,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 13,
    color: colors.inkSoft,
  },
  pressed: {
    opacity: 0.7,
  },
});