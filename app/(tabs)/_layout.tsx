import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="peliculas" options={{ title: "Películas" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
    </Tabs>
  );
}
