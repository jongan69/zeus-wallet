import { ThemedText as Text } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";

export default function ConnectedView() {
  const { theme } = useTheme();
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(0.85)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconScale, { toValue: 1.08, duration: 220, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(iconOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]),
      Animated.spring(iconScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
    ]).start();
  }, [iconScale, iconOpacity]);
  const gradientColors = theme === "light" ? ["#f8fafc", "#e0e7ff"] : ["#181A20", "#232946"];
  return (
    <View style={[styles.outer, { backgroundColor: gradientColors[0] }]}> 
      <View style={[styles.card, { backgroundColor: theme === "light" ? "#fff" : "#181A20", borderColor: theme === "light" ? "#ececf2" : "#232946", shadowColor: theme === "light" ? "#4ade80" : "#232946" }]}> 
        <Image source={require("@/assets/images/zeus-logo.png")} style={styles.logo} resizeMode="contain" />
        <View style={styles.rowContainer}>
          <Animated.View style={[styles.celebrateIconContainer, { transform: [{ scale: iconScale }], opacity: iconOpacity }]}> 
            <Ionicons name="checkmark-circle" size={22} color="#4ade80" />
          </Animated.View>
          <View style={styles.readyTextContainer}>
            <Text style={styles.readyTitle} lightColor="#181A20" darkColor="#fff">Connection Complete</Text>
            <Text style={styles.readySubtitle}>You are <Text style={styles.readyHighlight}>ready to claim</Text> your tBTC below</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    marginBottom: 22,
    borderWidth: 0,
    shadowColor: "#4ade80",
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  card: {
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ececf2",
    shadowColor: "#4ade80",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  },
  logo: {
    width: 68,
    height: 26,
    marginBottom: 0,
    alignSelf: "center",
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 2,
    paddingVertical: 4,
  },
  celebrateIconContainer: {
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6f9f0",
    borderRadius: 24,
    padding: 8,
    shadowColor: "#4ade80",
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  readyTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 8,
  },
  readyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#181A20",
    letterSpacing: 0.05,
    marginBottom: 4,
    lineHeight: 22,
  },
  readySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    paddingBottom: 22,
    fontWeight: "500",
    lineHeight: 18,
  },
  readyHighlight: {
    color: "#546CF1",
    fontWeight: "600",
    fontSize: 13,
  },
});