import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';

const PRIMARY_BLUE = '#2563eb';

const Row: React.FC<{ icon: string; label: string; hasInfo?: boolean; onPress?: () => void }>= ({ icon, label, hasInfo, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={{ flex: 1 }} />
      {hasInfo ? <Text style={styles.infoIcon}>i</Text> : null}
      <Text style={styles.plusIcon}>＋</Text>
    </TouchableOpacity>
  );
};

const BeforeMakeOfferScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (Platform.OS === 'web') {
        const { width } = Dimensions.get('window');
        setIsMobileView(width <= 768);
      } else {
        setIsMobileView(true);
      }
    };
    checkScreenSize();
    if (Platform.OS === 'web') {
      const subscription = Dimensions.addEventListener('change', checkScreenSize);
      return () => subscription?.remove();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.illustration}>
          <Text style={styles.giftBox}>🎁</Text>
        </View>
        <Text style={styles.title}>Before you make an offer</Text>
        <Text style={styles.subtitle}>
          Help us keep Extrahand safe and fun, and fill in a few details.
        </Text>

        <View style={styles.rows}>
          <Row icon="👤" label="Upload a profile picture" />
          <Row icon="📅" label="Add your date of birth" />
          <Row icon="📞" label="Verify your mobile" />
          <Row icon="💳" label="Link your bank account" hasInfo />
          <Row icon="📍" label="Add your billing address" />
        </View>
      </View>

      <View style={[styles.footer, !isMobileView && { maxWidth: 420, alignSelf: 'center' }]}>
        <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  closeText: { fontSize: 24, color: '#6b7280' },
  content: { paddingHorizontal: 24 },
  illustration: { alignItems: 'center', marginTop: 10, marginBottom: 12 },
  giftBox: { fontSize: 60 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', textAlign: 'left', marginTop: 8 },
  subtitle: { fontSize: 15, color: '#6b7280', marginTop: 8, lineHeight: 22 },
  rows: { marginTop: 24, gap: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  rowIcon: { fontSize: 18, marginRight: 12 },
  rowLabel: { fontSize: 16, color: '#111827', fontWeight: '500' },
  plusIcon: { fontSize: 24, color: PRIMARY_BLUE, marginLeft: 10 },
  infoIcon: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  footer: { paddingHorizontal: 24, paddingVertical: 16 },
  continueBtn: {
    backgroundColor: '#e5edff',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  continueText: { color: PRIMARY_BLUE, fontSize: 18, fontWeight: '700' },
});

export default BeforeMakeOfferScreen;
