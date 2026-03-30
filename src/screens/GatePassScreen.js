import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, TextInput, Alert,
  Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';

const { width } = Dimensions.get('window');

// Fake QR-like grid art (pure RN, no library needed)
function FakeQR({ value, color = COLORS.primary, size = 180 }) {
  // deterministic "hash" from string → grid pattern
  const cells = 11;
  const cellSize = size / cells;
  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
    return h;
  };
  const seed = hash(value);
  const grid = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      // corners always filled (finder pattern)
      const inCorner =
        (r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3);
      const filled = inCorner || !!((seed >> ((r * cells + c) % 24)) & 1);
      grid.push({ r, c, filled });
    }
  }
  return (
    <View style={{ width: size, height: size, backgroundColor: COLORS.white, padding: 8, borderRadius: 12 }}>
      {grid.map(({ r, c, filled }) =>
        filled ? (
          <View
            key={`${r}-${c}`}
            style={{
              position: 'absolute',
              top: 8 + r * cellSize,
              left: 8 + c * cellSize,
              width: cellSize - 1,
              height: cellSize - 1,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        ) : null
      )}
    </View>
  );
}

const PURPOSES = ['Personal Visit', 'Delivery', 'Plumber / Electrician', 'Driver', 'Domestic Help', 'Other'];

function GatePassCard({ pass, onShare }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pass.status === 'active') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, []);

  const isActive = pass.status === 'active';
  const isExpired = pass.status === 'expired';

  return (
    <View style={[styles.passCard, isExpired && styles.passCardExpired]}>
      {/* Header strip */}
      <View style={[styles.passHeader, { backgroundColor: isActive ? COLORS.primary : isExpired ? COLORS.textMuted : COLORS.accentBlue }]}>
        <View>
          <Text style={styles.passHeaderLabel}>DIGITAL GATE PASS</Text>
          <Text style={styles.passHeaderSociety}>Green Valley Residency</Text>
        </View>
        <View style={[styles.passStatusBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          <View style={[styles.passStatusDot, { backgroundColor: isActive ? COLORS.accentGreen : isExpired ? COLORS.error : COLORS.warning }]} />
          <Text style={styles.passStatusText}>{isActive ? 'Active' : isExpired ? 'Expired' : 'Pending'}</Text>
        </View>
      </View>

      {/* QR area */}
      <View style={styles.qrArea}>
        <Animated.View style={isActive ? { transform: [{ scale: pulse }] } : {}}>
          <FakeQR value={pass.id + pass.visitorName} color={isExpired ? COLORS.textMuted : COLORS.primary} />
        </Animated.View>
        <Text style={styles.passCode}>{pass.code}</Text>
        <Text style={styles.passCodeHint}>Show to security at gate</Text>
      </View>

      {/* Visitor info */}
      <View style={styles.passInfo}>
        {[
          { label: 'Visitor', value: pass.visitorName, icon: 'person' },
          { label: 'Purpose', value: pass.purpose, icon: 'clipboard' },
          { label: 'Host Flat', value: pass.flat, icon: 'home' },
          { label: 'Valid Till', value: pass.validTill, icon: 'time' },
        ].map((row, i) => (
          <View key={i} style={[styles.passInfoRow, i < 3 && styles.passInfoDivider]}>
            <Ionicons name={`${row.icon}-outline`} size={14} color={COLORS.textMuted} />
            <Text style={styles.passInfoLabel}>{row.label}</Text>
            <Text style={styles.passInfoValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.passActions}>
        <TouchableOpacity style={styles.passActionBtn} onPress={() => onShare(pass)}>
          <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
          <Text style={styles.passActionText}>Share</Text>
        </TouchableOpacity>
        <View style={styles.passActionDivider} />
        <TouchableOpacity style={styles.passActionBtn} onPress={() => Alert.alert('Downloaded', 'Gate pass saved to gallery.')}>
          <Ionicons name="download-outline" size={18} color={COLORS.primary} />
          <Text style={styles.passActionText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GatePassScreen({ navigation }) {
  const [passes, setPasses] = useState([
    {
      id: 'gp1',
      code: 'GVR-2025-8842',
      visitorName: 'Priya Mehta',
      purpose: 'Personal Visit',
      flat: 'B-304',
      validTill: 'Today, 11:59 PM',
      status: 'active',
    },
    {
      id: 'gp2',
      code: 'GVR-2025-7761',
      visitorName: 'Quick Commerce Delivery',
      purpose: 'Delivery',
      flat: 'B-304',
      validTill: 'Today, 8:00 PM',
      status: 'expired',
    },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', purpose: 'Personal Visit', validHours: '4' });

  const handleCreate = () => {
    if (!form.name) { Alert.alert('Name Required', 'Please enter visitor name.'); return; }
    const now = new Date();
    now.setHours(now.getHours() + parseInt(form.validHours));
    const validTill = `Today, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const code = `GVR-2025-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newPass = {
      id: `gp${Date.now()}`,
      code,
      visitorName: form.name,
      purpose: form.purpose,
      flat: 'B-304',
      validTill,
      status: 'active',
    };
    setPasses(prev => [newPass, ...prev]);
    setForm({ name: '', purpose: 'Personal Visit', validHours: '4' });
    setShowCreate(false);
    Alert.alert('Gate Pass Created!', `Share code ${code} with your visitor.`);
  };

  const handleShare = (pass) => {
    Alert.alert(
      'Share Gate Pass',
      `Share this code with ${pass.visitorName}:\n\n${pass.code}\n\nValid till: ${pass.validTill}`,
      [{ text: 'Copy Code' }, { text: 'Send via WhatsApp' }, { text: 'Done' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gate Pass</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreate(true)}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.createBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBar}>
          <Ionicons name="qr-code" size={16} color={COLORS.primary} />
          <Text style={styles.infoText}>Generate a QR gate pass for your visitors. Show it at the entrance.</Text>
        </View>

        {passes.map(pass => (
          <GatePassCard key={pass.id} pass={pass} onShare={handleShare} />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Create Pass Modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Create Gate Pass</Text>
            <Text style={styles.modalSub}>Your visitor will receive a QR code to show at the gate</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Visitor Name *"
                placeholderTextColor={COLORS.textMuted}
                value={form.name}
                onChangeText={t => setForm(p => ({ ...p, name: t }))}
              />
            </View>

            <Text style={styles.fieldLabel}>Purpose of Visit</Text>
            <View style={styles.purposeGrid}>
              {PURPOSES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.purposeChip, form.purpose === p && styles.purposeChipActive]}
                  onPress={() => setForm(prev => ({ ...prev, purpose: p }))}
                >
                  <Text style={[styles.purposeChipText, form.purpose === p && styles.purposeChipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Valid For</Text>
            <View style={styles.hoursRow}>
              {['1', '2', '4', '8', '24'].map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.hourBtn, form.validHours === h && styles.hourBtnActive]}
                  onPress={() => setForm(p => ({ ...p, validHours: h }))}
                >
                  <Text style={[styles.hourBtnText, form.validHours === h && styles.hourBtnTextActive]}>
                    {h}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreate(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                <Ionicons name="qr-code" size={16} color={COLORS.white} />
                <Text style={styles.submitText}>Generate Pass</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  header: {
    backgroundColor: COLORS.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: SPACING.lg,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md, paddingVertical: 8,
  },
  createBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },

  infoBar: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
    backgroundColor: '#F0EEFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md,
  },
  infoText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.primary, lineHeight: 18 },

  passCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl, marginBottom: SPACING.lg,
    overflow: 'hidden', ...SHADOW.lg,
  },
  passCardExpired: { opacity: 0.7 },
  passHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  passHeaderLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  passHeaderSociety: { color: COLORS.white, fontSize: FONTS.sizes.md, fontWeight: '700', marginTop: 2 },
  passStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 6,
  },
  passStatusDot: { width: 8, height: 8, borderRadius: 4 },
  passStatusText: { color: COLORS.white, fontSize: FONTS.sizes.xs, fontWeight: '700' },

  qrArea: { alignItems: 'center', paddingVertical: SPACING.lg, backgroundColor: COLORS.background },
  passCode: { marginTop: SPACING.md, fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 2 },
  passCodeHint: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 4 },

  passInfo: { paddingHorizontal: SPACING.lg },
  passInfoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: SPACING.sm },
  passInfoDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  passInfoLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, width: 70 },
  passInfoValue: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'right' },

  passActions: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border,
    margin: 0,
  },
  passActionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: SPACING.md,
  },
  passActionDivider: { width: 1, backgroundColor: COLORS.border },
  passActionText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.sm },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.lg, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg,
  },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  modalSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, marginBottom: SPACING.md,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, height: 48, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  purposeChip: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 7, backgroundColor: COLORS.white,
  },
  purposeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  purposeChipText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  purposeChipTextActive: { color: COLORS.white },
  hoursRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  hourBtn: {
    flex: 1, paddingVertical: 10, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center',
  },
  hourBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  hourBtnText: { fontWeight: '700', color: COLORS.textSecondary },
  hourBtnTextActive: { color: COLORS.white },
  modalActions: { flexDirection: 'row', gap: SPACING.sm },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  submitBtn: {
    flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 8,
  },
  submitText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
});
