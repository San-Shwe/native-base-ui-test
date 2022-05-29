import React, { useState, useContext, useEffect } from "react";
import color from "../components/color";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "react-native-paper";
import PlayListInputModal from "./PlayListInputModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../components/AudioProvider";

export const Playlist = () => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  // get playlist form storage
  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist"); // is any playlist?
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        // if ready have playlist in context, take that playlist
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updateList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updateList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updateList));
    }
    setModalVisible(false);
  };

  // render playlist for the first time
  const renderPlaylist = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      //
      const defaultPlaylist = {
        id: Date.now(),
        title: "My Favourate",
        audios: [],
      };

      const newPlayList = [...playList, defaultPlaylist];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }

    // if already have playlist
    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      // if there is no playlist to
      renderPlaylist();
    }
  }, []);

  const handleBannerPress = async (item) => {
    // update our playlist if there is any selected audio
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");
      let oldList = [];
      let updatedList = [];
      let isSameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);
        updatedList = oldList.filter((list) => {
          // filter playlist which user clicked
          if (list.id === item.id) {
            // we want to check that selected audio is alredy inside list or not
            for (let audio of list.audios) {
              // if the selected audio is already on the list
              if (audio.id === addToPlayList.id) {
                // alert with some message
                isSameAudio = true;
                return;
              }
            }

            // otherwise | user selected audio is not in playlist | update the playlist
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }

      // Alert to user if user added audio which is already listed in playlist
      if (isSameAudio) {
        Alert.alert(
          "Found the same audio",
          `${addToPlayList.filename} is already inside the list.`
        );
        isSameAudio = false;
        return updateState(context, { addToPlayList: null });
      }

      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }

    // if there is no audio selected item we wanat to open the list.
    console.log("opening list");
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {playList.length
        ? playList.map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              style={styles.playListBanner}
              onPress={() => handleBannerPress(item)}
            >
              <Text style={[styles.audioCount, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.audioCount, { color: colors.subTxt }]}>
                {item.audios.length > 1
                  ? `${item.audios.length} Songs`
                  : `${item.audios.length} Song`}
              </Text>
            </TouchableOpacity>
          ))
        : null}

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={[styles.playListBtn, { color: colors.icon }]}>
          + Add New Playlist
        </Text>
      </TouchableOpacity>

      {/* playlistModal for new playlist */}
      <PlayListInputModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        onSubmit={createPlayList}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: "rgba(204, 204, 204, 0.2)",
    borderRadius: 5,
    marginBottom: 20,
  },
  audioCount: { marginTop: 3, opacity: 0.5, fontSize: 14 },
  playListBtn: {
    color: color.ACTIVE_FONT,
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});

export default Playlist;
