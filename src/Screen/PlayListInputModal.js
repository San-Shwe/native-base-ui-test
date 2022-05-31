import React, { useState } from "react";
import color from "../misc/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";

export const PlayListInputModal = ({ visible, onClose, onSubmit }) => {
  const { colors } = useTheme();
  const [playListName, setPlayListName] = useState("");

  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPlayListName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLbl, { color: colors.icon }]}>
            Create New Playlist
          </Text>
          <TextInput
            value={playListName}
            onChangeText={(text) => {
              setPlayListName(text);
            }}
            style={styles.input}
          />
          <Ionicons
            name="checkmark-outline"
            size={35}
            color="#fff"
            onPress={handleOnSubmit}
            style={styles.sumitIcon}
          />
        </View>
      </View>

      {/* Background for Modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBg]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  inputContainer: {
    width: width - 20,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    // borderBottomColor: "red",
    // backgroundColor: "#fff",
    // borderBottomWidth: 1,
    fontSize: 18,
    paddingVertical: 5,
  },
  sumitIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: color.ACTIVE_BG,
    marginTop: 15,
  },
  modalBg: {
    zIndex: -1,
    backgroundColor: color.MODAL_BG,
  },
  inputLbl: {
    paddingBottom: 12,
    fontSize: 17,
  },
});

export default PlayListInputModal;
