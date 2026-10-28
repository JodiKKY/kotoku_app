import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/kotoku-theme";
import { AuthProvider, useAuth } from "@/app/lib/auth";

function RootNavigator() {
  const { user } = useAuth();
  const isSignedIn = !!user;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.screen },
      }}
    >
      {/* Signed out: log in and sign up */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack.Protected>

      {/* Signed in: the wallet and the add-card page */}
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="add" options={{ presentation: "modal" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}