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
const OptionModal = ({ visible, onClose, currentItem, options }) => {
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
            {options.map((option) => {
              return (
                <TouchableWithoutFeedback
                  key={option.title}
                  onPress={option.onPress}
                >
                  <Text style={styles.option}>{option.title}</Text>
                </TouchableWithoutFeedback>
              );
            })}
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
    paddingVertical: 30,
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
