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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Slider from "react-native-slider";
import * as ImagePicker from "expo-image-picker";

import {
  NavigationContainer,
  NavigationHelpersContext,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

const MusicPlayerScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        {/* <MaterialIcons name="favorite" size={22} color="#8F00FF" />
        <Text>App Screen</Text> */}
        <View style={styles.artworkWrapper}>
          <Image
            source={require("../assets/artwork/FarCry6.png")}
            style={styles.artworkImg}
          />
        </View>
        <View>
          <Text style={styles.title}>song Title</Text>
          <Text style={styles.artist}>song artist</Text>
        </View>
        <View>
          <Slider
            style={styles.progressContainer}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#ffd369"
            minimumTrackTintColor="#ffd369"
            maximumTrackTintColor="#fff"
            onSliderComplete={() => {}}
          />
        </View>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.bottomControl}>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="favorite" size={30} color="#8F00FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="repeat" size={30} color="#8F00FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="share" size={30} color="#8F00FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialIcons name="menu" size={30} color="#8F00FF" />
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
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default Home;
