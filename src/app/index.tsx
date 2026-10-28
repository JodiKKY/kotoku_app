import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, type ComponentProps } from "react";
import {
  Alert,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { KotokuMark } from "@/components/auth-ui";
import { CARD_RATIO, PassCard, type Pass, type PassType } from "@/components/pass-card";
import { colors, layout } from "@/constants/kotoku-theme";
import { useAuth } from "@/app/lib/auth";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const passes: Pass[] = [
  {
    id: "everyday",
    label: "Everyday card",
    number: "•••• 4582",
    type: "bank",
    background: colors.forest,
    foreground: colors.cream,
  },
  {
    id: "rewards",
    label: "Your little perks",
    number: "Rewards & loyalty",
    type: "reward",
    background: colors.gold,
    foreground: colors.forest,
  },
  {
    id: "student",
    label: "Student ID",
    number: "ID · 004 821",
    type: "id",
    background: colors.paper,
    foreground: colors.forest,
  },
];

const quickActions: { icon: IconName; label: string }[] = [
  { icon: "credit-card-outline", label: "Cards" },
  { icon: "card-account-details-outline", label: "IDs" },
  { icon: "fingerprint", label: "Details" },
  { icon: "dots-horizontal", label: "More" },
];

const listIcon: Record<PassType, IconName> = {
  bank: "credit-card",
  id: "card-account-details",
  reward: "star",
};

const listTint: Record<PassType, string> = {
  bank: colors.sage,
  id: colors.goldLight,
  reward: colors.mist,
};

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const firstName = user?.name.trim().split(" ")[0] ?? "there";
  const initial = (user?.name.trim().charAt(0) || "?").toUpperCase();
  const cardWidth = width - layout.screenPadding * 2;
  const cardHeight = cardWidth / CARD_RATIO;

  // The card at the front of the stack, like the iOS Wallet.
  const [activeId, setActiveId] = useState("student");

  const ordered = [
    ...passes.filter((p) => p.id !== activeId),
    ...passes.filter((p) => p.id === activeId),
  ];
  const stackHeight = layout.stackOffset * (ordered.length - 1) + cardHeight;

  function openProfile() {
    // TODO: replace with a real profile screen
    Alert.alert(user?.name ?? "Your profile", user?.email, [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);
  }

  function addCard() {
    router.push("/add");
  }

  function bringToFront(id: string) {
    if (id === activeId) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveId(id);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Top bar: logo on the left, profile on the right */}
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <KotokuMark size={36} />
            <Text style={styles.brandText}>Kotoku</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Your profile"
            hitSlop={8}
            onPress={openProfile}
            style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.hello}>A little hello, {firstName}</Text>
          <Text style={styles.title}>Wallet</Text>
        </View>

        {/* Card stack */}
        <View style={[styles.stack, { height: stackHeight }]}>
          {ordered.map((pass, index) => (
            <PassCard
              key={pass.id}
              pass={pass}
              width={cardWidth}
              onPress={() => bringToFront(pass.id)}
              style={{
                position: "absolute",
                top: index * layout.stackOffset,
                zIndex: index,
              }}
            />
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.actions}>
          {quickActions.map(({ icon, label }) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name={icon} size={24} color={colors.forest} />
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recently used */}
        <Text style={styles.sectionTitle}>Recently used</Text>
        <View style={styles.list}>
          {passes.map((pass, index) => (
            <Pressable
              key={pass.id}
              accessibilityRole="button"
              accessibilityLabel={`${pass.label}, ${pass.number}`}
              onPress={() => bringToFront(pass.id)}
              style={({ pressed }) => [
                styles.row,
                index < passes.length - 1 && styles.rowDivider,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: listTint[pass.type] }]}>
                <MaterialCommunityIcons name={listIcon[pass.type]} size={20} color={colors.forest} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{pass.label}</Text>
                <Text style={styles.rowSub}>{pass.number}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.inkSoft} />
            </Pressable>
          ))}
        </View>

        {/* Reassurance banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Everything in its place</Text>
          <MaterialCommunityIcons name="shimmer" size={20} color={colors.forest} />
        </View>
      </ScrollView>

      {/* Add a new card */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a new card"
        onPress={addCard}
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + 20 },
          pressed && styles.fabPressed,
        ]}
      >
        <MaterialCommunityIcons name="plus" size={28} color={colors.cream} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandText: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: colors.forest,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sage,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.forest,
  },
  header: {
    marginTop: 24,
    marginBottom: 20,
  },
  hello: {
    fontSize: 14,
    color: colors.inkSoft,
  },
  title: {
    marginTop: 2,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: colors.forest,
  },
  pressed: {
    opacity: 0.7,
  },
  fab: {
    position: "absolute",
    right: layout.screenPadding,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
    shadowColor: "#173A2B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  stack: {
    width: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  action: {
    alignItems: "center",
    gap: 8,
    width: 72,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mist,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.inkSoft,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: colors.inkSoft,
  },
  list: {
    overflow: "hidden",
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inkFaint,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  rowSub: {
    marginTop: 2,
    fontSize: 13,
    color: colors.inkSoft,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    borderCurve: "continuous",
    backgroundColor: colors.mint,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.forest,
  },
});