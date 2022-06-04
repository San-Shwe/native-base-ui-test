import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { AudioContext } from "./AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "./AudioListItem";
import Screen from "./Screen";
import OptionModal from "./OptionModal";
import { selectAudio } from "../misc/AudioController";
// import { storeAudioForNextOpening } from "../misc/storeHelper";

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

  // play music when click --------------------------start-------------------------------------
  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };
  // handler --------------------------end-------------------------------------

  // render each song item and its' functionalities
  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        activeListItem={this.context.currentAudioIndex === index} // to change between icon & text
        isPlaying={extendedState.isPlaying}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };

  // invoked immediately after a component is mounted
  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  render() {
    const { navigation, route } = this.props;

    const navigateToPlaylist = () => {
      this.context.updateState(this.context, {
        addToPlayList: this.currentItem, // set a new playlist to add for Playlist.js>createPlayList
      });
      navigation.navigate("Playlist");
    };

    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null; // if there is no data for data provider
          return (
            <Screen style={{ flex: 1 }}>
              {/* RecyclerListView for future App's Performance */}
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
                  this.handleAudioPress(this.currentItem);
                  // this.setState({ ...this.state, optionModalVisible: false });
                }}
                options={[
                  {
                    title: "Add to playlist",
                    onPress: navigateToPlaylist,
                  },
                ]}
                // onPlayListPress={() => {
                //   this.context.updateState(this.context, {
                //     addToPlayList: this.currentItem, // set a new playlist to add for Playlist.js>createPlayList
                //   });
                //   navigation.navigate("Playlist");
                // }}
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
