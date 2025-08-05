import palette from "@/utils/theme/color";
import { View, Text, TouchableOpacity } from "react-native";
import HeaderTrack from "@/components/shared/HeaderTrack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelectedItems } from "@/context/TrackContext";
import TrackList from "./components/TrackList";
function TrackScreen() {
  const { selected } = useSelectedItems();
  console.log(selected);
  return (
    <SafeAreaView>
      <HeaderTrack title="Track" />
      <TrackList />
    </SafeAreaView>
  );
}

export default TrackScreen;
