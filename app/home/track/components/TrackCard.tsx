import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useSelectedItems } from "@/context/TrackContext";
import palette from "@/utils/theme/color";

export default function TrackList() {
  const { selected } = useSelectedItems();
  // console.log(selected);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        // paddingBottom: 45,
        paddingTop: 10,
      }}
    >
      {selected.map((group) => (
        <View key={group.title} style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 12,
              color: palette.heading,
            }}
          >
            {group.title}
          </Text>
          {group.data.map((item) => (
            <View
              key={item}
              style={{
                backgroundColor: "#e9f6fe",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 16, color: palette.primary }}>
                  {item}
                </Text>
                <Text style={{ fontSize: 14, color: "#7b8fa1" }}>Daily</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: palette.primary,
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
                onPress={() => {
                  // handle begin action here
                  console.log(item);
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Begin
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
