import { MaterialCommunityIcons } from "@expo/vector-icons";
import { forwardRef, useState, type ComponentRef, type ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/kotoku-theme";

/** The Kotoku K icon drawn with plain Views, so no extra packages are needed. */
export function KotokuMark({ size = 64 }: { size?: number }) {
  const s = size / 160;
  const armLength = 76.1 * s;
  const arm = (cx: number, cy: number, angle: string, color: string) => ({
    position: "absolute" as const,
    left: cx * s - armLength / 2,
    top: (cy - 9) * s,
    width: armLength,
    height: 18 * s,
    borderRadius: 9 * s,
    backgroundColor: color,
    transform: [{ rotate: angle }],
  });

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Kotoku"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        borderCurve: "continuous",
        backgroundColor: colors.forest,
        overflow: "hidden",
      }}
    >
      <View style={arm(86, 63, "-40.8deg", colors.gold)} />
      <View style={arm(88, 99, "40.8deg", colors.cream)} />
      <View
        style={{
          position: "absolute",
          left: 47 * s,
          top: 33 * s,
          width: 18 * s,
          height: 94 * s,
          borderRadius: 9 * s,
          backgroundColor: colors.cream,
        }}
      />
    </View>
  );
}

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthScreen({ title, subtitle, children, footer }: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <KotokuMark />
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.form}>{children}</View>
          <View style={styles.footer}>{footer}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Ref type for the text inputs. Use this with useRef instead of the TextInput class type. */
export type TextInputHandle = ComponentRef<typeof TextInput>;

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  /** Adds a show/hide toggle and hides the text. */
  secure?: boolean;
  hint?: string;
};

export const TextField = forwardRef<TextInputHandle, TextFieldProps>(function TextField(
  { label, error, secure, hint, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.inkSoft}
          style={styles.input}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {secure && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={12}
            onPress={() => setHidden((h) => !h)}
          >
            <MaterialCommunityIcons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={colors.inkSoft}
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

export function PrimaryButton({
  label,
  onPress,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonDim]}
    >
      {loading ? (
        <ActivityIndicator color={colors.cream} />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </Pressable>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <View style={styles.formError} accessibilityRole="alert">
      <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.danger} />
      <Text style={styles.formErrorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.screen },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    marginTop: 28,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.8,
    color: colors.forest,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 23,
    color: colors.inkSoft,
  },
  form: { marginTop: 28, gap: 18 },
  footer: { marginTop: "auto", paddingTop: 28, alignItems: "center" },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: colors.ink },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  inputFocused: { borderColor: colors.forest },
  inputError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 16, color: colors.ink, paddingVertical: 14 },
  error: { fontSize: 13, color: colors.danger },
  hint: { fontSize: 13, color: colors.inkSoft },
  button: {
    minHeight: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
  },
  buttonDim: { opacity: 0.8 },
  buttonText: { fontSize: 16, fontWeight: "700", color: colors.cream },
  formError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: "#FCEBEA",
  },
  formErrorText: { flex: 1, fontSize: 14, color: colors.danger },
});