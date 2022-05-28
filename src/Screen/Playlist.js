import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export class Playlist extends PureComponent {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.playListBanner}>
          <Text>My Favourate</Text>
          <Text>0 Songs</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  playListBanner: {
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 5,
  },
  audioCount: { marginTop: 3, opacity: 0.5, fontSize: 14 },
});

export default Playlist;
