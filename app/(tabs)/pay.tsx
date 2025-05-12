import { ThemedButton as Button } from '@/components/ui/ThemedButton';
import { ThemedText as Text } from '@/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, Modal, Platform, Animated as RNAnimated, StyleSheet, TouchableOpacity, View } from 'react-native';

const CARD_RADIUS = 36;
const baseCard = {
  borderRadius: CARD_RADIUS,
  alignItems: 'center' as const,
  shadowColor: '#7B61FF',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.22,
  shadowRadius: 32,
  borderWidth: 1.5,
  borderColor: 'rgba(123,97,255,0.18)',
};

function PayMainCard({ onInitiate }: { onInitiate: () => void }) {
  return (
    <BlurView intensity={120} tint={Platform.OS === 'ios' ? 'systemChromeMaterialDark' : 'dark'} style={[styles.glassCard, styles.glassCardEnhanced]}>
      <View style={styles.iconCircleEnhanced}>
        <Ionicons name="paper-plane" size={40} color="#fff" />
      </View>
      <Text type="title" style={styles.titleEnhanced}>Ready to Pay?</Text>
      <Text type="subtitle" style={styles.subtitleEnhanced}>Tap below to scan a payment QR code</Text>
      <Button
        title="Initiate Payment"
        onPress={onInitiate}
        style={styles.gradientButton}
        textStyle={styles.gradientButtonText}
      />
    </BlurView>
  );
}

function CameraModal({
  visible,
  onClose,
  permission,
  requestPermission,
  scanned,
  isLoading,
  handleBarCodeScanned,
  scanAgainAnim,
  scanLineAnim,
  showCheckmark,
  setScanned,
}: any) {
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.modalBackdrop, { borderRadius: CARD_RADIUS }]}> 
        <Animated.View style={[styles.animatedCard, { transform: [{ scale: 1 }], opacity: 1, borderRadius: CARD_RADIUS }]}> 
          <BlurView intensity={90} tint={Platform.OS === 'ios' ? 'systemChromeMaterial' : 'light'} style={[styles.cameraCard, { borderRadius: CARD_RADIUS }]}> 
            <LinearGradient
              colors={["rgba(255,255,255,0.10)", "rgba(123,97,255,0.10)"]}
              style={[StyleSheet.absoluteFill, { borderRadius: CARD_RADIUS }]}
              pointerEvents="none"
            />
            {!permission && <Text style={styles.centerText}>Requesting permission…</Text>}
            {permission && !permission.granted && (
              <View style={[styles.centeredContent, { borderRadius: CARD_RADIUS }]}> 
                <Text style={styles.centerText}>Camera access denied</Text>
                <Button title="Close" onPress={onClose} />
              </View>
            )}
            {permission?.granted && (
              <>
                <View style={[styles.cameraContainerOuter, { borderRadius: CARD_RADIUS }]}> 
                  <View style={[styles.cameraViewWrapper, { borderRadius: 28 }]}> 
                    <CameraView
                      style={[styles.cameraView, { borderRadius: 28 }]}
                      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    />
                    {/* Animated scan line */}
                    {!scanned && (
                      <RNAnimated.View
                        style={[
                          styles.scanLine,
                          {
                            transform: [
                              {
                                translateY: scanLineAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 200],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    )}
                    {/* Checkmark animation */}
                    {showCheckmark && (
                      <RNAnimated.View style={styles.checkmarkContainer}>
                        <Ionicons name="checkmark-circle" size={80} color="#7B61FF" style={{ opacity: 0.9 }} />
                      </RNAnimated.View>
                    )}
                    {/* Loading overlay */}
                    {isLoading && (
                      <BlurView intensity={60} tint="dark" style={[styles.loadingOverlay, { borderRadius: 28 }]}> 
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Preparing payment...</Text>
                      </BlurView>
                    )}
                    {/* Scan again button */}
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
                    onPress={onClose}
                  />
                </View>
              </>
            )}
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function PayScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const router = useRouter();

  // Animation for modal/card
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Add state for scan line animation and checkmark
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [showCheckmark, setShowCheckmark] = useState(false);

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

  // Animate scan line when camera is shown
  useEffect(() => {
    if (showCamera && permission?.granted && !scanned) {
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showCamera, permission, scanned, scanLineAnim]);

  // Show checkmark animation on scan
  useEffect(() => {
    if (scanned && !isLoading) {
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), 1200);
    }
  }, [scanned, isLoading]);

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

  if (!showCamera) {
    return (
      <View style={styles.outerContainer}>
        <LinearGradient
          colors={["#23243a", "#1a1b2e", "#2d1e4f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill]}
        />
        <PayMainCard onInitiate={() => setShowCamera(true)} />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={["#23243a", "#1a1b2e", "#2d1e4f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: CARD_RADIUS }]}
      />
      <CameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        permission={permission}
        requestPermission={requestPermission}
        scanned={scanned}
        isLoading={isLoading}
        handleBarCodeScanned={handleBarCodeScanned}
        scanAgainAnim={scanAgainAnim}
        scanLineAnim={scanLineAnim}
        showCheckmark={showCheckmark}
        setScanned={setScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CARD_RADIUS,
  },
  glassCard: {
    ...baseCard,
    width: '88%',
    maxWidth: 440,
    padding: 36,
    marginTop: 12,
  },
  glassCardEnhanced: {
    borderWidth: 1.5,
    borderColor: 'rgba(123,97,255,0.22)',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 36,
    backgroundColor: 'rgba(36,34,64,0.65)',
    overflow: 'visible',
  },
  bgIcon: {
    position: 'absolute',
    top: -18,
    right: 0,
    opacity: 0.18,
    zIndex: 0,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(123,97,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconCircleEnhanced: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(123,97,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  title: {
    paddingTop: 14,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  titleEnhanced: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '500',
  },
  subtitleEnhanced: {
    fontSize: 20,
    color: '#B0BEC5',
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CARD_RADIUS,
  },
  cameraCard: {
    ...baseCard,
    width: '92%',
    maxWidth: 440,
    padding: 24,
    overflow: 'visible',
  },
  cameraContainerOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderRadius: CARD_RADIUS,
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
  },
  cameraView: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  cameraViewWrapper: {
    width: 320,
    height: 240,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CARD_RADIUS,
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
    borderRadius: CARD_RADIUS,
  },
  closeButton: {
    marginTop: 18,
    alignSelf: 'center',
    width: 140,
  },
  gradientButton: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 36,
    backgroundColor: 'transparent',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    marginTop: 18,
    overflow: 'hidden',
  },
  gradientButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#fff',
  },
  cameraGlowPulse: {
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#7B61FF',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    backgroundColor: 'rgba(123,97,255,0.35)',
    borderRadius: 1,
    width: '100%',
    alignSelf: 'center',
    zIndex: 10,
    opacity: 0.65,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 20,
    opacity: 0.95,
  },
});
