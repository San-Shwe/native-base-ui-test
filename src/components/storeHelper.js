import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAddioForNextOpening = async (audio, index) => {
  try {
    await AsyncStorage.setItem(
      "previousAudio",
      JSON.stringify({ audio, index }) // store json format to text format
    );
  } catch (error) {
    console.log("error from store helper, -> ", error);
  }
};
