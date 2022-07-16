import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeThemeForNextOpening } from "./src/misc/storeHelper";

// IMPORT PACKAGES
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  ActivityIndicator,
} from "react-native-paper";

// IMPORT COMPONENTS
import MusicPlayer from "./src/components/MusicPlayer";
import DrawerContent from "./src/components/DrawerContent";
import ProfileScreen from "./src/components/ProfileScreen";
import SupportScreen from "./src/components/SupportScreen";
import RootStackScreen from "./src/components/RootStackScreen";
import { AuthContext } from "./src/components/context";
import AudioList from "./src/components/AudioList";
import { AudioProvider } from "./src/components/AudioProvider";
import Playlist from "./src/Screen/Playlist";
import { PlayListDetails } from "./src/Screen/PlayListDetails";

const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MusicPlayer"
        component={MusicPlayer}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="AudioList"
        component={AudioList}
        options={{ title: "Audio List" }}
      />
      <HomeStack.Screen
        name="PlayListDetails"
        options={{ headerShown: false, title: "Play List Details" }}
        component={PlayListDetails}
        navigation={navigation}
      />
      <HomeStack.Screen
        name="Playlist"
        options={{ headerShown: false, title: "Play List" }}
        navigation={navigation}
        component={Playlist}
      />
    </HomeStack.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const loadTheme = async () => {
    try {
      const previousTheme = await AsyncStorage.getItem("previousTheme");
      if (previousTheme !== null) {
        const currentTheme = JSON.parse(previousTheme);
        setIsDarkTheme(currentTheme.isDarkTheme);
        console.log(currentTheme);
      }
    } catch (error) {
      console.log("Error inside Load Theme ", error);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  // Authentication Status Function
  const authContext = useMemo(() => ({
    signIn: () => {
      setUserToken("dfsdf");
      setIsLoading(false);
    },
    signOut: () => {
      setUserToken(null);
      setIsLoading(false);
    },
    signUp: () => {
      setUserToken("dfsdf");
      setIsLoading(false);
    },
    toggleTheme: () => {
      storeThemeForNextOpening(!isDarkTheme);
      setIsDarkTheme(!isDarkTheme);
    },
  }));

  // Loading Screen for App
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      text: "#333333",
      subTxt: "#413F42",
      icon: "#990011FF",
      opacity: "#7F8487",
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      text: "#fff",
      subTxt: "#F1EEE9",
      icon: "#03DAC5",
      opacity: "#99A799",
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <AudioProvider>
          <NavigationContainer theme={theme}>
            {userToken != null ? (
              <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                initialRouteName="HomeScreen"
              >
                <Drawer.Screen
                  name="HomeScreen"
                  component={HomeStackScreen}
                  options={{ headerShown: false }}
                />
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Support" component={SupportScreen} />
              </Drawer.Navigator>
            ) : (
              <RootStackScreen />
            )}
          </NavigationContainer>
        </AudioProvider>
      </AuthContext.Provider>
    </PaperProvider>
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
