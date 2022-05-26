import React, { Component, useEffect, useContext } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { AudioContext } from "./AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "./AudioListItem";
import Screen from "./Screen";
import OptionModal from "./OptionModal";
import { Audio } from "expo-av";
import { play, pause, resume, playNext } from "./AudioController";

export class AudioList extends Component {
  static contextType = AudioContext; // class rule - to use audio object

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false, // show and hide modal
    };

    this.currentItem = {}; // clicked song track
  }

  // layout provider for recyclerlistview
  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  // update status
  onPlaybackStatusUpdate = (playbackStatus) => {
    console.log(playbackStatus);
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.context.updateState(this.context, {
        playbackPosition: playbackStatus.positionMillis, // set current position
        playbackDuration: playbackStatus.durationMillis, // set current audio duration
      });
    }
  };

  // play music when click --------------------------start-------------------------------------
  handleAudioPress = async (audio) => {
    const {
      playbackObj,
      soundObj,
      currentAudio,
      updateState,
      isPlaying,
      audioFile,
    } = this.context; // states from AudioProvider

    // playing audio for the first time > just once
    if (soundObj === null) {
      const playbackObj = new Audio.Sound(); // initial audio object
      const status = await play(playbackObj, audio.uri);
      // get current audio index
      const index = audioFile.indexOf(audio);
      // set current music status to state and Exit function
      updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    }

    // pause audio > if playing
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id == audio.id
    ) {
      const status = await pause(playbackObj);
      // get current audio index
      const index = audioFile.indexOf(audio);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: false,
        currentAudioIndex: index,
      });
    }

    // resume audio > if click recent song
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id == audio.id
    ) {
      const status = await resume(playbackObj);
      // get current audio index
      const index = audioFile.indexOf(audio);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      // get current audio index
      const index = audioFile.indexOf(audio);
      return updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
    }
  };
  // handler --------------------------end-------------------------------------

  // render each song item and its' functionalities
  rowRenderer = (type, item, index, extendedState) => {
    // console.log(extendedState.isPlaying);
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        activeListItem={this.context.currentAudioIndex === index} // to change between icon & text
        isPlaying={extendedState.isPlaying}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          console.log(item);
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          return (
            <Screen style={{ flex: 1 }}>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />

              {/* show Option [paly and add to playlist] when click to eclipse icon */}
              <OptionModal
                currentItem={this.currentItem}
                onClose={() => {
                  this.setState({ ...this.state, optionModalVisible: false });
                }}
                visible={this.state.optionModalVisible}
                onPlayPress={() => {
                  console.log("paly");
                }}
                onPlayListPress={() => {
                  console.log("playlist add");
                }}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AudioList;
