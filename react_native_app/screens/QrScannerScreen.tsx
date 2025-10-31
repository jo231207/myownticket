import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'QrScanner'>;\n\nexport default function QrScannerScreen({ navigation }: Props) {\n  const [ScannerModule, setScannerModule] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const mod = require('expo-barcode-scanner');
      setScannerModule(mod);
    }
    requestPermission();
  }, []);

    const requestPermission = useCallback(async () => {
    try {
      setIsRequesting(true);
      if (Platform.OS === 'web') {
        setHasPermission(false);
      } else {
        const { status } = await (ScannerModule?.requestPermissionsAsync?.() ?? Promise.resolve({ status: 'denied' }));
        setHasPermission(status === 'granted');
      }
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const handleBarCodeScanned = useCallback(
    (result: any) => {\n      const data = result?.data ?? String(result ?? '');\n      setScannedData(data);\n    },\n    []\n  );

  const renderScannerBody = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.centerText}>ÁßªÎ?Ï∞??Ê≤ÖÎö∞Î∏???Î∫§Ïî§??çÌÄ???âÎº±?Î∂¥¬Ä?/Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.centerText}>ÁßªÎ?Ï∞???Î¨éÎ†ê Ê≤ÖÎö∞Î∏???Íæ©ÏäÇ??ÅÏäÇ.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Ê≤ÖÎö∞Î∏??Î∂øÍªå??çÎ¶∞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>???∏òÂ™õ¬ÄÊπ?/Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerWrapper}>
        {ScannerModule?.BarCodeScanner ? (\n          <ScannerModule.BarCodeScanner
          onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>QR ?ÑÎ∂æÎ±∂Áëú???Ïª????âÎøâ ÔßçÏöé?†‰∫å?±ÍΩ≠??/Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>??/Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR ?ÑÎ∂æÎ±???ºÌã™</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.body}>{renderScannerBody()}</View>

        {scannedData ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>??ºÌã™????ÅÏäú</Text>
            <Text style={styles.resultValue}>{scannedData}</Text>
            <View style={styles.resultButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setScannedData(null)}>
                <Text style={styles.primaryButtonText}>??ºÎñÜ ??ºÌã™??çÎ¶∞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('MyTicket')}
              >
                <Text style={styles.secondaryButtonText}>????ÜÏò£Ê≤?ËπÇÎãøÎ¶?/Text>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 22,
    color: '#f8fafc',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSpacer: {
    width: 22,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  scannerWrapper: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.85)',
  },
  overlayTitle: {
    color: '#f8fafc',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  centerBox: {
    alignItems: 'center',
  },
  centerText: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#f8fafc',
  },
  primaryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
  },
  primaryButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.8)',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#f8fafc',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 15,
    color: '#0f172a',
    lineHeight: 21,
  },
  resultButtons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  requestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});








