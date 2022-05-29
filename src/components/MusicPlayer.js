import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { songs } from "../model/data"; // {songs}, songs
import { AudioContext } from "./AudioProvider";
import { play, pause, resume, playNext } from "./AudioController";
import { storeAudioForNextOpening } from "./storeHelper";

const { width, height } = Dimensions.get("window");

const MusicPlayer = ({ navigation }) => {
  // context
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;
  const { colors } = useTheme();

  const calculateSeebBar = () => {
    if (playbackDuration !== null && playbackPosition !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  // catch animated values
  const scrollX = useRef(new Animated.Value(0)).current;

  // song index state for song's title and artist name
  const [songIndex, setSongIndex] = useState(0);

  // song slider ref to catch current song track
  const songSlider = useRef(0);

  // useEffect(() => {
  //   scrollX.addListener(({ value }) => {
  //     // console.log("Scroll x", scrollX);
  //     const index = Math.round(value / width);
  //     setSongIndex(index);
  //   });
  //   // remove all listener for skip next and skip previous button
  //   return () => {
  //     scrollX.removeAllListeners();
  //   };
  // }, []);

  useEffect(() => {
    context.loadPreviousAudio();
    console.log("use Effect");
    console.log(context.playbackObj);
  }, []);

  // skip to next audio ---------------------------------------------------------
  const skipForward = async () => {
    console.log("next --------------->", context.playbackObj.getStatusAsync());
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    console.log("isloaded =====> ", isLoaded);
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFile[context.currentAudioIndex + 1];
    let index;
    let status;
    if (!isLoaded && !isLastAudio) {
      // if audio is new play the first time
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      // if it is loaded but not last audio
      index = context.currentAudioIndex + 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audio;
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      soundObj: status,
      playbackObj: context.playbackObj,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);

    // move next slider
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  // ----------------------------------------------------------------------------
  // skip to previous audio ----------------------start--------------------------------
  const skipBackward = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0;
    let audio = context.audioFile[context.currentAudioIndex - 1];
    let index;
    let status;
    if (!isLoaded && !isFirstAudio) {
      // if audio is new
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isFirstAudio) {
      // if it is loaded but not last audio
      index = context.currentAudioIndex - 1;
      status = await playNext(context.playbackObj, audio.uri);
    }

    if (isFirstAudio) {
      index = context.totalAudioCount - 1;
      audio = context.audio;
      if (isLoaded) {
        status = await playNext(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      currentAudio: audio,
      soundObj: status,
      playbackObj: context.playbackObj,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);

    // move previous slider
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };
  //-----------------------------end-------------------------

  // To render songs in music player screen
  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{ width: width, justifyContent: "center", alignItems: "center" }}
      >
        <View style={styles.artworkWrapper}>
          <Image style={styles.artworkImg} source={item.image} />
        </View>
      </Animated.View>
    );
  };

  // toggle paly and puase function for songs ----------------------------------------
  const handlePlayPause = async () => {
    console.log(context.soundObj);
    console.log(context.isPlaying);

    // play > playing for the first time
    if (context.soundObj === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObj, audio.uri);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return context.updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }

    // pause
    if (context.soundObj && context.soundObj.isPlaying) {
      const status = await pause(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    // resume
    if (context.soundObj && !context.soundObj.isPlaying) {
      const status = await resume(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };
  // ---------------------------------------------- ----------------------------------------

  if (!context.currentAudio) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text>{`${context.currentAudioIndex + 1} / ${
          context.totalAudioCount
        }`}</Text>
        {/* Artwork Image or Carosel Image */}
        <View style={{ width: width }}>
          <Animated.FlatList
            ref={songSlider}
            data={songs}
            renderItem={renderSongs}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
          />
        </View>
        {/* Song Title and Artist Name */}
        <View>
          <Text
            numberOfLines={1}
            style={[styles.songTitle, { color: colors.text }]}
          >
            {context.currentAudio.filename}
          </Text>
          <Text style={[styles.artistName, { color: colors.subTxt }]}>
            Unknown
          </Text>
        </View>
        {/* Slider Bar */}
        <View>
          <Slider
            style={styles.progressContainer}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={colors.icon}
            maximumTrackTintColor={colors.icon}
            onSlidingComplete={() => {}}
          />
          <View style={styles.progressLableContainer}>
            <Text style={[styles.progressLableTxt, { color: colors.subTxt }]}>
              0:20
            </Text>
            <Text style={[styles.progressLableTxt, { color: colors.subTxt }]}>
              3:50
            </Text>
          </View>
        </View>

        {/* Music Control */}
        <View style={styles.musicControls}>
          <TouchableOpacity onPress={skipBackward}>
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              style={{ marginTop: 20, color: colors.icon }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handlePlayPause();
            }}
          >
            <Ionicons
              style={{ color: colors.icon }}
              name={
                context.isPlaying
                  ? "pause-circle-outline"
                  : "play-circle-outline"
              }
              size={75}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipForward}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              style={{ marginTop: 20, color: colors.icon }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* -------------------- */}
      {/* Bottom Control Group */}
      <View
        style={[styles.bottomContainer, { borderTopColor: colors.opacity }]}
      >
        <View style={styles.bottomControl}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="heart-outline"
              size={30}
              style={{ color: colors.icon }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="repeat-outline"
              size={30}
              style={{ color: colors.icon }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="albums-outline"
              size={30}
              style={{ color: colors.icon }}
              onPress={() => {
                navigation.navigate("Playlist");
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="list-outline"
              onPress={() => {
                navigation.navigate("AudioList");
              }}
              style={{ color: colors.icon }}
              size={30}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={30}
              style={{ color: colors.icon }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#C4DDFF",
  },
  mainContainer: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  artworkImg: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "200",
    textAlign: "center",
    color: "#1A3C40",
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  musicControls: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  progressLableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLableTxt: {
    // color: "#1A3C40",
    fontSize: 16,
  },
  bottomContainer: {
    borderTopWidth: 1,
    width: width,
    alignItems: "center",
    paddingVertical: 15,
  },
  bottomControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
