import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import Icon from "../Icons";

type ModalProps = {
  topPosition?: number;
  leftPosition?: number;
  rightPosition?: number;
  bottomPosition?: number;
  width?: number | string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  isDrawer?: boolean;
  isCentered?: boolean;
  hideBackdrop?: boolean;
  transparentBackdrop?: boolean;
  cardStyle?: object;
};

export interface ModalActionsProps {
  children: React.ReactNode;
  annotation?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Modal({
  topPosition,
  leftPosition,
  rightPosition,
  bottomPosition,
  width,
  children,
  isOpen,
  onClose,
  isDrawer = false,
  isCentered = false,
  hideBackdrop = false,
  transparentBackdrop = false,
  cardStyle,
}: ModalProps) {
  const pan = useRef(new Animated.Value(0)).current;

  // Optional: Swipe down to close for drawer modals
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      isDrawer && gestureState.dy > 10,
    onPanResponderMove: Animated.event([null, { dy: pan }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 150) {
        onClose?.();
      } else {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType={isDrawer ? "slide" : "fade"}
      onRequestClose={onClose}
    >
      {!hideBackdrop && (
        <TouchableOpacity
          style={[
            styles.backdrop,
            transparentBackdrop && { backgroundColor: "transparent" },
          ]}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[
          styles.modalCard,
          isCentered && styles.centered,
          isDrawer && {
            position: "absolute",
            bottom: 0,
            width: "100%",
            transform: [{ translateY: pan }],
          },
          topPosition !== undefined && { top: topPosition },
          leftPosition !== undefined && { left: leftPosition },
          rightPosition !== undefined && { right: rightPosition },
          bottomPosition !== undefined && { bottom: bottomPosition },
          width !== undefined && { width },
          cardStyle,
        ]}
        {...(isDrawer ? panResponder.panHandlers : {})}
      >
        {children}
      </Animated.View>
    </RNModal>
  );
}

export const ModalActions = ({ children, annotation, style }: ModalActionsProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.actionsRow}>
        {children}
      </View>
      {annotation && (
        <View style={styles.annotationRow}>
          <Icon name="Error" /* You may need to adjust color/size here */ />
          <Text style={styles.annotationText}>{annotation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  centered: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -Dimensions.get("window").width / 2 }, { translateY: -100 }],
  },
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24, // gap-y-24
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 10,
    marginBottom: 24, // gap-y-24
  },
  annotationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // If not supported, use marginRight on Icon or marginLeft on Text
  },
  annotationText: {
    color: "#6B7280", // Example muted color
    fontSize: 16,
    marginLeft: 8,
  },
});
