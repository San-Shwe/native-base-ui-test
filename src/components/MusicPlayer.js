import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { songs } from "../model/data"; // {songs}, songs
import { AudioContext } from "./AudioProvider";
import {
  selectAudio,
  changeAudio,
  pause,
  moveAudio,
} from "../misc/AudioController";
import { convertTime } from "../misc/storeHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const MusicPlayer = ({ navigation }) => {
  // context
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio, isFavourate } =
    context;
  const { colors } = useTheme();

  const calculateSeebBar = () => {
    if (playbackDuration !== null && playbackPosition !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

  // catch animated values
  const scrollX = useRef(new Animated.Value(0)).current;

  // song index state for song's title and artist name
  const [songIndex, setSongIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);

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

  // const handleFavourate = async () => {
  //   let allFav = await playList[0];
  //   console.log("-------> ", allFav.audios);
  //   if (allFav !== null) {
  //     await allFav.audios.forEach((item) => {
  //       if (item.id === currentAudio.id) {
  //         console.log("current song is favourate");
  //         return;
  //       }
  //       console.log(" Current song => ", item.id, " <> ", currentAudio.id);
  //     });

  //     // const result = words.filter(word => word.length > 6);

  //     // console.log("result is ", checkFav);
  //     // console.log("result is ", typeof checkFav);
  //     // const previousAudio = JSON.parse(result);

  //     //   const favAudios = result[0].audios;
  //     //   favAudios.map((item) => {
  //     //     if (item.id === currentAudio.id) {
  //     //       console.log(
  //     //         "---------------------------current audio is favourate------------------------------"
  //     //       );
  //     //       // isFavourate(true);
  //     //       return context.updateState(context, { isFavourate: true });
  //     //     }
  //     //   });
  //     //   // isFavourate(false);
  //     //   return context.updateState(context, { isFavourate: false });
  //     //   // console.log("IS MY FAVOURATE", previousAudio);
  //   }
  // };

  useEffect(() => {
    context.loadPreviousAudio();
    // console.log("use Effect > ", currentAudio);
  }, []);

  useEffect(() => {
    // console.log("-----------index use feect----------------");
    context.handleFavourate();
  }, [context.currentAudio]);

  // skip to next audio ---------------------------------------------------------
  const skipForward = async () => {
    await changeAudio(context, "next");

    // move next slider
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  // ----------------------------------------------------------------------------
  // skip to previous audio ----------------------start--------------------------------
  const skipBackward = async () => {
    await changeAudio(context, "previous");

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

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      // this condition mean > play audio for the first time just once on load
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(playbackPosition / 1000); // divide by 1000 because playbackPosition is in milisecond
  };

  // toggle paly and puase function for songs ----------------------------------------
  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
    // console.log("current audio is (handlePlayPause) >> ", context.currentAudio);
  };
  // ---------------------------------------------- ----------------------------------------

  if (!context.currentAudio) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning ? (
              <>
                <Text style={{ fontWeight: "bold", color: colors.text }}>
                  From Playlist :{" "}
                </Text>
                <Text style={{ color: colors.subTxt }}>
                  {context.activePlayList.title}
                </Text>
              </>
            ) : null}
          </View>
          {context.isPlayListRunning ? (
            <Text style={[styles.audioIndex, { color: colors.text }]}>{`${
              context.currentAudioIndex + 1
            } / ${context.totalAudioCount}`}</Text>
          ) : (
            <Text style={[styles.audioIndex, { color: colors.text }]}>{`${
              context.currentAudioIndex + 1
            } / ${context.totalAudioCount}`}</Text>
          )}
        </View>
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
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
              console.log(value * context.currentAudio.duration);
            }}
            onSlidingStart={async () => {
              // start sliding
              if (!context.isPlaying) return;
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart", error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.progressLableContainer}>
            <Text style={[styles.progressLableTxt, { color: colors.subTxt }]}>
              {currentPosition
                ? currentPosition
                : renderCurrentTime() || "00:00"}
              {/* await resume(playbackObj); */}
            </Text>
            <Text style={[styles.progressLableTxt, { color: colors.subTxt }]}>
              {convertTime(context.currentAudio.duration)}
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
              name={isFavourate ? "heart" : "heart-outline"}
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
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: 340,
  },
  audioIndex: {
    paddingBottom: 20,
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
    paddingHorizontal: 15,
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
