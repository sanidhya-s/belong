import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { TICKETS } from '../data/mockData';
import { createTicket, fetchTickets } from '../api/tickets';

const statusConfig = {
  open: { label: 'Open', color: COLORS.accentBlue, bg: '#EFF6FF', icon: 'radio-button-on' },
  in_progress: { label: 'In Progress', color: COLORS.warning, bg: '#FFFBEB', icon: 'reload-circle' },
  resolved: { label: 'Resolved', color: COLORS.accentGreen, bg: '#EAFAF1', icon: 'checkmark-circle' },
};

const priorityConfig = {
  high: { label: 'High', color: COLORS.error },
  medium: { label: 'Medium', color: COLORS.warning },
  low: { label: 'Low', color: COLORS.accentGreen },
};

const CATEGORIES = ['Plumbing', 'Electrical', 'Maintenance', 'Security', 'Cleanliness', 'Parking', 'Other'];

const TicketCard = ({ ticket, onPress }) => {
  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];

  return (
    <TouchableOpacity style={styles.ticketCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.ticketTop}>
        <View style={styles.ticketMeta}>
          <View style={[styles.categoryBadge]}>
            <Text style={styles.categoryText}>{ticket.category}</Text>
          </View>
          <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
          <Text style={[styles.priorityText, { color: priority.color }]}>{priority.label}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icon} size={12} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
      <Text style={styles.ticketTitle}>{ticket.title}</Text>
      <Text style={styles.ticketDesc} numberOfLines={2}>{ticket.description}</Text>
      <View style={styles.ticketFooter}>
        <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
        <Text style={styles.ticketDate}>{ticket.date}</Text>
        <View style={styles.updatesBadge}>
          <Text style={styles.updatesText}>{ticket.updates.length} updates</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SupportScreen({ navigation }) {
  const [tickets, setTickets] = useState(TICKETS);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', category: 'Plumbing', priority: 'medium' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadTickets = async () => {
      try {
        const data = await fetchTickets();
        if (mounted && data.length > 0) {
          setTickets(data);
        }
      } catch (error) {
        // fallback to local tickets
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTickets();
    return () => {
      mounted = false;
    };
  }, []);

  const tabs = ['all', 'open', 'in_progress', 'resolved'];
  const filtered = activeTab === 'all' ? tickets : tickets.filter(t => t.status === activeTab);

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      Alert.alert('Missing Info', 'Please fill in title and description.');
      return;
    }
    const localTicket = {
      id: `local-${Date.now()}`,
      title: form.title,
      category: form.category,
      status: 'open',
      priority: form.priority,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: form.description,
      updates: ['Ticket raised'],
    };
    setTickets(prev => [localTicket, ...prev]);
    setForm({ title: '', description: '', category: 'Plumbing', priority: 'medium' });
    setShowModal(false);
    try {
      const created = await createTicket(form);
      setTickets(prev => prev.map(t => t.id === localTicket.id ? created : t));
      Alert.alert('Ticket Raised! ✅', 'Your grievance has been submitted. We will look into this shortly.');
    } catch (error) {
      Alert.alert('Saved Locally', 'Backend not reachable. Ticket is still available in app state.');
    }
  };

  const tabLabels = { all: 'All', open: 'Open', in_progress: 'In Progress', resolved: 'Resolved' };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', count: tickets.length, color: COLORS.primary },
          { label: 'Open', count: tickets.filter(t => t.status === 'open').length, color: COLORS.accentBlue },
          { label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length, color: COLORS.warning },
          { label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length, color: COLORS.accentGreen },
        ].map((s, i) => (
          <View key={i} style={[styles.statBox, i < 3 && styles.statDivider]}>
            <Text style={[styles.statNum, { color: s.color }]}>{s.count}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.tabScroll} contentContainerStyle={styles.tabContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tabLabels[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading tickets...</Text>
          </View>
        )}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="construct-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>No tickets found</Text>
          </View>
        ) : (
          filtered.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPress={() => setSelectedTicket(ticket)}
            />
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* New Ticket Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Raise a Ticket</Text>

            <TextInput
              style={styles.inputField}
              placeholder="Issue Title *"
              placeholderTextColor={COLORS.textMuted}
              value={form.title}
              onChangeText={t => setForm(p => ({ ...p, title: t }))}
            />
            <TextInput
              style={[styles.inputField, styles.textArea]}
              placeholder="Describe your issue in detail *"
              placeholderTextColor={COLORS.textMuted}
              value={form.description}
              onChangeText={t => setForm(p => ({ ...p, description: t }))}
              multiline numberOfLines={4} textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, form.category === cat && styles.catChipActive]}
                    onPress={() => setForm(p => ({ ...p, category: cat }))}
                  >
                    <Text style={[styles.catChipText, form.category === cat && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {['low', 'medium', 'high'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityBtn, form.priority === p && { backgroundColor: priorityConfig[p].color }]}
                  onPress={() => setForm(prev => ({ ...prev, priority: p }))}
                >
                  <Text style={[styles.priorityBtnText, form.priority === p && { color: COLORS.white }]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '80%' }]}>
            <View style={styles.modalHandle} />
            {selectedTicket && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>{selectedTicket.title}</Text>
                  <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                    <Ionicons name="close" size={24} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailBadges}>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig[selectedTicket.status].bg }]}>
                    <Text style={{ color: statusConfig[selectedTicket.status].color, fontWeight: '700', fontSize: FONTS.sizes.sm }}>
                      {statusConfig[selectedTicket.status].label}
                    </Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{selectedTicket.category}</Text>
                  </View>
                </View>

                <Text style={styles.detailDesc}>{selectedTicket.description}</Text>

                <Text style={styles.updatesTitle}>Timeline</Text>
                {selectedTicket.updates.map((u, i) => (
                  <View key={i} style={styles.timelineRow}>
                    <View style={styles.timelineDot} />
                    {i < selectedTicket.updates.length - 1 && <View style={styles.timelineLine} />}
                    <Text style={styles.timelineText}>{u}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
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
    paddingVertical: SPACING.md, marginTop: -16, ...SHADOW.md,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statNum: { fontSize: FONTS.sizes.xl, fontWeight: '700' },
  statLbl: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },

  tabScroll: { backgroundColor: COLORS.background, marginTop: SPACING.md },
  tabContent: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.sm },
  tab: {
    paddingHorizontal: SPACING.md, paddingVertical: 8,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },

  ticketCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryBadge: {
    backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  categoryText: { fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.primary },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  priorityText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  ticketTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  ticketDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 8 },
  ticketFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ticketDate: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  updatesBadge: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  updatesText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },

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
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  inputField: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, height: 48, fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary, marginBottom: SPACING.sm,
  },
  textArea: { height: 100, paddingTop: SPACING.sm },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  catChipTextActive: { color: COLORS.white },
  priorityRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  priorityBtn: {
    flex: 1, paddingVertical: 10, borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center',
  },
  priorityBtnText: { fontWeight: '600', color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  submitBtn: { flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  submitText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },

  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  detailTitle: { flex: 1, fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, marginRight: SPACING.sm },
  detailBadges: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  detailDesc: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.lg },
  updatesTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary, marginRight: SPACING.sm, marginTop: 4 },
  timelineLine: { position: 'absolute', left: 5, top: 16, width: 2, height: 28, backgroundColor: COLORS.border },
  timelineText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  loadingText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },
});
