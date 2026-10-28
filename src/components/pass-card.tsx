import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

export type PassType = "bank" | "id" | "reward";

export type Pass = {
  id: string;
  label: string;
  number: string;
  type: PassType;
  background: string;
  foreground: string;
};

/** Standard bank card proportions. */
export const CARD_RATIO = 1.586;

const meta = {
  bank: { icon: "credit-card", tag: "KOTOKU PAY" },
  id: { icon: "card-account-details", tag: "IDENTITY" },
  reward: { icon: "star", tag: "REWARDS" },
} as const;

type PassCardProps = {
  pass: Pass;
  width: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PassCard({ pass, width, onPress, style }: PassCardProps) {
  const { icon, tag } = meta[pass.type];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${pass.label}, ${pass.number}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          height: width / CARD_RATIO,
          backgroundColor: pass.background,
          opacity: pressed ? 0.93 : 1,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name={icon} size={20} color={pass.foreground} />
        </View>
        <Text style={[styles.tag, { color: pass.foreground }]}>{tag}</Text>
      </View>

      <View style={[styles.row, styles.bottom]}>
        <View>
          <Text style={[styles.label, { color: pass.foreground }]}>{pass.label}</Text>
          <Text style={[styles.number, { color: pass.foreground }]}>{pass.number}</Text>
        </View>
        {pass.type === "bank" && (
          <View style={styles.circles} accessible={false}>
            <View style={[styles.circle, { backgroundColor: "#E95D42" }]} />
            <View style={[styles.circle, styles.circleOverlap, { backgroundColor: "#F5C14A" }]} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderCurve: "continuous", // iOS squircle corners, ignored on Android
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#173A2B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  bottom: {
    alignItems: "flex-end",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  tag: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.6,
    opacity: 0.8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  number: {
    marginTop: 3,
    fontSize: 13,
    opacity: 0.75,
  },
  circles: {
    flexDirection: "row",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.92,
  },
  circleOverlap: {
    marginLeft: -10,
  },
});