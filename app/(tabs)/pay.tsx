import { ThemedButton as Button } from '@/components/ui/ThemedButton';
import { ThemedText as Text } from '@/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PayScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const router = useRouter();

  // Animation for modal/card
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showCamera) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [showCamera, opacityAnim, scaleAnim]);

  // Animation for scan again button
  const scanAgainAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (scanned && !isLoading) {
      Animated.timing(scanAgainAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }).start();
    } else {
      scanAgainAnim.setValue(0);
    }
  }, [scanned, isLoading, scanAgainAnim]);

  useEffect(() => {
    if (showCamera && !permission?.granted) {
      requestPermission();
    }
  }, [showCamera, permission, requestPermission]);

  const handleBarCodeScanned = (barcode: { data: string }) => {
    setScanned(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Send Payment?', `Send to:\n${barcode.data}`, [
        { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            setShowCamera(false);
            router.push({ pathname: '/transactions', params: { recipient: barcode.data } });
          },
        },
      ]);
    }, 800);
  };

  // Show the button by default
  if (!showCamera) {
    return (
      <View style={styles.outerContainer}>
        <LinearGradient
          colors={["#23243a", "#1a1b2e", "#2d1e4f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <BlurView intensity={90} tint={Platform.OS === 'ios' ? 'systemChromeMaterial' : 'light'} style={styles.glassCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="paper-plane" size={36} color="#7B61FF" />
          </View>
          <Text style={styles.title}>Ready to Pay?</Text>
          <Text style={styles.subtitle}>Tap below to scan a payment QR code</Text>
          <Button
            title="Initiate Payment"
            onPress={() => setShowCamera(true)}
          />
        </BlurView>
      </View>
    );
  }

  // Camera modal
  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={["#23243a", "#1a1b2e", "#2d1e4f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Modal
        visible={showCamera}
        animationType="none"
        transparent
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.animatedCard, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}> 
            <BlurView intensity={90} tint={Platform.OS === 'ios' ? 'systemChromeMaterial' : 'light'} style={styles.cameraCard}>
              <LinearGradient
                colors={["rgba(255,255,255,0.10)", "rgba(123,97,255,0.10)"]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              {!permission && <Text style={styles.centerText}>Requesting permission…</Text>}
              {permission && !permission.granted && (
                <View style={styles.centeredContent}>
                  <Text style={styles.centerText}>Camera access denied</Text>
                  <Button title="Close" onPress={() => setShowCamera(false)} />
                </View>
              )}
              {permission?.granted && (
                <>
                  <View style={styles.cameraContainerOuter}>
                    <LinearGradient
                      colors={["#7B61FF", "#23243a"]}
                      style={styles.cameraGlow}
                      start={{ x: 0.2, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <View style={styles.cameraContainer}>
                      <CameraView
                        style={styles.cameraView}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                      />
                      {isLoading && (
                        <BlurView intensity={60} tint="dark" style={styles.loadingOverlay}>
                          <ActivityIndicator size="large" color="#fff" />
                          <Text style={styles.loadingText}>Preparing payment...</Text>
                        </BlurView>
                      )}
                      <Animated.View style={{
                        opacity: scanAgainAnim,
                        transform: [{ translateY: scanAgainAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        position: 'absolute',
                        bottom: 18,
                        alignSelf: 'center',
                        width: '100%',
                        alignItems: 'center',
                      }}>
                        {scanned && !isLoading && (
                          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
                            <Text style={styles.buttonText}>Scan Again</Text>
                          </TouchableOpacity>
                        )}
                      </Animated.View>
                    </View>
                  </View>
                  <View style={styles.closeButton}>
                    <Button
                      title="Close"
                      onPress={() => setShowCamera(false)}
                    />
                  </View>
                </>
              )}
            </BlurView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  glassCard: {
    width: '88%',
    padding: 36,
    borderRadius: 36,
    alignItems: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1.5,
    borderColor: 'rgba(123,97,255,0.18)',
    marginTop: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(123,97,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  title: {
    paddingTop: 12,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCard: {
    width: '92%',
    maxWidth: 440,
    padding: 24,
    borderRadius: 36,
    alignItems: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1.5,
    borderColor: 'rgba(123,97,255,0.18)',
    overflow: 'visible',
  },
  cameraContainerOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cameraGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 32,
    zIndex: 0,
    opacity: 0.45,
  },
  cameraContainer: {
    width: 320,
    height: 240,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#23243a',
    zIndex: 1,
  },
  cameraView: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,30,40,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    zIndex: 2,
  },
  loadingText: {
    marginTop: 12,
    
    fontSize: 16,
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: 'rgba(123,97,255,0.85)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  buttonText: {
    
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  centerText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
   
    fontWeight: '600',
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  closeButton: {
    marginTop: 18,
    alignSelf: 'center',
    width: 140,
  },
});
