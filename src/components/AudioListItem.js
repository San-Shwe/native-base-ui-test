import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import color from "./color";
import Ionicons from "react-native-vector-icons/Ionicons";

// get first letter text
const getThumbnailText = (filename) => filename[0];

// convert to readable time
const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

const AudioListItem = ({ title, duration, onOptionPress }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.thumbnail}>
            <Text style={styles.thumbnailText}>{getThumbnailText(title)}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={1} style={styles.timeTxt}>
              {convertTime(duration)}
            </Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Ionicons
            onPress={onOptionPress} // work onOptionPress function on parent component
            name="ellipsis-vertical-outline"
            size={35}
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
      <View style={styles.separator} />
    </>
  );
};

// get the device width
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 50,
  },
  leftContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  thumbnailText: { fontSize: 22, fontWeight: "bold", color: color.FONT },
  rightContainer: {
    flexBasis: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: { width: width - 180, marginLeft: 12 },
  title: { fontSize: 15, color: color.FONT },
  timeTxt: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
  separator: {
    width: width - 80,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
});

export default AudioListItem;
