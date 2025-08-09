import HeaderTrack from "@/components/shared/HeaderTrack";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackCard from "./trackComponents/TrackCard";
function TrackScreen() {
  return (
    <SafeAreaView className="bg-white flex-1">
      <HeaderTrack title="Track" />
      <TrackCard />
    </SafeAreaView>
  );
}

export default TrackScreen;
