import { createLiveActivity, createWidget } from "expo-widgets";
import { Text, View } from "react-native";

export type NextRaceWidgetProps = {
  raceName: string;
  location: string;
  startsAt: string;
  status: string;
};

function NextRaceLayout(props: NextRaceWidgetProps) {
  "widget";
  return (
    <View style={{ padding: 14, backgroundColor: "#0B0A09", borderRadius: 18, gap: 6 }}>
      <Text style={{ color: "#E10600", fontSize: 12, fontWeight: "700" }}>{props.status}</Text>
      <Text style={{ color: "#F5F3F0", fontSize: 18, fontWeight: "800" }}>{props.raceName}</Text>
      <Text style={{ color: "#A8A49E", fontSize: 13 }}>{props.location}</Text>
      <Text style={{ color: "#F59E0B", fontSize: 12 }}>{props.startsAt}</Text>
    </View>
  );
}

function RaceWeekActivityLayout(props: NextRaceWidgetProps) {
  "widget";
  const banner = (
    <View style={{ padding: 14, backgroundColor: "#181614", borderRadius: 20, gap: 4 }}>
      <Text style={{ color: "#E10600", fontSize: 12, fontWeight: "800" }}>{props.status}</Text>
      <Text style={{ color: "#F5F3F0", fontSize: 17, fontWeight: "800" }}>{props.raceName}</Text>
      <Text style={{ color: "#A8A49E", fontSize: 12 }}>{props.startsAt}</Text>
    </View>
  );
  return {
    banner,
    compactLeading: <Text style={{ color: "#E10600", fontWeight: "800" }}>F1</Text>,
    compactTrailing: <Text style={{ color: "#F5F3F0" }}>{props.status}</Text>,
    minimal: <Text style={{ color: "#E10600", fontWeight: "800" }}>F1</Text>,
    expandedCenter: banner,
  };
}

export const nextRaceWidget = createWidget<NextRaceWidgetProps>("NextRaceWidget", NextRaceLayout);
export const raceWeekActivity = createLiveActivity<NextRaceWidgetProps>(
  "RaceWeekActivity",
  RaceWeekActivityLayout
);
