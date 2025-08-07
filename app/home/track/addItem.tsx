import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/shared/Header";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  TrackCategory,
  TrackItem,
  useSelectedItems,
} from "@/context/TrackContext";
import { CheckIcon, Icon } from "@/components/ui/icon";
import palette from "@/utils/theme/color";

const trackCategory: TrackCategory[] = [
  {
    id: 1,
    title: "Meds and Treatment",
    trackItemData: [
      { id: 101, category_id: 1, name: "Emergency Medication" },
      { id: 102, category_id: 1, name: "Home Spirometry use" },
      { id: 103, category_id: 1, name: "Airway clearance treatment" },
      { id: 104, category_id: 1, name: "Transplant medication adherence" },
      { id: 105, category_id: 1, name: "Medication Tracking" },
    ],
  },
  {
    id: 2,
    title: "Major Events",
    trackItemData: [
      { id: 201, category_id: 2, name: "Sick Visits" },
      { id: 202, category_id: 2, name: "Falls" },
      { id: 203, category_id: 2, name: "Work/School absences" },
    ],
  },
  {
    id: 3,
    title: "Physical Symptoms",
    trackItemData: [
      { id: 301, category_id: 3, name: "Pain" },
      { id: 302, category_id: 3, name: "Cough" },
    ],
  },
];

export default function AddItem() {
  const router = useRouter();
  const { selected, setSelected } = useSelectedItems();
  const [localSelected, setLocalSelected] = useState<TrackCategory[]>([]);

  useEffect(() => {
    setLocalSelected(selected);
  }, []);

  // Toggle selection of an item in a group
  const toggleSelect = (category: TrackCategory, item: TrackItem) => {
    setLocalSelected((prev) => {
      const existingGroup = prev.find((g) => g.id === category.id);

      if (existingGroup) {
        const isItemSelected = existingGroup.trackItemData.some(
          (i) => i.id === item.id
        );
        const updatedGroupData = isItemSelected
          ? existingGroup.trackItemData.filter((i) => i.id !== item.id)
          : [...existingGroup.trackItemData, item];

        if (updatedGroupData.length === 0) {
          return prev.filter((g) => g.id !== category.id);
        }

        return prev.map((g) =>
          g.id === category.id ? { ...g, trackItemData: updatedGroupData } : g
        );
      } else {
        return [
          ...prev,
          { id: category.id, title: category.title, trackItemData: [item] },
        ];
      }
    });
  };

  const handleSave = () => {
    setSelected(localSelected);
    router.push("/home/track");
  };

  return (
    <SafeAreaView className="bg-white">
      <Header title="Select care items to track" />
      <ScrollView contentContainerStyle={styles.containerStyle}>
        {trackCategory.map((category) => (
          <View key={category.id} className="mb-6">
            <Text
              className="font-bold text-xl mb-3"
              style={{
                color: palette.heading,
              }}
            >
              {category.title}
            </Text>
            {category.trackItemData.map((item) => {
              const groupSelected = localSelected.find(
                (g) => g.id === category.id
              );
              const isSelected = groupSelected
                ? groupSelected.trackItemData.some((i) => i.id === item.id)
                : false;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleSelect(category, item)}
                  style={[
                    styles.touchableItem,
                    isSelected ? styles.selectedItem : styles.unselectedItem,
                  ]}
                >
                  <Text className="text-[15px]">{item.name}</Text>
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
          className="rounded-lg py-3 items-center"
          style={{
            backgroundColor: palette.primary,
          }}
        >
          <Text className="text-white font-bold text-[16px]">Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  touchableItem: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedItem: {
    backgroundColor: "#d8f6fc",
    borderColor: "#00bcd4",
  },
  unselectedItem: {
    backgroundColor: "#eff1f1",
    borderColor: "#e0e0e0",
  },

  containerStyle: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    paddingTop: 20,
  },
});

// const toggleSelect = (category: TrackCategory, item: TrackItem) => {
//   setLocalSelected((prev) => {
//     const groupIndex = prev.findIndex((g) => g.id === category.id);
//     if (groupIndex > -1) {
//       const groupObj = prev[groupIndex];
//       const alreadySelected = groupObj.data.some((i) => i.id === item.id);
//       const newData = alreadySelected
//         ? groupObj.data.filter((i) => i.id !== item.id)
//         : [...groupObj.data, item];
//       const newGroup = { ...groupObj, data: newData };
//       const newSelected = [...prev];
//       newSelected[groupIndex] = newGroup;
//       // Remove group if no items selected
//       return newGroup.data.length === 0
//         ? newSelected.filter((_, idx) => idx !== groupIndex)
//         : newSelected;
//     } else {
//       // Add new group
//       return [
//         ...prev,
//         { id: category.id, title: category.title, data: [item] },
//       ];
//     }
//   });
// };
