import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  AuthScreen,
  FormError,
  PrimaryButton,
  TextField,
  type TextInputHandle,
} from "@/components/auth-ui";
import { colors } from "@/constants/kotoku-theme";
import { isValidEmail, useAuth } from "@/app/lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInputHandle>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = submitted && !isValidEmail(email) ? "Enter a valid email address." : undefined;
  const passwordError = submitted && password.length === 0 ? "Enter your password." : undefined;

  async function onSubmit() {
    setSubmitted(true);
    setFormError(null);

    if (!isValidEmail(email) || password.length === 0) return;

    try {
      setLoading(true);
      await signIn(email, password);
      // On success the root layout sends you to the home screen.
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : "We couldn't log you in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Log in to your wallet."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={10}
            onPress={() => router.replace("/signup")}
          >
            <Text style={styles.link}>Sign up</Text>
          </Pressable>
        </View>
      }
    >
      {formError && <FormError message={formError} />}

      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <TextField
        ref={passwordRef}
        label="Password"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secure
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />

      <PrimaryButton label="Log in" onPress={onSubmit} loading={loading} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footerRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  footerText: { fontSize: 15, color: colors.inkSoft },
  link: { fontSize: 15, fontWeight: "700", color: colors.forest },
});