import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { selectAudio } from "../misc/AudioController";
import AudioListItem from "../components/AudioListItem";
import color from "../misc/color";
import { AudioContext } from "../components/AudioProvider";
import { useTheme } from "react-native-paper";
import OptionModal from "../components/OptionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PlayListDetails = ({ navigation }) => {
  const context = useContext(AudioContext);
  const { selectedPlayList } = context; // states from AudioProvider
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(selectedPlayList.audios);

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

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };

  // when the user remove audio from playlist, search from storage and set the update playlist to storage
  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (
      context.isPlayListRunning &&
      context.currentAudio.id === selectedItem.id
    ) {
      // stop
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }
    // filter audios
    const newAudios = await audios.filter(
      (audio) => audio.id !== selectedItem.id
    );

    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlaylist = JSON.parse(result);
      const updatePlaylist = await oldPlaylist.filter((item) => {
        if (item.id === selectedPlayList.id) {
          item.audios = newAudios;
        }
        return item;
      });

      AsyncStorage.setItem("playlist", JSON.stringify(updatePlaylist));
      context.updateState(context, {
        playList: updatePlaylist,
        isPlayListRunning,
        isPlaying,
        soundObj,
        playbackPosition,
        activePlayList,
      });
    }
    setAudios(newAudios);
    closeModal();
  };

  const removePlaylist = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (
      context.isPlayListRunning &&
      context.activePlayList.id === selectedPlayList.id
    ) {
      // stop
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlaylist = JSON.parse(result);
      const updatePlaylist = await oldPlaylist.filter(
        (item) => item.id !== selectedPlayList.id
      );

      AsyncStorage.setItem("playlist", JSON.stringify(updatePlaylist));
      context.updateState(context, {
        playList: updatePlaylist,
        isPlayListRunning,
        isPlaying,
        soundObj,
        playbackPosition,
        activePlayList,
      });
    }

    navigation.navigate("Playlist");
  };
  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 15,
          }}
        >
          <Text style={styles.title}>{selectedPlayList.title}</Text>
          <TouchableOpacity onPress={removePlaylist}>
            <Text style={[styles.title, { color: colors.icon }]}>Delete</Text>
          </TouchableOpacity>
        </View>
        {audios.length ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={audios}
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
                  onOptionPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              </View>
            )}
          />
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: colors.subTxt,
              fontSize: 25,
              paddingTop: 100,
            }}
          >
            No Audio
          </Text>
        )}
      </View>
      <OptionModal
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove From Playlilst", onPress: removeAudio }]}
        currentItem={selectedItem}
      />
    </>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
