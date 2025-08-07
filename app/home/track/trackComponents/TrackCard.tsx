import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useSelectedItems } from "@/context/TrackContext";
import palette from "@/utils/theme/color";
import { StyleSheet } from "react-native";

export default function TrackList() {
  const { selected } = useSelectedItems();
  // console.log(selected);
  return (
    <ScrollView contentContainerStyle={styles.containerStyle}>
      {selected.map((group) => (
        <View key={group.id} className="mt-5">
          <Text
            className="font-bold text-xl mb-3"
            style={{
              color: palette.heading,
            }}
          >
            {group.title}
          </Text>
          {group.trackItemData.map((item) => (
            <View
              key={item.id}
              className="rounded-xl p-4 mb-4"
              style={{
                backgroundColor: "#e9f6fe",
              }}
            >
              <View className="flex-row justify-between mb-3">
                <Text style={{ fontSize: 16, color: palette.primary }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 14, color: "#7b8fa1" }}>Daily</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: palette.primary,
                }}
                className="rounded-lg py-2.5 items-center"
                onPress={() => {
                  // handle begin action here
                  console.log(item);
                }}
              >
                <Text className="text-white font-bold text-base">Begin</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 16,
    // paddingBottom: 30,
    // paddingTop: 20,
  },
});
