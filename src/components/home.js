import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView style={stlyes.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Text>App Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const stlyes = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
});
