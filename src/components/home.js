import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");
const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* Artwork Image or Carosel Image */}
        <View style={styles.artworkWrapper}>
          <Image
            source={require("../assets/artwork/Altos-Odyssey.jpeg")}
            style={styles.artworkImg}
          />
        </View>
        {/* Song Title and Artist Name */}
        <View>
          <Text style={styles.songTitle}>Song Title</Text>
          <Text style={styles.artistName}>Artist Name</Text>
        </View>
        {/* Slider Bar */}
        <View>
          <Slider
            style={styles.progressContainer}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#FFFFFF"
            onSlidingComplete={() => {}}
          />
          <View style={styles.progressLableContainer}>
            <Text style={styles.progressLableTxt}>0:20</Text>
            <Text style={styles.progressLableTxt}>3:50</Text>
          </View>
        </View>
        {/* Music Control */}
        <View style={styles.musicControls}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              style={{ marginTop: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="pause-circle-outline" size={75} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              style={{ marginTop: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* -------------------- */}
      {/* Bottom Control Group */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomControl}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat-outline" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-social-outline" size={30} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal-outline" size={30} />
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

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4DDFF",
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
    color: "#1A3C40",
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
    color: "#1A3C40",
    fontSize: 16,
  },
  bottomContainer: {
    borderTopColor: "#fff",
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
  // container: {
  //   flex: 1,
  //   backgroundColor: "#222831",
  // },
});
