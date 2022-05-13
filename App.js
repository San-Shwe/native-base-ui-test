import React from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import {
//   NavigationContainer,
//   NavigationHelpersContext,
// } from "@react-navigation/native";

// import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/components/home";

// const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Main />
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen
    //       name="Main"
    //       component={Main}
    //       options={{ headerShown: false }}
    //     />
    //     <Stack.Screen name="Home" component={Home} />
    //     <Stack.Screen name="ImagePickerScreen" component={ImagePickerScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

const Main = ({ navigation }) => {
  const [startApp, setStartApp] = React.useState(false);

  // On Click Handler -> when click Let's Began Button
  const LetBeganHandler = () => {
    setStartApp(true);
  };

  if (startApp == true) {
    return <Home />;
  } else {
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
              Rakhita music app is awesome, you can listen online and offline.
              You can upload your own song on Rakhita
            </Text>
          </View>

          {/* <GammingImg width={120} height={40} fill={"none"} /> */}

          {/* <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
            <Text style={styles.buttonText}>Pick a photo</Text>
          </TouchableOpacity> */}
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
            onPress={() => LetBeganHandler()}
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
            <MaterialIcons name="arrow-forward-ios" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
        {/* </ImageBackground> */}
      </SafeAreaView>
    );
  }
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
