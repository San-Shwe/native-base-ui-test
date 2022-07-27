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
import * as Font from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { songs } from "../model/data"; // {songs}, songs
import VolumeControl, {
  VolumeControlEvents,
} from "react-native-volume-control";
volume: 0;
import { AudioContext } from "./AudioProvider";
import {
  selectAudio,
  changeAudio,
  pause,
  moveAudio,
} from "../misc/AudioController";
import {
  convertTime,
  storeAudioForNextOpening,
  storePlayListForNextOpening,
} from "../misc/storeHelper";
import SVGImg from "../assets/artwork/music-svgrepo-com.svg";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
let currentSlideIndex = 0;
let onSetup = true;
let artworkIndex = 0;

const MusicPlayer = ({ navigation }) => {
  // context
  const context = useContext(AudioContext);
  const {
    playbackPosition,
    playbackDuration,
    currentAudio,
    isFavourate,
    currentAudioIndex,
    artworkList,
  } = context;
  const { colors } = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);
  // catch animated values
  const scrollX = useRef(new Animated.Value(0)).current;

  // song index state for song's title and artist name
  const [songIndex, setSongIndex] = useState(currentAudioIndex);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [dataToRender, setDataToRender] = useState([]);
  const [volume, setVolume] = useState(0);
  // song slider ref to catch current song track
  const songSlider = useRef();

  const calculateSeebBar = () => {
    if (playbackDuration !== null && playbackPosition !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

  // useEffect(() => {
  //   scrollX.addListener(({ value }) => {
  //     console.log("Scroll x", scrollX);
  //     const index = Math.round(value / width);
  //     console.log("index is ", onSetup);

  //     console.log(" song index  > ", index, " <> ", songIndex);
  //     if (onSetup === false) {
  //       if (index >= songIndex) {
  //         changeAudio(context, "next");
  //       } else if (index < songIndex) {
  //         changeAudio(context, "previous");
  //       }
  //     }

  //     // setSongIndex(index);
  //   });
  //   // remove all listener for skip next and skip previous button
  //   return () => {
  //     scrollX.removeAllListeners();
  //   };
  // }, [scrollX]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    currentSlideIndex = viewableItems[0]?.index || 0;
    if (onSetup === false) {
      // await selectAudio(context.currentAudio, context);
      if (currentSlideIndex - 1 === artworkIndex) {
        // changeAudio(context, "next");
        console.log("go to next !!!!!!!!!!!!!!!!!!");
      } else if (currentSlideIndex + 1 === artworkIndex) {
        // changeAudio(context, "previous");
        console.log("go to previous !!!!!!!!!!!!!!!!!!");
      }
    }

    // setSongIndex(currentSlideIndex);

    console.log(
      "singindex ",
      artworkIndex,
      "currentslide index ",
      currentSlideIndex
    );
    artworkIndex = currentSlideIndex;
  });

  // Updates device volume
  const sliderChange = (value) => {
    VolumeControl.change(value);
  };

  // Updates Slider UI when hardware buttons change volume
  const volumeEvent = (event) => {
    setVolume(event.volume);
  };

  useEffect(async () => {
    await context.loadPreviousAudio();
    await loadAssetsAsync(); // load font
    artworkIndex = await currentAudioIndex;
  }, []);

  useEffect(() => {
    const newData = [
      // [...artworkList].pop(),
      ...artworkList,
      // [...artworkList].shift(),
    ];
    setDataToRender([...newData]);
  }, [artworkList.length]);

  const handleScrollTo = (index) => {
    songSlider.current.scrollToIndex({ animated: false, index });
  };

  // set current index on slider change | for the infinite loop slider
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  // useEffect(() => {
  // }, [context.currentAudio]);

  // skip to next audio ---------------------------------------------------------
  const skipForward = async () => {
    await changeAudio(context, "next");
    if (currentAudioIndex >= context.totalAudioCount - 1) {
      return handleScrollTo(0);
    }
    songSlider.current.scrollToOffset({
      offset: (currentAudioIndex + 1) * width,
    });
    // handleScrollTo(currentAudioIndex + 1);
  };
  // ----------------------------------------------------------------------------
  // skip to previous audio ----------------------start--------------------------------
  const skipBackward = async () => {
    await changeAudio(context, "previous");
    if (currentAudioIndex <= 0) {
      return handleScrollTo(context.totalAudioCount - 1);
    }
    songSlider.current.scrollToOffset({
      offset: (currentAudioIndex - 1) * width,
    });
    // handleScrollTo(currentAudioIndex - 1);
  };
  //-----------------------------end-------------------------

  useEffect(() => {
    if (onSetup === false) {
      songSlider.current.scrollToOffset({
        offset: currentAudioIndex * width,
      });
      console.log("current index is ", currentAudioIndex);
    }
    context.handleFavourate();
  }, [currentAudioIndex]);

  // To render songs in music player screen
  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{ width: width, justifyContent: "center", alignItems: "center" }}
      >
        <View style={styles.artworkWrapper}>
          {item.image ? (
            // <SVGImg width={200} height={200} />
            <Text style={{ fontSize: 100 }}>{index + 1}</Text>
          ) : (
            <Image
              style={styles.artworkImg}
              source={require("../assets/img/adaptive-icon.png")}
            />
          )}
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
    onSetup = false;
    await selectAudio(context.currentAudio, context);
  };
  // ---------------------------------------------- ----------------------------------------

  const handleFavourateSetOrRemove = async () => {
    try {
      let oldList = await context.playList;
      let updatedList = [];

      if (oldList !== null) {
        if (!isFavourate) {
          console.log("not favourate ----------------><");
          updatedList = await oldList.filter((list) => {
            if (list.title == "My Favourate") {
              list.audios = [...list.audios, currentAudio];
            }
            return list;
          });
        }
        if (isFavourate) {
          updatedList = await oldList.filter((list) => {
            if (list.title == "My Favourate") {
              console.log("remove from favourate ----------------><");
              list.audios = list.audios.filter((audio) => {
                return audio.id !== currentAudio.id;
              });
            }
            return list;
          });
        }
        // update current updated list
        await context.updateState(this, {
          isFavourate: !isFavourate,
          playList: [...updatedList],
        });

        return storePlayListForNextOpening(updatedList);
      }
    } catch (error) {
      console.log("Error inside handleFavourateSet Or Remove", error);
    }
  };

  // if (!context.currentAudio) return null;

  // Load Font to use For this Screen only
  const loadAssetsAsync = async () => {
    await Font.loadAsync({
      "Roboto-ThinItalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),
      "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),
      "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
      "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
      "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
      "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    });
    setFontLoaded(true);
  };

  if (!fontLoaded && !context.currentAudio) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning ? (
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  From Playlist :{" "}
                </Text>
                <Text
                  style={{ color: colors.subTxt, fontFamily: "Roboto-Italic" }}
                >
                  {context.activePlayList.title}
                </Text>
              </>
            ) : null}
          </View>
          {context.isPlayListRunning ? (
            <Text style={[styles.audioIndex, { color: colors.text }]}>{`${
              currentAudioIndex + 1
            } / ${context.totalAudioCount}`}</Text>
          ) : (
            <Text style={[styles.audioIndex, { color: colors.text }]}>{`${
              currentAudioIndex + 1
            } / ${context.totalAudioCount}`}</Text>
          )}
        </View>
        {/* Artwork Image or Carosel Image */}
        {dataToRender.length ? (
          <View style={{ width }}>
            <Animated.FlatList
              ref={songSlider}
              data={dataToRender}
              initialScrollIndex={context.currentAudioIndex || 0}
              onViewableItemsChanged={onViewableItemsChanged.current}
              keyExtractor={(item, index) =>
                parseInt(item?.id) + index * Math.random()
              }
              horizontal
              pagingEnabled
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              viewabilityConfig={viewabilityConfig.current}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              // onScroll={Animated.event(
              //   [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              //   { useNativeDriver: true }
              // )}
              renderItem={renderSongs}
            />
          </View>
        ) : null}
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

        <View>
          {/* Slider Bar */}
          <View style={styles.favourateLabelContainer}>
            <TouchableOpacity
              onPress={() => {
                handleFavourateSetOrRemove();
              }}
            >
              <Ionicons
                style={{ color: colors.icon }}
                name={isFavourate ? "heart" : "heart-outline"}
                size={25}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                context.handleShuffle();
              }}
            >
              <Ionicons
                style={{ color: colors.icon }}
                name={
                  context.isShuffle
                    ? "shuffle-outline"
                    : "arrow-forward-outline"
                }
                size={25}
              />
            </TouchableOpacity>
          </View>
          <Slider
            style={styles.progressContainer}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            thumbTintColor={colors.subTxt}
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
              name={context.isPlaying ? "pause-circle" : "play-circle"}
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
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="book-information-variant"
              size={30}
              style={{ color: colors.icon }}
              onPress={() => {
                navigation.navigate("BlogScreen");
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Entypo
              name="folder-music"
              size={30}
              style={{ color: colors.icon }}
              onPress={() => {
                navigation.navigate("Playlist");
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons
              name="queue-music"
              size={30}
              style={{ color: colors.icon }}
              onPress={() => {
                navigation.navigate("AudioList");
              }}
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
    marginVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#F0EBE3",
    elevation: 10,
  },
  artworkImg: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  songTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "200",
    textAlign: "center",
    color: "#1A3C40",
    fontFamily: "Roboto-Light",
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
    alignItems: "center",
    paddingHorizontal: 15,
  },
  favourateLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: -20,
  },
  progressLableTxt: {
    fontFamily: "Roboto-Light",
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
