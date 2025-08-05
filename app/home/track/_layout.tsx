import { SelectedItemsProvider } from "@/context/TrackContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <SelectedItemsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SelectedItemsProvider>
  );
};
export default StackLayout;
