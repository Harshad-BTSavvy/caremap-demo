import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useSelectedItems } from "@/context/TrackContext";
import palette from "@/utils/theme/color";
import { StyleSheet } from "react-native";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

export default function TrackCard() {
  const { selected } = useSelectedItems();
  // console.log(selected);
  return (
    <ScrollView contentContainerStyle={styles.containerStyle}>
      {selected.map((group) => (
        <View key={group.category.id} className="mt-5">
          <Text
            className="font-bold text-xl mb-3"
            style={{
              color: palette.heading,
            }}
          >
            {group.category.name}
          </Text>
          {group.items
            .filter((item) => item.selected)
            .map((item) => {
              // Show progress bar for "Medication Tracking", else show Begin button
              const showProgress = item.item.name === "Medication Tracking";
              // Example progress values
              const completed = 2;
              const total = 5;
              const progressValue = (completed / total) * 100;

              return (
                <View
                  key={item.item.id}
                  className="rounded-xl px-4 py-5 mb-4"
                  style={{
                    backgroundColor: "#e9f6fe",
                  }}
                >
                  <View className="flex-row justify-between mb-3">
                    <Text style={{ fontSize: 16, color: palette.primary }}>
                      {item.item.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#7b8fa1" }}>
                      Weekly
                    </Text>
                  </View>
                  {showProgress ? (
                    <Progress
                      value={progressValue}
                      size="md"
                      orientation="horizontal"
                      className="w-full"
                    >
                      <ProgressFilledTrack
                        style={{ backgroundColor: palette.primary }}
                      />
                    </Progress>
                  ) : (
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
                      <Text className="text-white font-bold text-base">
                        Begin
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
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
