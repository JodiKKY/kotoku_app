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

const MIN_PASSWORD = 8;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const emailRef = useRef<TextInputHandle>(null);
  const passwordRef = useRef<TextInputHandle>(null);
  const confirmRef = useRef<TextInputHandle>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const nameError = submitted && name.trim().length < 2 ? "Enter your name." : undefined;
  const emailError = submitted && !isValidEmail(email) ? "Enter a valid email address." : undefined;
  const passwordError =
    submitted && password.length < MIN_PASSWORD
      ? `Use at least ${MIN_PASSWORD} characters.`
      : undefined;
  const confirmError =
    submitted && confirm !== password ? "The passwords don't match." : undefined;

  const hasErrors = !!(nameError || emailError || passwordError || confirmError);

  async function onSubmit() {
    setSubmitted(true);
    setFormError(null);

    const valid =
      name.trim().length >= 2 &&
      isValidEmail(email) &&
      password.length >= MIN_PASSWORD &&
      confirm === password;
    if (!valid) return;

    try {
      setLoading(true);
      await signUp(name, email, password);
      // On success the root layout sends you to the home screen.
    } catch (e) {
      setFormError(
        e instanceof Error ? e.message : "We couldn't create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Set up your wallet in a few minutes. Everything you need, in one place."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={10}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.link}>Log in</Text>
          </Pressable>
        </View>
      }
    >
      {formError && <FormError message={formError} />}

      <TextField
        label="Full name"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        error={nameError}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />

      <TextField
        ref={emailRef}
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
        placeholder="Create a password"
        hint={`At least ${MIN_PASSWORD} characters.`}
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secure
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
      />

      <TextField
        ref={confirmRef}
        label="Confirm password"
        placeholder="Type it again"
        value={confirm}
        onChangeText={setConfirm}
        error={confirmError}
        secure
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />

      {submitted && hasErrors && !loading && (
        <Text style={styles.summary} accessibilityRole="alert">
          Please fix the highlighted fields.
        </Text>
      )}

      <PrimaryButton label="Create account" onPress={onSubmit} loading={loading} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footerRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  footerText: { fontSize: 15, color: colors.inkSoft },
  link: { fontSize: 15, fontWeight: "700", color: colors.forest },
  summary: { fontSize: 14, color: colors.danger, textAlign: "center" },
});