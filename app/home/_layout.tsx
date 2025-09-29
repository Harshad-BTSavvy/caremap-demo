// import palette from "@/utils/theme/color";
// import { Tabs } from "expo-router";

// export default function TabLayout() {
//   const MyHealthIconActive = require("@/assets/svg/health-active.svg").default;
//   const TrackIconActive = require("@/assets/svg/track-active.svg").default;
//   const InsightIconActive = require("@/assets/svg/insight-active.svg").default;
//   const CareTeamIconActive = require("@/assets/svg/careteam-active.svg").default;
//   const MoreIconActive = require("@/assets/svg/more-active.svg").default;

//   const MyHealthIconInActive =
//     require("@/assets/svg/health-inactive.svg").default;
//   const TrackIconInActive = require("@/assets/svg/track-inactive.svg").default;
//   const InsightIconInActive =
//     require("@/assets/svg/insight-inactive.svg").default;
//   const CareTeamIconInActive =
//     require("@/assets//svg/careteam-inactive.svg").default;
//     const MoreIconInActive =
//     require("@/assets//svg/more-inactive.svg").default;
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: palette.tabIconActiveColor,
//         tabBarInactiveTintColor: "#FFFFFF",

//         tabBarStyle: {
//           // paddingTop: 0,
//           // marginTop: 0,
//           backgroundColor: palette.tabBackgroundColor,
//           paddingHorizontal: 4,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "600",
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="myHealth"

//         options={{
//           title: "My Health",
//           popToTopOnBlur: true,
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <MyHealthIconActive width={32} height={32} />
//             ) : (
//               <MyHealthIconInActive width={32} height={32} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="track"
//         options={{
//           title: "Track",
//           href:"/home/track",
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <TrackIconActive width={32} height={32} />
//             ) : (
//               <TrackIconInActive width={32} height={32} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="insight"
//         options={{
//           title: "Insight",
//           href:"/home/insight",
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <InsightIconActive width={32} height={32} />
//             ) : (
//               <InsightIconInActive width={32} height={32} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="careTeam"
//         options={{
//           title: "Care Team",
//           href:"/home/careTeam",
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <CareTeamIconActive width={32} height={32} />
//             ) : (
//               <CareTeamIconInActive width={32} height={32} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="more"
//         options={{
//           title: "More",
//           href:"/home/more",
//           tabBarIcon: ({ focused }) =>
//             focused ? (
//               <MoreIconActive width={32} height={32} />
//             ) : (
//               <MoreIconInActive width={32} height={32} />
//             ),
//         }}
//       />
//     </Tabs>
//   );
// }
import palette from "@/utils/theme/color";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import {
  Activity,
  Heart,
  Lightbulb,
  Users,
  Ellipsis,
} from "lucide-react-native";

import { white } from "tailwindcss/colors";
export default function TabLayout() {

  const renderLabel = (label: string, focused: boolean) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: focused ? 13 : 11,
          fontWeight: focused ? "700" : "500",
          color: white,
        }}
      >
        {label}
      </Text>
      {focused && (
        <View
          style={{
            marginTop: 4,
            height: 3,
            width: 30, // Fixed width works better cross-platform
            backgroundColor: white,
            borderRadius: 2,
          }}
        />
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: palette.tabBackgroundColor,
          height: 95,
          paddingTop: 5,
          paddingHorizontal: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="myHealth"
        options={{
          title: "My Health",
          tabBarLabel: ({ focused }) => renderLabel("My Health", focused),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Activity color={white} width={26} height={26} />
            ) : (
              <Activity color={white} width={20} height={20} />
            ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          href: "/home/track",
          tabBarLabel: ({ focused }) => renderLabel("Track", focused),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Heart color={white} width={26} height={26} />
            ) : (
              <Heart color={white} width={20} height={20} />
            ),
        }}
      />
      <Tabs.Screen
        name="insight"
        options={{
          title: "Insight",
          href: "/home/insight",
          tabBarLabel: ({ focused }) => renderLabel("Insight", focused),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Lightbulb color={white} width={26} height={26} />
            ) : (
              <Lightbulb color={white} width={20} height={20} />
            ),
        }}
      />
      <Tabs.Screen
        name="careTeam"
        options={{
          title: "Care Team",
          href: "/home/careTeam",
          tabBarLabel: ({ focused }) => renderLabel("Care Team", focused),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Users color={white} width={26} height={26} />
            ) : (
              <Users color={white} width={20} height={20} />
            ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          href: "/home/more",
          tabBarLabel: ({ focused }) => renderLabel("More", focused),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ellipsis color={white} width={26} height={26} />
            ) : (
              <Ellipsis color={white} width={20} height={20} />
            ),
        }}
      />
    </Tabs>
  );
}
