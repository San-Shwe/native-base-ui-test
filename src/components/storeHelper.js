import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpening = async (audio, index) => {
  try {
    await AsyncStorage.setItem(
      "previousAudio",
      JSON.stringify({ audio, index }) // store json format to text format
    );
  } catch (error) {
    console.log("error from store helper, -> ", error);
  }
};
