import React, { useState } from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import * as Progress from "react-native-progress";

export default Webview = () => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // const javascript = `window.alert('This is javascript')`;

  const localFile =
    Platform.OS === "ios"
      ? require("../assets/simple.html")
      : { uri: "file:///android_asset/simple.html" };
  return (
    <>
      {!loaded ? (
        <Progress.Bar
          borderRadius={0}
          borderWidth={0}
          progress={progress}
          width={null}
        />
      ) : null}

      <WebView
        source={{
          uri: "https://github.com/San-Shwe",
          headers: { key: "value" },
        }}
        // source={{ html: "<h1>Hello World</h1>" }}
        // source={localFile}
        onError={(event) =>
          alert(`Webview error ${event.nativeEvent.description}`)
        }
        onLoadEnd={() => setLoaded(true)}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        // injectedJavaScriptBeforeContentLoaded={javascript}
      />
    </>
  );
};
