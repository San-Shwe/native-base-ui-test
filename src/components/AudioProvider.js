import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";

export const AudioContext = createContext();
export const MyContext = React.createContext("Hello React");

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
    };
  }

  // alert box for permission
  permissionAlert = () => {
    Alert.alert("Permission Request", "This app need to read audio file.", [
      { text: "I am Ready", onPress: () => this.getPermission() },
      { text: "Cancel", onPress: () => this.permissionAlert() },
    ]);
  };

  // read audio files
  getAudioFile = async () => {
    const { dataProvider, audioFile } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });

    // console.log(media);
    // add songs tracks json file to state
    this.setState({
      ...this.state,
      audioFile: [...audioFile, ...media.assets],
      dataProvider: dataProvider.cloneWithRows([...audioFile, ...media.assets]),
    });
    console.log(media.assets.length);
  };

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();

    // permission already granted
    if (permission.granted) {
      // we want to get all the audio list
      this.getAudioFile();
    }

    if (!permission.granted && !permission.canAskAgain) {
      this.setState({ ...this.state, permissionError: true });
    }

    // ask permission again if user don't accept
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      // If user dont allow
      if (status === "denied" && canAskAgain) {
        // we are going to display alert that the user must allow this permission to work this page
        this.permissionAlert();
      }

      // If user allow
      if (status === "granted") {
        // we want to get all file
        this.getAudioFile();
      }

      // if user check 'Never ask again"
      if (status === "denied" && !canAskAgain) {
        // we will display error to user
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  // do on load
  componentDidMount() {
    this.getPermission();
  }

  render() {
    const { audioFile, permissionError, dataProvider } = this.state;
    // show this screen if user denined audio permission
    if (permissionError) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", color: "red" }}>
            You have't accept the permission, please go to setting &gt;
            Permission &gt; Rakhita Music App &gt; Allow Audio Permission
          </Text>
        </View>
      );
    }
    return (
      <AudioContext.Provider
        value={{ audioFile, dataProvider, name: "San Shwe" }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
