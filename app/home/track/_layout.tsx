import { TrackContextProvider } from "@/context/TrackContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <TrackContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </TrackContextProvider>
  );
};
export default StackLayout;
