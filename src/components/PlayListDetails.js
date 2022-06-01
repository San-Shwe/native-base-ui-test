// import React, { useContext } from "react";
// import {
//   Text,
//   StyleSheet,
//   View,
//   FlatList,
//   Modal,
//   Dimensions,
// } from "react-native";
// import { selectAudio } from "../misc/AudioController";
// import AudioListItem from "./AudioListItem";
// import color from "../misc/color";
// import { AudioContext } from "./AudioProvider";
// import { useTheme } from "react-native-paper";

// export const PlayListDetails = ({ visible, playList, onClose }) => {
//   const context = useContext(AudioContext);
//   const { colors } = useTheme();

//   const playAudio = (item) => {
//     selectAudio(item, context);
//   };
//   return (
//     <Modal
//       animationType="slide"
//       visible={visible}
//       transparent
//       onRequestClose={onClose}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>{playList.title}</Text>
//         <FlatList
//           contentContainerStyle={styles.listContainer}
//           data={playList.audios}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={{ marginBottom: 20 }}>
//               <AudioListItem
//                 title={item.filename}
//                 duration={item.duration}
//                 onAudioPress={playAudio(item)}
//               />
//             </View>
//           )}
//         />
//       </View>
//       <View style={styles.modalBG} />
//     </Modal>
//   );
// };

// const { width, height } = Dimensions.get("window");

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: 0,
//     alignSelf: "center",
//     height: height - 150,
//     width: width - 15,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   modalBG: {
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     position: "absolute",
//     backgroundColor: color.MODAL_BG,
//     zIndex: -1,
//   },
//   listContainer: {
//     padding: 20,
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//     paddingVertical: 5,
//     color: color.ACTIVE_BG,
//   },
// });
