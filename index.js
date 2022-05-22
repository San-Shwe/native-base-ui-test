import { registerRootComponent } from "expo";
// import { AppRegistry, Platform } from "react-native"; // new
import App from "./App";
import TrackPlayer from "react-native-track-player";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require("./service"));

// new
// AppRegistry.registerComponent("X", () => App);
// if (Platform.OS === "web") {
//   const rootTag =
//     document.getElementById("root") || document.getElementById("X");
//   AppRegistry.runApplication("X", { rootTag });
// }
