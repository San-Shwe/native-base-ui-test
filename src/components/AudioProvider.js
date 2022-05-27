import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      soundObj: null, // current songs status eg. playing or pause or loading
      playbackObj: null, // this can change current song activities
      currentAudio: {}, // current playing audio data
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null, // to calculate current position
      playbackDuration: null, // to calculate current position
    };
    this.totalAudioCount = 0;
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
    this.totalAudioCount = media.totalCount;

    // add songs tracks json file to state
    this.setState({
      ...this.state,
      audioFile: [...audioFile, ...media.assets],
      dataProvider: dataProvider.cloneWithRows([...audioFile, ...media.assets]),
    });
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
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  // to update my state from other palce
  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio"); // get the item that we store
    let currentAudio;
    let currentAudioIndex;
    if (previousAudio === null) {
      currentAudio = this.state.audioFile[0]; // set first audio if there is no audio in storage
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio); // reconvert json format
      currentAudio = previousAudio.audio; // assign to currentAudio
      currentAudioIndex = previousAudio.index; // assign current audio index
    }
    this.setState({ ...this.state, currentAudio, currentAudioIndex }); //
  };

  render() {
    const {
      audioFile,
      permissionError,
      dataProvider,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition, // to calculate current position
      playbackDuration,
    } = this.state;
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
        value={{
          audioFile,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
