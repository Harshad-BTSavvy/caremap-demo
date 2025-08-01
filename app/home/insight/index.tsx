// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   SafeAreaView,
//   Dimensions,
// } from "react-native";
// import {
//   VictoryChart,
//   VictoryLine,
//   VictoryScatter,
//   VictoryTheme,
// } from "victory-native";
// import Svg from "react-native-svg";
// import palette from "@/utils/theme/color";
// import Header from "@/components/shared/Header"; 

// interface GraphData {
//   title: string;
//   data: { day: string; value: number }[];
// }

// const screenWidth = Dimensions.get("window").width;

// export default function InsightGraphScreen() {
//   const [graphData, setGraphData] = useState<GraphData[]>([]);

//   useEffect(() => {
//     fetchGraphData();
//   }, []);

//   const fetchGraphData = async () => {
//     const response: GraphData[] = await fetchMockGraphData(); 
//     setGraphData(response);
//   };

//   const renderItem = ({ item }: { item: GraphData }) => (
//     <View className="mb-6 px-4">
//       <Text className="text-lg font-semibold mb-2" style={{ color: palette.heading }}>
//         {item.title}
//       </Text>
//       <Svg width="100%" height={200}>
//         <VictoryChart
//           standalone={false}
//           theme={VictoryTheme.material}
//           height={200}
//           width={screenWidth - 32}
//           padding={{ top: 20, bottom: 30, left: 40, right: 10 }}
//           domain={{ y: [0, 100] }}
//         >
//           <VictoryLine
//             data={item.data}
//             x="day"
//             y="value"
//             style={{
//               data: { stroke: "#42a5f5", strokeWidth: 2 },
//             }}
//           />
//           <VictoryScatter
//             data={item.data}
//             x="day"
//             y="value"
//             size={6}
//             style={{
//               data: {
//                 fill: "rgba(66, 165, 245, 0.6)",
//                 stroke: "#2196f3",
//                 strokeWidth: 2,
//               },
//             }}
//           />
//         </VictoryChart>
//       </Svg>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <Header title="Insight" />

//       <FlatList
//         data={graphData}
//         keyExtractor={(item, index) => `${item.title}-${index}`}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingVertical: 10 }}
//       />
//     </SafeAreaView>
//   );
// }

// // Replace this with real API
// const fetchMockGraphData = async (): Promise<GraphData[]> => {
//   return [
//     {
//       title: "Work/school absenses and Sick Visits",
//       data: [
//         { day: "S", value: 90 },
//         { day: "M", value: 45 },
//         { day: "T", value: 72 },
//         { day: "W", value: 53 },
//         { day: "T", value: 88 },
//         { day: "F", value: 88 },
//         { day: "S", value: 54 },
//       ],
//     },
//     {
//       title: "Has Cough, Headache, Sinus symptoms",
//       data: [
//         { day: "S", value: 95 },
//         { day: "M", value: 44 },
//         { day: "T", value: 73 },
//         { day: "W", value: 90 },
//         { day: "T", value: 89 },
//         { day: "F", value: 89 },
//         { day: "S", value: 52 },
//       ],
//     },
//   ];
// };
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryAxis,
} from "victory-native";
import palette from "@/utils/theme/color";
import Header from "@/components/shared/Header"; // if you're using a shared header

interface GraphData {
  title: string;
  data: { day: string; value: number }[];
}

const screenWidth = Dimensions.get("window").width;

export default function InsightGraphScreen() {
  const [graphData, setGraphData] = useState<GraphData[]>([]);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    const response: GraphData[] = await fetchMockGraphData(); // replace with real service
    setGraphData(response);
  };

  const renderItem = ({ item }: { item: GraphData }) => (
    <View className="mb-6 px-4">
      <Text className="text-lg font-semibold mb-2" style={{ color: palette.heading }}>
        {item.title}
      </Text>

      <VictoryChart
        theme={VictoryTheme.material}
        width={screenWidth - 32} // full width minus padding
        height={220}
        padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
        domain={{ y: [0, 100] }}
      >
        {/* X Axis */}
        <VictoryAxis
          tickValues={item.data.map((d, i) => i)}
          tickFormat={item.data.map((d) => d.day)}
          style={{
            tickLabels: { fontSize: 12, padding: 5 },
            axis: { stroke: "#ccc" },
          }}
        />

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `${t}`}
          style={{
            tickLabels: { fontSize: 12, padding: 5 },
            grid: { stroke: "#eee" },
            axis: { stroke: "#ccc" },
          }}
        />

        <VictoryLine
          data={item.data}
          x="day"
          y="value"
          style={{
            data: { stroke: "#42a5f5", strokeWidth: 2 },
          }}
        />
        <VictoryScatter
          data={item.data}
          x="day"
          y="value"
          size={6}
          style={{
            data: {
              fill: "rgba(66, 165, 245, 0.6)",
              stroke: "#2196f3",
              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Insight" />
      <FlatList
        data={graphData}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </SafeAreaView>
  );
}

// Replace this with your actual API
const fetchMockGraphData = async (): Promise<GraphData[]> => {
  return [
    {
      title: "Work/school absenses and Sick Visits",
      data: [
        { day: "S", value: 90 },
        { day: "M", value: 45 },
        { day: "T", value: 72 },
        { day: "W", value: 53 },
        { day: "T", value: 88 },
        { day: "F", value: 88 },
        { day: "S", value: 54 },
      ],
    },
    {
      title: "Has Cough, Headache, Sinus symptoms",
      data: [
        { day: "S", value: 95 },
        { day: "M", value: 44 },
        { day: "T", value: 73 },
        { day: "W", value: 52 },
        { day: "T", value: 89 },
        { day: "F", value: 89 },
        { day: "S", value: 52 },
      ],
    },
  ];
};
