import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/shared/Header";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  TrackCategoryWithSelectableItems,
  useSelectedItems,
} from "@/context/TrackContext";
import { CheckIcon, Icon } from "@/components/ui/icon";
import palette from "@/utils/theme/color";

// Sample data using TrackCategoryWithSelectableItems
const sampleData: TrackCategoryWithSelectableItems[] = [
  {
    category: {
      id: 1,
      name: "Meds and Treatment",
    },
    items: [
      {
        item: { id: 101, category_id: 1, name: "Emergency Medication" },
        selected: false,
      },
      {
        item: { id: 102, category_id: 1, name: "Home Spirometry use" },
        selected: false,
      },
      {
        item: { id: 103, category_id: 1, name: "Airway clearance treatment" },
        selected: false,
      },
      {
        item: {
          id: 104,
          category_id: 1,
          name: "Transplant medication adherence",
        },
        selected: false,
      },
      {
        item: { id: 105, category_id: 1, name: "Medication Tracking" },
        selected: false,
      },
    ],
  },
  {
    category: {
      id: 2,
      name: "Major Events",
    },
    items: [
      {
        item: { id: 201, category_id: 2, name: "Sick Visits" },
        selected: false,
      },
      { item: { id: 202, category_id: 2, name: "Falls" }, selected: false },
      {
        item: { id: 203, category_id: 2, name: "Work/School absences" },
        selected: false,
      },
    ],
  },
  {
    category: {
      id: 3,
      name: "Physical Symptoms",
    },
    items: [
      { item: { id: 301, category_id: 3, name: "Pain" }, selected: false },
      { item: { id: 302, category_id: 3, name: "Cough" }, selected: false },
    ],
  },
];

export default function AddItem() {
  const router = useRouter();
  const { selected, setSelected } = useSelectedItems();
  const [categories, setCategories] = useState<
    TrackCategoryWithSelectableItems[]
  >([]);

  // Sync local state with context or fallback to default data
  useEffect(() => {
    if (selected && selected.length > 0) {
      // Merge selected state into the default structure to preserve unselected items
      const merged = sampleData.map((cat) => {
        const selectedCat = selected.find(
          (s) => s.category.id === cat.category.id
        );
        if (!selectedCat) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            const selItem = selectedCat.items.find(
              (si) => si.item.id === item.item.id
            );
            return selItem ? { ...item, selected: selItem.selected } : item;
          }),
        };
      });
      setCategories(merged);
    } else {
      setCategories(sampleData);
    }
  }, [selected]);

  // Toggle selection of an item
  const toggleSelect = (categoryIndex: number, itemIdx: number) => {
    setCategories((prev) =>
      prev.map((cat, cIdx) => {
        return cIdx === categoryIndex
          ? {
              ...cat,
              items: cat.items.map((itm, iIdx) =>
                iIdx === itemIdx ? { ...itm, selected: !itm.selected } : itm
              ),
            }
          : cat;
      })
    );
  };

  // On save, only keep categories with at least one selected item
  const handleSave = () => {
    const selectedOnly = categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((itm) => itm.selected),
      }))
      .filter((cat) => cat.items.length > 0);
    setSelected(selectedOnly);
    router.push("/home/track");
  };

  return (
    <SafeAreaView className="bg-white">
      <Header title="Select care items to track" />
      <ScrollView contentContainerStyle={styles.containerStyle}>
        {categories.map((category, catIdx) => (
          <View key={category.category.id} className="mb-6">
            <Text
              className="font-bold text-xl mb-3"
              style={{ color: palette.heading }}
            >
              {category.category.name}
            </Text>
            {category.items.map((itm, itemIdx) => (
              <TouchableOpacity
                key={itm.item.id}
                onPress={() => toggleSelect(catIdx, itemIdx)}
                style={[
                  styles.touchableItem,
                  itm.selected ? styles.selectedItem : styles.unselectedItem,
                ]}
              >
                <Text className="text-[15px]">{itm.item.name}</Text>
                {itm.selected && (
                  <Icon
                    as={CheckIcon}
                    size="xl"
                    style={{ color: palette.primary }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity
          onPress={handleSave}
          className="rounded-lg py-3 items-center"
          style={{ backgroundColor: palette.primary }}
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
