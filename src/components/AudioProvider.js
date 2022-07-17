import React, { Component, createContext } from "react";
import { Text, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import {
  storeAudioForNextOpening,
  storeArtworkForTheNextOpening,
} from "../misc/storeHelper";
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
      selectedPlayList: {}, // to pass data from playlist to playlist details
      isPlayListRunning: false, // to know it is playing inside Playlist
      activePlayList: [], // current playing Playlist, not audio list
      isFavourate: false,
      isShuffle: false,
      artworkList: [], // artWork for FlatList or Slider
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

  // ----------------------------------------------------------END AUDIO LAOD-----------------------------------------------------------------------------------------
  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio"); // get the item that we store
    let currentAudio;
    let currentAudioIndex;

    const previousArtwork = await AsyncStorage.getItem("cover"); // get the item that we store
    let artworkList = [];

    if (previousAudio === null) {
      console.log("previous audio is null");
      currentAudio = this.state.audioFile[0]; // set first audio if there is no audio in storage
      currentAudioIndex = 0;
      // storeArtworkForTheNextOpening(this.state.artworkList); // store for the next opening if there is no artwork
    } else {
      console.log("previous audio have data");
      previousAudio = JSON.parse(previousAudio); // reconvert json format
      currentAudio = previousAudio.audio; // assign to currentAudio
      currentAudioIndex = previousAudio.index; // assign current audio index
      // console.log(previousAudio.audio);
    }

    // get previous Artwork--------------------------------------------------
    if (previousArtwork?.length == 0 || previousArtwork == null) {
      console.log("previous artwork is null");
      // add default artwork if there is no artwork
      this.state.audioFile.forEach((audio) => {
        artworkList.push({
          id: audio.id,
          image: "../assets/img/adaptive-icon.png",
        });
      });
      storeArtworkForTheNextOpening(artworkList);
    } else {
      console.log("previous artwork have data");
      artworkList = await JSON.parse(previousArtwork); // reconvert json format
    }

    // get previous Playlist-------------------------------------------------
    const previousPlaylist = await AsyncStorage.getItem("playlist"); // is any playlist?
    let playList;
    if (previousPlaylist === null) {
      playList = [];
    } else {
      playList = JSON.parse(previousPlaylist);
    }

    return this.setState({
      ...this.state,
      currentAudio,
      currentAudioIndex,
      playList,
      artworkList,
    }); //
  };
  // ----------------------------------------------------------END AUDIO LAOD-----------------------------------------------------------------------------------------

  // update status regularly
  onPlaybackStatusUpdate = async (playbackStatus) => {
    // update regularlt current position to [state] if audio is playing
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis, // set current position
        playbackDuration: playbackStatus.durationMillis, // set current audio duration
      });
    }
    // console.log(playbackStatus.isLoaded, " <> ", playbackStatus.isPlaying);
    // store audio position for next opening, when the audio is pause,
    if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
      storeAudioForNextOpening(
        this.state.currentAudio,
        this.state.currentAudioIndex,
        playbackStatus.positionMillis
      );
    }

    // play next audio if finished current audio
    if (playbackStatus.didJustFinish) {
      if (this.state.isPlayListRunning) {
        let audio;
        // to get current index in PlayList
        const indexOnPlayList = this.state.activePlayList.audios.findIndex(
          ({ id }) => id === this.state.currentAudio.id
        );

        // next opening is shuffle or simple
        const nextIndex = this.state.isShuffle
          ? this.shuffleArray(this.totalAudioCount)
          : indexOnPlayList + 1;
        audio = this.state.activePlayList.audios[nextIndex];
        // if next audio is last one, set the audio to first audio
        if (!audio) audio = this.state.activePlayList.audios[0];
        // to get current index in audioList
        const indexOnAllList = this.state.audioFile.findIndex(
          ({ id }) => id === audio.id
        );

        const status = await playNext(this.state.playbackObj, audio.uri);

        return this.updateState(this, {
          currentAudio: audio,
          soundObj: status,
          isPlaying: true,
          currentAudioIndex: indexOnAllList,
        });
      }

      const nextAudioIndex = this.state.isShuffle
        ? this.shuffleArray(this.totalAudioCount)
        : this.state.currentAudioIndex + 1;

      // if there is no audio to play
      if (nextAudioIndex >= this.totalAudioCount) {
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
      this.updateState(this.state, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex); // store when audio is finish
    }
  };

  // this function don't work without trycatch
  handleFavourate = async () => {
    try {
      let allFav = this.state.playList[0]; // get the favourate playlist
      if (allFav !== null) {
        let isFavourate = false;
        await allFav?.audios.every((item) => {
          if (item.id === this.state.currentAudio.id) {
            isFavourate = true;
            return false;
          }
          // console.log("----------- favourate ", isFavourate);
          return true;
        });
        console.log("-----------end favourate", isFavourate);
        return this.updateState(this, { isFavourate });
      }
    } catch (error) {
      console.log("error is inside Favourate Handle ", error);
    }
  };

  handleShuffle = () => {
    try {
      const isShuffle = !this.state.isShuffle;
      if (isShuffle === true) {
      } else {
      }
      this.updateState(this, {
        isShuffle,
      });
    } catch (error) {
      console.log("error inside shuffle");
    }
  };

  shuffleArray = (maxLimit) => {
    let rand = Math.random() * maxLimit;
    rand = Math.floor(rand);
    return rand;
  };

  // do on load
  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
      });
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
      console.log("playback Obj is Null on load");
      // console.log(" NULL ---> ", this.state.playbackObj);
    } else {
      // console.log(" NOT NULL ---> ", this.state.playbackObj.getStatusAsync());
      console.log("playback Obj is NOT Null on load");
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
      selectedPlayList,
      isPlayListRunning,
      activePlayList,
      isFavourate,
      artworkList,
      isShuffle,
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
          playbackPosition,
          playbackDuration,
          playList,
          addToPlayList,
          selectedPlayList,
          isPlayListRunning,
          activePlayList,
          isFavourate,
          artworkList,
          isShuffle,
          handleShuffle: this.handleShuffle,
          totalAudioCount: this.totalAudioCount,
          handleFavourate: this.handleFavourate,
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
