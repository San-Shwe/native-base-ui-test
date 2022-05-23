import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "./context";

const RootStackScreen = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);

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
          <TouchableOpacity>
            <Image
              source={require("../assets/img/adaptive-icon.png")}
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
});

export default RootStackScreen;
