import React, { useState } from "react";
import { GestureResponderEvent, Modal, Pressable, StyleSheet, Text, View } from "react-native";

/* -------------------------------------------------------------------------------------------------
 * This is a basic tooltip created for the chart demos. Customize as needed or bring your own solution.
 * -----------------------------------------------------------------------------------------------*/

type TooltipContextType = {
  tooltip: { x: number; y: number } | undefined;
  setTooltip: React.Dispatch<React.SetStateAction<{ x: number; y: number } | undefined>>;
};

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined);

export const ClientTooltip = ({ children }: React.PropsWithChildren<object>) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | undefined>();
  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = ({ children }: React.PropsWithChildren<object>) => {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error("TooltipContext not found");
  const { setTooltip } = context;

  const handlePressIn = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setTooltip({ x: pageX, y: pageY });
  };

  const handlePressOut = () => {
    setTooltip(undefined);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {children}
    </Pressable>
  );
};

export const TooltipContent = ({ children }: React.PropsWithChildren<object>) => {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error("TooltipContext not found");
  const { tooltip } = context;

  if (!tooltip) return null;

  return (
    <Modal transparent visible>
      <View style={[styles.tooltip, { top: tooltip.y, left: tooltip.x }]}>
        <Text>{children}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1000,
  },
});

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/

