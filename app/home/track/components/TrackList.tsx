import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelectedItems } from "@/context/TrackContext";

export default function TrackList() {
  const { selected } = useSelectedItems();
  return (
    <View style={{ padding: 16 }}>
      {selected.map((group) => (
        <View key={group.title} style={{ marginBottom: 32 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
            {group.title}
          </Text>
          {group.data.map((item) => (
            <View
              key={item}
              style={{
                backgroundColor: "#e0f7fa",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 16, color: "#333" }}>{item}</Text>
                <Text style={{ fontSize: 14, color: "#7b8fa1" }}>Daily</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#4fc3f7",
                  borderRadius: 8,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
                onPress={() => {
                  // handle begin action here
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
    </View>
  );
}
