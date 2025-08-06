import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Route, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import palette from "@/utils/theme/color";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const HeaderTrack: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const router = useRouter();

  return (
    <View
      style={{ backgroundColor: palette.primary }}
      className="py-3 flex-row items-center px-4"
    >
      <View style={{ width: 80, alignItems: "flex-start" }}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={onBackPress ?? (() => router.back())}
            className="p-2"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
        ) : (
          <View className="p-2" />
        )}
      </View>

      <Text className="text-xl text-white font-bold flex-1 text-center">
        {title}
      </Text>

      <View style={{ maxWidth: 110, alignItems: "flex-end" }}>
        <TouchableOpacity
          onPress={() => router.push("/home/track/addItem" as Route)}
          className=""
        >
          <View className="bg-white px-4 py-2 rounded-md">
            <Text style={{ color: palette.primary, fontWeight: "bold" }}>
              Add Item
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderTrack;
