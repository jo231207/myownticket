import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, Camera } from 'expo-camera';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'QrScanner'>;

export default function QrScannerScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      setIsRequesting(true);
      if (Platform.OS === 'web') {
        setHasPermission(false);
        return;
      }
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleBarCodeScanned = useCallback((result: any) => {
    const data = result?.data ?? String(result ?? '');
    setScannedData(data);
  }, []);

  const renderScannerBody = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.centerText}>Requesting camera permission…</Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.centerText}>Camera permission is required.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerWrapper}>
        <CameraView
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Align the QR code within the frame</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Scan</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.body}>{renderScannerBody()}</View>

        {scannedData ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Scanned Data</Text>
            <Text style={styles.resultValue}>{scannedData}</Text>
            <View style={styles.resultButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setScannedData(null)}>
                <Text style={styles.primaryButtonText}>Scan Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('MyTicket')}>
                <Text style={styles.secondaryButtonText}>Go to My Tickets</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {isRequesting ? (
          <View style={styles.requestOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
  },
  backText: {
    color: '#93c5fd',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: { width: 40 },
  body: { flex: 1 },
  scannerWrapper: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayTitle: { color: '#fff', textAlign: 'center' },

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerText: { color: '#e5e7eb', marginTop: 12 },

  resultCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  resultLabel: { color: '#9ca3af', marginBottom: 8 },
  resultValue: { color: '#fff', marginBottom: 12 },
  resultButtons: { flexDirection: 'row', gap: 12 },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: { color: '#fff', fontWeight: '600' },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#93c5fd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  secondaryButtonText: { color: '#93c5fd', fontWeight: '600' },

  requestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

