import React, { useEffect, useRef, useState } from "react";
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
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlayerState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { SafeAreaView } from "react-native-safe-area-context";

// import Ionicons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { songs } from "../model/data";

import {
  NavigationContainer,
  NavigationHelpersContext,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(songs);
};

const togglePlayBack = async (playBackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    if (playBackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

const Home = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MusicPlayerScreen"
          component={MusicPlayerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ImagePickerScreen" component={ImagePickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Music Player Compenent
const MusicPlayerScreen = () => {
  // to get current index by animated value
  const scrollX = useRef(new Animated.Value(0)).current;
  // slider > when click next or previous button
  const songSlider = useRef(null);
  // index > to get index of song, which can use to show song's title and author name
  const [songIndex, setSongIndex] = useState(0);
  // current play or purse state
  const playBackState = usePlayerState();

  // useEffect work everytime when user scroll the slider
  useEffect(() => {
    // get offline songs
    setupPlayer();

    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      setSongIndex(index);
    });
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  // Go To next Song
  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  // Go To Previous song
  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  // render songs component for flatlist
  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.artworkWrapper}>
          <Image source={item.image} style={styles.artworkImg} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
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
              [
                {
                  nativeEvent: {
                    contentOffset: { x: scrollX },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          />
        </View>
        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>
        <View>
          <Slider
            style={styles.progressContainer}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#ffd369"
            minimumTrackTintColor="#ffd369"
            maximumTrackTintColor="#FFF"
          />
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabelText}>0:00</Text>
            <Text style={styles.progressLabelText}>0:00</Text>
          </View>
        </View>
        <View style={styles.musicControls}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons
              name="play-skip-back-outline"
              size={30}
              style={{ marginTop: 10 }}
              color="#8F00FF"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              togglePlayBack(playBackState);
            }}
          >
            <Ionicons
              name={
                playBackState === State.play ? "play-circle" : "pause-circle"
              }
              size={50}
              color="#8F00FF"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={30}
              style={{ marginTop: 10 }}
              color="#8F00FF"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.bottomControl}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#8F00FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#8F00FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-social-outline" size={30} color="#8F00FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="settings-outline" size={30} color="#8F00FF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// image picker screen
const ImagePickerScreen = () => {
  const [selectedImage, setSelectedImage] = React.useState([]);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  if (selectedImage !== null) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View style={styles.container}>
          {/* {console.log(selectedImage)} */}
          <Image
            source={{ uri: selectedImage.localUri }}
            style={styles.thumbnail}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#006E7F",
              width: 150,
              height: 50,
              padding: 10,
              borderRadius: 5,
              textAlign: "center",
            }}
            onPress={(e) => setSelectedImage(null)}
          >
            <Text
              style={{
                fontSize: 20,
                // fontFamily: "Roboto-Light",
                fontWeight: "bold",
                color: "white",
              }}
            >
              CLEAR
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            backgroundColor: "#006E7F",
            width: 150,
            height: 50,
            padding: 10,
            borderRadius: 5,
            textAlign: "center",
          }}
          // onPress={(e) => setSelectedImage(null)}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Pick
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  bottomBar: {
    borderTopColor: "#393E46",
    borderTopWidth: 1,
    width: width,
    alignItems: "center",
    paddingVertical: 15,
  },
  bottomControl: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,

    shadowColor: "#ccc",
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  artworkImg: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  artist: {
    fontSize: 16,
    fontWeight: "200",
    color: "#eee",
    textAlign: "center",
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  progressLabelContainer: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelText: {
    color: "#fff",
  },
  musicControls: {
    flexDirection: "row",
    // textAlign: "center",
    width: "60%",
    justifyContent: "space-between",
    marginTop: 15,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default Home;
