import React from 'react';
import { WebView } from 'react-native-webview';
export default Webview = () => {
  return <WebView source={{ uri: 'https://reactnative.dev/' }} onError={(event)=>alert('Web')} />;
};
