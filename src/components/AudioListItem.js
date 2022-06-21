import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import color from "../misc/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "react-native-paper";

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

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying) {
    return <Ionicons name="pause" size={25} style={{ color: "#fff" }} />;
  } else {
    return <Ionicons name="play" size={25} style={{ color: "#fff" }} />;
  }
};

const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? colors.icon
                    : color.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: activeListItem ? colors.icon : colors.text,
                  },
                ]}
              >
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.timeTxt}>
                {convertTime(duration)}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Ionicons
            onPress={onOptionPress} // work onOptionPress function on parent component
            name="ellipsis-vertical"
            size={25}
            style={{ color: colors.text }}
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
