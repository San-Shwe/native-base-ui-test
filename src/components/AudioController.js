// play audio
export const play = async (playbackObj, uri) => {
  try {
    console.log("start");
    return await playbackObj.loadAsync(
      {
        uri,
      },
      { shouldPlay: true }
    );
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
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("error indie playNext helper method", error);
  }
};
