// _layout.tsx is the ROOT of your app.
// Everything renders inside this. Think of it like index.html in web.
// The <Stack> here means screens slide in/out (standard iOS navigation).
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </>
  );
}
