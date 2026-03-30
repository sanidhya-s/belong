import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { SECURITY_CONTACTS } from '../data/mockData';

const SOS_CONTACTS = [
  { label: 'Police', number: '100', icon: 'shield', color: '#1565C0' },
  { label: 'Ambulance', number: '108', icon: 'medkit', color: '#C62828' },
  { label: 'Fire', number: '101', icon: 'flame', color: '#E65100' },
  { label: 'Women Helpline', number: '1091', icon: 'woman', color: '#6A1B9A' },
];

const ContactCard = ({ contact }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`).catch(() =>
      Alert.alert('Unable to Call', 'Please dial ' + contact.phone + ' manually.')
    );
  };

  return (
    <View style={styles.contactCard}>
      <View style={[styles.contactIcon, { backgroundColor: contact.bgColor }]}>
        <Ionicons name={contact.icon} size={24} color={contact.color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.officerName}>{contact.officer}</Text>
        <View style={styles.shiftBadge}>
          <Ionicons name="time-outline" size={11} color={COLORS.textMuted} />
          <Text style={styles.shiftText}>{contact.shift}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
        <Ionicons name="call" size={18} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const SosButton = ({ item }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${item.number}`).catch(() =>
      Alert.alert('Call ' + item.number, 'Dialing ' + item.label + '...')
    );
  };

  return (
    <TouchableOpacity
      style={[styles.sosBtn, { backgroundColor: item.color + '15', borderColor: item.color + '40' }]}
      onPress={handleCall}
      activeOpacity={0.8}
    >
      <View style={[styles.sosIconWrap, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={18} color={COLORS.white} />
      </View>
      <Text style={[styles.sosLabel, { color: item.color }]}>{item.label}</Text>
      <Text style={[styles.sosNumber, { color: item.color }]}>{item.number}</Text>
    </TouchableOpacity>
  );
};

export default function SecurityScreen({ navigation }) {
  const [panicMode, setPanicMode] = useState(false);

  const handleSOS = () => {
    setPanicMode(true);
    Alert.alert(
      '🚨 SOS Alert Sent',
      'Emergency alert has been sent to all security personnel and society management.',
      [{ text: 'OK', onPress: () => setPanicMode(false) }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* SOS Panel */}
        <View style={styles.sosPanel}>
          <View style={styles.sosPanelHeader}>
            <Ionicons name="warning" size={20} color={COLORS.error} />
            <Text style={styles.sosPanelTitle}>Emergency SOS</Text>
          </View>
          <Text style={styles.sosPanelSub}>Press the button below to send an emergency alert to all security guards</Text>
          <TouchableOpacity
            style={[styles.sosPanicBtn, panicMode && styles.sosPanicBtnActive]}
            onPress={handleSOS}
            activeOpacity={0.85}
          >
            <Ionicons name="warning" size={28} color={COLORS.white} />
            <Text style={styles.sosPanicText}>{panicMode ? 'Alert Sent!' : 'SOS Emergency'}</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Numbers */}
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        <View style={styles.sosGrid}>
          {SOS_CONTACTS.map(item => (
            <SosButton key={item.label} item={item} />
          ))}
        </View>

        {/* Society Security */}
        <Text style={styles.sectionTitle}>Society Security</Text>
        {SECURITY_CONTACTS.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}

        {/* Safety Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={18} color={COLORS.warning} />
            <Text style={styles.tipsTitle}>Safety Tips</Text>
          </View>
          {[
            'Always verify visitor identity before allowing entry',
            'Report suspicious activity immediately to security',
            'Keep your emergency contacts updated in the app',
            'Use the visitor pre-approval feature for expected guests',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg },
  header: {
    backgroundColor: COLORS.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: SPACING.lg,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },

  sosPanel: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginTop: SPACING.lg, marginBottom: SPACING.md, ...SHADOW.sm,
    borderWidth: 1, borderColor: '#FFEBEE',
  },
  sosPanelHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sosPanelTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.error },
  sosPanelSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.md },
  sosPanicBtn: {
    backgroundColor: COLORS.error, borderRadius: RADIUS.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.md, gap: SPACING.sm,
  },
  sosPanicBtnActive: { backgroundColor: '#B71C1C' },
  sosPanicText: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: '700' },

  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginVertical: SPACING.md },

  sosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  sosBtn: {
    width: '47%', borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center', borderWidth: 1, gap: 6,
  },
  sosIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sosLabel: { fontSize: FONTS.sizes.sm, fontWeight: '700' },
  sosNumber: { fontSize: FONTS.sizes.xl, fontWeight: '700' },

  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  contactIcon: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  officerName: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  shiftBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  shiftText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  callBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.accentGreen, justifyContent: 'center', alignItems: 'center',
  },

  tipsCard: {
    backgroundColor: '#FFFBEB', borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginTop: SPACING.sm, borderWidth: 1, borderColor: '#FEF3C7',
  },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  tipsTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: 8 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warning, marginTop: 6 },
  tipText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
});
