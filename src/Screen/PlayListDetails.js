import React, { useContext, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Modal,
  Dimensions,
} from "react-native";
import { selectAudio } from "../misc/AudioController";
import AudioListItem from "../components/AudioListItem";
import color from "../misc/color";
import { AudioContext } from "../components/AudioProvider";
import { useTheme } from "react-native-paper";

export const PlayListDetails = () => {
  const context = useContext(AudioContext);
  const { colors } = useTheme();

  const { selectedPlayList } = context; // states from AudioProvider

  // useEffect(() => {
  //   console.log(
  //     "________________________________ selected Playlist is ___________-",
  //     selectedPlayList
  //   );
  // }, []);

  // const { param1, param2 } = route.params;

  const playAudio = async (item) => {
    await selectAudio(item, context, {
      isPlayListRunning: true,
      activePlayList: selectedPlayList,
    });
    console.log(
      "-----------------------------------audio from playlist---------------------------"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedPlayList.title}</Text>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={selectedPlayList.audios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <AudioListItem
              title={item.filename}
              duration={item.duration}
              isPlaying={context.isPlaying}
              activeListItem={item.id === context.currentAudio.id}
              onAudioPress={() => {
                playAudio(item);
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  modalBG: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
    color: color.ACTIVE_BG,
  },
});
