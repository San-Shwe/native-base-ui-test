import React, { useState } from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
  ImageBackground,
} from "react-native";

import {
  NavigationContainer,
  NavigationHelpersContext,
  DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

import Home from "./src/components/home";

const HomeStackScreen = ({ navigation }) => {
  return (
    // <StatusBar barStyle="light-content" />
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={Home}
      />
    </HomeStack.Navigator>
  );
};

const App = () => {
  const [newStart, setNewStart] = useState(true);

  if (newStart == true) {
    return <Main setNewStart={setNewStart} />;
  } else {
    return (
      <NavigationContainer theme={DarkTheme}>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeStackScreen} />
          {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
        </Drawer.Navigator>

        {/* <StatusBar barStyle="light-content" />
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
        </Stack.Navigator> */}
      </NavigationContainer>
    );
  }
};

const Main = ({ setNewStart }) => {
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
          <TouchableOpacity
            onPress={() => navigation.navigate("ImagePickerScreen")}
          >
            <Image
              source={require("./assets/adaptive-icon.png")}
              style={styles.logo}
            />
          </TouchableOpacity>

          <Text style={styles.instructions}>
            Rakhita music app is awesome, you can listen online and offline. You
            can upload your own song on Rakhita
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
          onPress={() => setNewStart(false)}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 305,
    height: 200,
    marginBottom: 10,
    // backgroundColor: "red",
    transform: [{ rotate: "45deg" }],
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
  mainHeader: {
    top: 10,
    width: "100%",
    height: 100,
    padding: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    // fontFamily: "Roboto-Light",
    color: "#000000",
  },
  subHeader: {
    width: "100%",
    textAlign: "center",
    color: "#000000",
  },
  backgroundImage: {
    flex: 1,
    // height: 100,
    // width: 200,
    alignSelf: "stretch",
    width: null,
    position: "absolute",
  },
});

export default App;
