import React from "react";
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import color from "../misc/color";
const OptionModal = ({
  visible,
  onClose,
  currentItem,
  onPlayPress,
  onPlayListPress,
}) => {
  const { filename } = currentItem;
  return (
    <>
      <StatusBar hidden={visible} />
      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modal}>
          <Text numberOfLines={1} style={styles.title}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPlayListPress}>
              <Text style={styles.option}>Add to Playlist</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Background for Modal */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.APP_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  optionContainer: { paddingLeft: 20 },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  modalBg: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    backgroundColor: color.MODAL_BG,
  },
});
