import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";
import * as Font from "expo-font";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "./context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
// import Svg, {Path} from 'react-native-svg';
import SVGImg from "../assets/img/undraw_video_streaming_re_v3qg.svg";

const RootStackScreen = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  const [fontLoaded, setFontLoaded] = useState(false);
  // clear data if error occur developer
  const removeData = async () => {
    await AsyncStorage.removeItem("previousAudio");
    await AsyncStorage.removeItem("playlist");
    await AsyncStorage.removeItem("artwork");
  };

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

  useEffect(() => {
    loadAssetsAsync();
  });

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/img/rakhine_flag_overlay.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "white",
        }}
      >
        <View style={styles.container}>
          <View>
            <View>
              <Text style={styles.mainHeader}>Rakhita</Text>
            </View>
            <View>
              <Text style={styles.subHeader}>Music App</Text>
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity onPress={removeData}>
              {/* <Image
              source={require("../assets/img/undraw_video_streaming_re_v3qg.svg")}
              style={styles.logo}
            /> */}
              <SVGImg width={200} height={200} />
            </TouchableOpacity>

            <Text style={styles.instructions}>
              Rakhita is a free, simple music player app that can be used both
              online and offline. You can upload your own songs to Rakhita.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              bottom: 20,
              flexDirection: "row",
              backgroundColor: "#DA1212",
              width: "60%",
              height: 70,
              padding: 20,
              borderRadius: 5,
              textAlign: "center",
              justifyContent: "space-around",
            }}
            onPress={() => {
              signIn();
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
              }}
            >
              Let's Began
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 305,
    height: 200,
    marginBottom: 10,
    transform: [{ rotate: "45deg" }],
  },
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    fontFamily: "Roboto-Light",
  },
  mainHeader: {
    top: 10,
    width: "100%",
    height: 100,
    padding: 20,
    textAlign: "center",
    // fontWeight: "bold",
    fontSize: 30,
    fontFamily: "Roboto-Bold",
    color: "#000000",
  },
  subHeader: {
    width: "100%",
    textAlign: "center",
    color: "#000000",
    fontFamily: "Roboto",
  },
});

export default RootStackScreen;
