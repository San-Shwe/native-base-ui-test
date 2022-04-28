import React from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  NavigationContainer,
  NavigationHelpersContext,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import GammingImg from "./assets/img/gaming.svg";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ImagePickerScreen" component={ImagePickerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Main = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blue",
      }}
    >
      <View style={styles.container}>
        <Text style={styles.mainHeader}>My City Clone</Text>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ImagePickerScreen")}
          >
            <Image
              source={{ uri: "https://i.imgur.com/TkIrScD.png" }}
              style={styles.logo}
            />
          </TouchableOpacity>

          <Text style={styles.instructions}>
            To share a photo from your phone with a friend, just press the
            button below!
          </Text>
        </View>

        {/* <GammingImg width={120} height={40} fill={"none"} /> */}

        {/* <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
          <Text style={styles.buttonText}>Pick a photo</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            // position: "absolute",
            bottom: 20,
            flexDirection: "row",
            backgroundColor: "#AD40AF",
            width: "60%",
            height: 70,
            padding: 20,
            borderRadius: 5,
            textAlign: "center",
            justifyContent: "space-around",
          }}
          onPress={() => navigation.navigate("Home")}
        >
          <Text
            style={{
              fontSize: 20,
              // fontFamily: "Roboto-Light",
              // fontWeight: "bold",
              color: "white",
            }}
          >
            Let's Began
          </Text>
          <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  mainHeader: {
    top: 10,
    width: "90%",
    height: 100,
    padding: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    // fontFamily: "Roboto-Light",
    color: "#000000",
  },
});

const Home = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <Text>Home Screen</Text>
    </View>
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
          backgroundColor: "blue",
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
        backgroundColor: "blue",
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

export default App;
