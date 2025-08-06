import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/shared/Header";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, FlatList } from "react-native";
import { useSelectedItems } from "@/context/TrackContext";
import { CheckIcon, Icon } from "@/components/ui/icon";
import palette from "@/utils/theme/color";

const groupedItems = [
  {
    title: "Meds and Treatment",
    data: [
      "Emergency Medication",
      "Home Spirometry use",
      "Airway clearance treatment",
      "Transplant medication adherence",
      "Medication Tracking",
    ],
  },
  {
    title: "Major Events",
    data: ["Sick Visits", "Falls", "Work/School absences"],
  },
  {
    title: "Physical Symptoms",
    data: ["Pain", "Cough"],
  },
];

const AddItem = () => {
  const router = useRouter();
  const { selected, setSelected } = useSelectedItems();

  const toggleSelect = (groupTitle: string, item: string) => {
    setSelected((prev) => {
      const groupIndex = prev.findIndex((g) => g.title === groupTitle);
      if (groupIndex > -1) {
        const group = prev[groupIndex];
        const alreadySelected = group.data.includes(item);
        const newData = alreadySelected
          ? group.data.filter((i) => i !== item)
          : [...group.data, item];
        const newGroup = { ...group, data: newData };
        const newSelected = [...prev];
        newSelected[groupIndex] = newGroup;
        // Remove group if no items selected
        return newGroup.data.length === 0
          ? newSelected.filter((_, idx) => idx !== groupIndex)
          : newSelected;
      } else {
        // Add new group
        return [...prev, { title: groupTitle, data: [item] }];
      }
    });
  };

  const handleSave = () => {
    router.push("/home/track");
  };

  return (
    <SafeAreaView>
      <Header title="Select care items to track" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 45,
          paddingTop: 10,
        }}
      >
        {groupedItems.map((group) => (
          <View key={group.title} style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 12,
                color: palette.heading,
              }}
            >
              {group.title}
            </Text>
            {group.data.map((item) => {
              const groupSelected = selected.find(
                (g) => g.title === group.title
              );
              const isSelected = groupSelected
                ? groupSelected.data.includes(item)
                : false;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleSelect(group.title, item)}
                  style={{
                    backgroundColor: isSelected ? "#d8f6fc" : "#E6EBEB",
                    borderColor: isSelected ? "#00bcd4" : "#e0e0e0",
                    borderWidth: 1,
                    borderRadius: 24,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#333", fontSize: 15 }}>{item}</Text>
                  {isSelected && (
                    <Icon
                      as={CheckIcon}
                      size="xl"
                      style={{ color: palette.primary }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: palette.primary,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
            // marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddItem;
