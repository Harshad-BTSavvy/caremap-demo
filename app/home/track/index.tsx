import palette from "@/utils/theme/color";
import { View, Text, TouchableOpacity } from "react-native";
import HeaderTrack from "@/components/shared/HeaderTrack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelectedItems } from "@/context/TrackContext";
import TrackCard from "./components/TrackCard";
function TrackScreen() {
  const { selected } = useSelectedItems();
  console.log(selected);
  return (
    <SafeAreaView>
      <HeaderTrack title="Track" />
      <TrackCard />
    </SafeAreaView>
  );
}

export default TrackScreen;
