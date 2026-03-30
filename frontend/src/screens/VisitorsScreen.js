import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { VISITORS } from '../data/mockData';
import { createVisitor, fetchVisitors, setVisitorStatus } from '../api/visitors';

const statusConfig = {
  approved: { label: 'Approved', color: COLORS.accentGreen, bg: '#EAFAF1', icon: 'checkmark-circle' },
  pending: { label: 'Pending', color: COLORS.warning, bg: '#FFFBEB', icon: 'time' },
  denied: { label: 'Denied', color: COLORS.error, bg: '#FEF2F2', icon: 'close-circle' },
};

const VisitorCard = ({ visitor, onApprove, onDeny }) => {
  const status = statusConfig[visitor.status];
  return (
    <View style={styles.visitorCard}>
      <View style={[styles.avatar, { backgroundColor: visitor.avatarColor }]}>
        <Text style={styles.avatarText}>{visitor.avatar}</Text>
      </View>
      <View style={styles.visitorInfo}>
        <View style={styles.visitorRow}>
          <Text style={styles.visitorName}>{visitor.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.visitorPurpose}>{visitor.purpose}</Text>
        <View style={styles.visitorMeta}>
          <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{visitor.date} · {visitor.time}</Text>
          {visitor.vehicle && (
            <>
              <Ionicons name="car-outline" size={12} color={COLORS.textMuted} style={{ marginLeft: 8 }} />
              <Text style={styles.metaText}>{visitor.vehicle}</Text>
            </>
          )}
        </View>
        {visitor.status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.approveBtn} onPress={() => onApprove(visitor.id)}>
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.denyBtn} onPress={() => onDeny(visitor.id)}>
              <Ionicons name="close" size={14} color={COLORS.error} />
              <Text style={styles.denyBtnText}>Deny</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default function VisitorsScreen({ navigation }) {
  const [visitors, setVisitors] = useState(VISITORS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', purpose: '', vehicle: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const tabs = ['all', 'pending', 'approved', 'denied'];

  const filtered = activeTab === 'all' ? visitors : visitors.filter(v => v.status === activeTab);

  useEffect(() => {
    let mounted = true;
    const loadVisitors = async () => {
      try {
        const data = await fetchVisitors();
        if (mounted && data.length > 0) {
          setVisitors(data);
        }
      } catch (error) {
        // Keep UX working with fallback mock data when backend is down.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadVisitors();
    return () => {
      mounted = false;
    };
  }, []);

  const handleApprove = async (id) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    try {
      const updated = await setVisitorStatus(id, 'approved');
      setVisitors(prev => prev.map(v => v.id === id ? updated : v));
    } catch (error) {
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'pending' } : v));
      Alert.alert('Sync Failed', 'Could not approve visitor on backend.');
    }
  };

  const handleDeny = async (id) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'denied' } : v));
    try {
      const updated = await setVisitorStatus(id, 'denied');
      setVisitors(prev => prev.map(v => v.id === id ? updated : v));
    } catch (error) {
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'pending' } : v));
      Alert.alert('Sync Failed', 'Could not deny visitor on backend.');
    }
  };

  const handleAddVisitor = async () => {
    if (!form.name || !form.phone) {
      Alert.alert('Missing Info', 'Please enter visitor name and phone number.');
      return;
    }
    const optimisticVisitor = {
      id: `local-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      purpose: form.purpose || 'Personal Visit',
      vehicle: form.vehicle || null,
      status: 'pending',
      date: 'Today',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      avatar: form.name.charAt(0).toUpperCase(),
      avatarColor: COLORS.primary,
    };
    setVisitors(prev => [optimisticVisitor, ...prev]);
    setForm({ name: '', phone: '', purpose: '', vehicle: '' });
    setShowAddModal(false);

    setIsSyncing(true);
    try {
      const created = await createVisitor(form);
      setVisitors(prev => prev.map(v => v.id === optimisticVisitor.id ? { ...created, phone: form.phone, vehicle: form.vehicle || null } : v));
      Alert.alert('Visitor Added', 'Your visitor has been notified and is awaiting approval.');
    } catch (error) {
      Alert.alert('Saved Locally', 'Backend was not reachable, but visitor is saved in app state.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Visitors</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {['all', 'pending', 'approved', 'denied'].map(s => (
          <View key={s} style={styles.statBox}>
            <Text style={[styles.statNum, { color: s === 'pending' ? COLORS.warning : s === 'approved' ? COLORS.accentGreen : s === 'denied' ? COLORS.error : COLORS.primary }]}>
              {s === 'all' ? visitors.length : visitors.filter(v => v.status === s).length}
            </Text>
            <Text style={styles.statLbl}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {(loading || isSyncing) && (
          <View style={styles.syncBanner}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.syncText}>{loading ? 'Loading visitors from backend...' : 'Syncing changes...'}</Text>
          </View>
        )}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No visitors found</Text>
          </View>
        ) : (
          filtered.map(v => (
            <VisitorCard key={v.id} visitor={v} onApprove={handleApprove} onDeny={handleDeny} />
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Visitor Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add Visitor</Text>

            {[
              { placeholder: 'Visitor Name *', key: 'name', icon: 'person-outline' },
              { placeholder: 'Phone Number *', key: 'phone', icon: 'call-outline', keyboardType: 'phone-pad' },
              { placeholder: 'Purpose of Visit', key: 'purpose', icon: 'clipboard-outline' },
              { placeholder: 'Vehicle Number (optional)', key: 'vehicle', icon: 'car-outline' },
            ].map(field => (
              <View key={field.key} style={styles.inputRow}>
                <Ionicons name={field.icon} size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.textMuted}
                  value={form[field.key]}
                  onChangeText={t => setForm(prev => ({ ...prev, [field.key]: t }))}
                  keyboardType={field.keyboardType}
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddVisitor}>
                <Text style={styles.submitText}>Add Visitor</Text>
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
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md, marginTop: -16,
    ...SHADOW.md,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xxl, fontWeight: '700' },
  statLbl: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg, marginTop: SPACING.md,
    borderRadius: RADIUS.full, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: RADIUS.full },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },

  visitorCard: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  avatarText: { color: COLORS.white, fontSize: FONTS.sizes.xl, fontWeight: '700' },
  visitorInfo: { flex: 1 },
  visitorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  visitorName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  visitorPurpose: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 4 },
  visitorMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.accentGreen, borderRadius: RADIUS.full, paddingVertical: 8, gap: 4,
  },
  approveBtnText: { color: COLORS.white, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  denyBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEF2F2', borderRadius: RADIUS.full, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.error, gap: 4,
  },
  denyBtnText: { color: COLORS.error, fontSize: FONTS.sizes.sm, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.lg, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg,
  },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, height: 48, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  submitBtn: {
    flex: 2, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center',
  },
  submitText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  syncText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
});
