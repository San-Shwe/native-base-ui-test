import React from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function App() {
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
          {console.log(selectedImage)}
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
                fontFamily: "Roboto-Light",
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
        <Image
          source={{ uri: "https://i.imgur.com/TkIrScD.png" }}
          style={styles.logo}
        />
        <Text style={styles.instructions}>
          To share a photo from your phone with a friend, just press the button
          below!
        </Text>

        <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
          <Text style={styles.buttonText}>Pick a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 20,
            flexDirection: "row",
            backgroundColor: "#AD40AF",
            width: "90%",
            height: 70,
            padding: 20,
            borderRadius: 5,
            textAlign: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto-Light",
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
}

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
});
