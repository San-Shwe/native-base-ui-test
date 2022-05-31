import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { storeAudioForNextOpening } from "../misc/storeHelper";
import { playNext } from "../misc/AudioController";

export const AudioContext = createContext();

export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: [],
      playList: [], // already having playlist
      addToPlayList: null, // a new playlist to addx`
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

  // to update my state from other palce
  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio"); // get the item that we store
    let currentAudio;
    let currentAudioIndex;
    if (previousAudio === null) {
      console.log("previous audio is null");
      currentAudio = this.state.audioFile[0]; // set first audio if there is no audio in storage
      currentAudioIndex = 0;
    } else {
      console.log("previous audio have data");
      previousAudio = JSON.parse(previousAudio); // reconvert json format
      currentAudio = previousAudio.audio; // assign to currentAudio
      currentAudioIndex = previousAudio.index; // assign current audio index
      console.log(currentAudioIndex);
    }
    return this.setState({ ...this.state, currentAudio, currentAudioIndex }); //
  };

  // update status regularly
  onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis, // set current position
        playbackDuration: playbackStatus.durationMillis, // set current audio duration
      });
    }

    // play next audio if finished current audio
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;

      // if there is no audio to play
      if (nextAudioIndex >= this.totalAudioCount) {
        console.log("there is no audio to play -----------------");
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          currentAudio: this.state.audioFile[0],
          soundObj: null,
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFile[0], 0);
      }

      // /otherwise play the next song
      const audio = this.state.audioFile[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, audio.uri);
      this.updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      console.log("toal song > ", this.totalAudioCount);
      console.log("nextAduio index > ", nextAudioIndex);
      console.log("audio > ", audio);
      await storeAudioForNextOpening(audio, nextAudioIndex); // store when audio is finish
    }
  };

  // do on load
  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
      console.log(" NULL ---> ", this.state.playbackObj);
    } else {
      console.log(" NOT NULL ---> ", this.state.playbackObj.getStatusAsync());
    }
  }

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
      playList,
      addToPlayList,
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
          playList,
          addToPlayList,
          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}
