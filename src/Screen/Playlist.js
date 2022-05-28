import React, { PureComponent } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";

export class Playlist extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text> Play List </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Playlist;
