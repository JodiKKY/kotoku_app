/**
 * Kotoku brand colors.
 * These are close matches to the website. If your globals.css uses different
 * hex values for forest, sage, gold, cream or ink, paste them in here.
 */
export const colors = {
  forest: "#173A2B",
  sage: "#CFE0CB",
  sageLight: "#DCE9DA",
  mint: "#E8F0E5",
  gold: "#F4B63F",
  goldLight: "#F8E3A7",
  cream: "#FBF6EA",
  screen: "#FFFCF4",
  paper: "#F7F3E8",
  mist: "#F0EEE4",
  ink: "#1B2620",
  inkSoft: "rgba(27, 38, 32, 0.55)",
  inkFaint: "rgba(27, 38, 32, 0.08)",
  white: "#FFFFFF",
  line: "#D9D2BF",
  danger: "#B3261E",
} as const;

export const layout = {
  screenPadding: 20,
  /** How much of each stacked card stays visible behind the one in front. */
  stackOffset: 60,
} as const;