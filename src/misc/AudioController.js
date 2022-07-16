import { storeAudioForNextOpening } from "./storeHelper";

// play audio
export const play = async (playbackObj, uri, lastPosition = {}) => {
  try {
    console.log("start");

    if (!lastPosition)
      return await playbackObj.loadAsync(
        {
          uri,
        },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
      );
    // buy if there is last position then we will play audio from the last postion.
    await playbackObj.loadAsync(
      {
        uri,
      },
      { progressUpdateIntervalMillis: 1000 }
    );

    return playbackObj.playFromPositionAsync(lastPosition);

    // if(lastPosition)
  } catch (error) {
    console.log("error indie paly helper method", error);
  }
};

// pause audio
export const pause = async (playbackObj) => {
  try {
    console.log("pause");
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error indie pause helper method", error);
  }
};

// resume audio
export const resume = async (playbackObj) => {
  try {
    console.log("resume");
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error indie resume helper method", error);
  }
};

// paly another audio
export const playNext = async (playbackObj, uri) => {
  try {
    console.log("playNext");
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return play(playbackObj, uri);
  } catch (error) {
    console.log("error indie playNext helper method", error);
  }
};

// manually select audio form playlist
export const selectAudio = async (audio, context, playListInfo = {}) => {
  const {
    playbackObj,
    soundObj,
    currentAudio,
    updateState,
    onPlaybackStatusUpdate,
    audioFile,
    isPlaying,
  } = context; // states from AudioProvider

  try {
    // playing audio for the first time > just once
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri, audio.lastPosition);
      // get current audio index
      // const startIndex = await audioFile.map((a) => a.id).indexOf(audio.id);
      const startIndex = audioFile.findIndex(({ id }) => id === audio.id);
      // set current music status to state and Exit function
      await updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: startIndex,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      await playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); // update current duration and positions regularly
      return storeAudioForNextOpening(audio, startIndex); // store current audio and its' index
    }

    // console.log(
    //   soundObj.isLoaded,
    //   soundObj.isPlaying,
    //   currentAudio.id == audio.id
    // );

    // pause audio > if playing
    if (soundObj.isLoaded && isPlaying == true && currentAudio.id == audio.id) {
      const status = await pause(playbackObj);
      // get current audio index
      const PauseIndex = await audioFile.map((a) => a.id).indexOf(audio.id);
      console.log("pause index is ", PauseIndex);
      await updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: false,
        currentAudioIndex: PauseIndex,
      });
      return storeAudioForNextOpening(
        audio,
        PauseIndex,
        context.playbackPosition
      ); // store current audio and its' index
    }

    // resume audio > if click recent song
    if (
      soundObj.isLoaded &&
      isPlaying == false &&
      currentAudio.id == audio.id
    ) {
      const status = await resume(playbackObj);
      // get current audio index
      const index = await audioFile.map((a) => a.id).indexOf(audio.id);
      console.log("resume index >> ", index);
      await updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index); // store current audio and its' index
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFile.findIndex(({ id }) => id === audio.id);
      console.log(index, "from select another ");
      await updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      return storeAudioForNextOpening(audio, index); // store current audio and its' index
    }
  } catch (error) {
    console.log("error inside select audio method", error);
  }
};

const selectAudioFromPlaylist = async (context, select) => {
  const { activePlayList, currentAudio, audioFile, playbackObj, updateState } =
    context;
  let audio;
  let defaultIndex; // default index for first and last audio selection
  let nextIndex; // coming index

  // to get current index in PlayList
  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id
  );

  if (select === "next") {
    console.log("-----------------------next ----------------");
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }
  if (select === "previous") {
    console.log("-----------------------previous ----------------");
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }

  console.log(nextIndex, " - next index");
  audio = activePlayList.audios[nextIndex];
  // if next audio is not in currentPlaying index, set the audio to first or last audio according to selection
  if (!audio) audio = activePlayList.audios[defaultIndex];
  // to get current index in audioList
  const indexOnAllList = audioFile.findIndex(({ id }) => id === audio.id);

  const status = await playNext(playbackObj, audio.uri);

  return updateState(context, {
    currentAudio: audio,
    soundObj: status,
    isPlaying: true,
    currentAudioIndex: indexOnAllList,
  });
};

// previous and next section ------------start------------------------------------------------------
export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFile,
    updateState,
    isPlayListRunning,
    isPlaying,
  } = context;

  try {
    // if the audio is playing from Playlist.
    if (isPlayListRunning) return selectAudioFromPlaylist(context, select);

    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 == totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;

    let audio;
    let index;
    let status;
    if (select === "next") {
      console.log("next");
      audio = audioFile[currentAudioIndex + 1];
      // for next
      if (!isLoaded && !isLastAudio) {
        // if audio is new play the first time
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri);
        // await playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); // update current duration and positions
      }

      if (isLoaded && !isLastAudio) {
        // if it is loaded but not last audio
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFile[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    if (select === "previous") {
      console.log("previous");
      audio = audioFile[currentAudioIndex - 1];
      // for previous
      if (!isLoaded && !isFirstAudio) {
        console.log("--------------------> FIRST time playing");
        // if audio is new
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri);
        // await playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); // update current duration and posit
      }

      if (isLoaded && !isFirstAudio) {
        // if it is loaded but not first audio
        console.log("--------------------> NOT FIRST audio");
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri);
      }

      if (isFirstAudio) {
        console.log("--------------------> FIRST audio");
        index = totalAudioCount - 1;
        audio = audioFile[index];
        console.log(audio);
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    await updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    // console.log("AFTER NEXT SONG >>> ", context.soundObj);
    return await storeAudioForNextOpening(audio, index, 0);
  } catch (error) {
    console.log("error inside change audio method", error);
  }
};
// --------------------------------end---------------------------------------------

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  // stop sliding
  if (soundObj === null) return;
  try {
    if (isPlaying) {
      // console.log("current posigonMillis is >>> ", context.playbackPosition);
      const status = await playbackObj.setPositionAsync(
        Math.floor(soundObj.durationMillis * value)
      );
      await updateState(context, {
        soundObj: status,
        isPlaying: true,
        // playbackPosition: status.positionMillis,
      });

      const resumeStatus = await resume(playbackObj);
      await updateState(context, {
        soundObj: resumeStatus,
        isPlaying: true,
        playbackPosition: resumeStatus.positionMillis,
      });
    } else {
      // console.log("current posigonMillis is >>> ", context.playbackPosition);
      const status = await playbackObj.setPositionAsync(
        Math.floor(soundObj.durationMillis * value)
      );
      await updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }
  } catch (error) {
    console.log("error inside onSlidingComplete", error);
  }
};
