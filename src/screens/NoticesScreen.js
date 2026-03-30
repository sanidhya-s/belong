import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { NOTICES } from '../data/mockData';
import { fetchNotices, markNoticeRead } from '../api/notices';

const EXTRA_NOTICES = [
  {
    id: 'n5',
    title: 'Diwali Celebration 2025',
    body: 'Society will host a grand Diwali celebration on 20 October 2025 in the Clubhouse. Residents are requested to participate and make it memorable.',
    date: '20 Mar 2025',
    type: 'event',
    read: true,
  },
  {
    id: 'n6',
    title: 'Pest Control Drive',
    body: 'Quarterly pest control will be conducted in all common areas on 3 April 2025 from 9 AM to 12 PM. Please ensure windows are shut.',
    date: '18 Mar 2025',
    type: 'alert',
    read: true,
  },
  {
    id: 'n7',
    title: 'New Security Camera Installed',
    body: 'Additional CCTV cameras have been installed at the rear entrance and basement parking for enhanced security.',
    date: '15 Mar 2025',
    type: 'info',
    read: true,
  },
];

const ALL_NOTICES = [...NOTICES, ...EXTRA_NOTICES];

const typeConfig = {
  alert: { icon: 'warning', color: COLORS.error, bg: '#FEF2F2', label: 'Alert' },
  event: { icon: 'calendar', color: COLORS.primary, bg: '#F0EEFF', label: 'Event' },
  payment: { icon: 'card', color: COLORS.warning, bg: '#FFFBEB', label: 'Payment' },
  info: { icon: 'information-circle', color: COLORS.accentBlue, bg: '#EFF6FF', label: 'Info' },
};

const FILTER_TABS = ['All', 'Alert', 'Event', 'Payment', 'Info'];

export default function NoticesScreen({ navigation }) {
  const [notices, setNotices] = useState(ALL_NOTICES);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadNotices = async () => {
      try {
        const data = await fetchNotices();
        if (mounted && data.length > 0) {
          setNotices(data);
        }
      } catch (error) {
        // fallback to local notices
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadNotices();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = filter === 'All'
    ? notices
    : notices.filter(n => n.type === filter.toLowerCase());

  const unread = notices.filter(n => !n.read).length;

  const markAllRead = async () => {
    const unreadIds = notices.filter(n => !n.read).map(n => n.id);
    setNotices(prev => prev.map(n => ({ ...n, read: true })));
    await Promise.all(unreadIds.map(id => markNoticeRead(id).catch(() => null)));
  };

  const openNotice = async (notice) => {
    setSelected(notice);
    setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, read: true } : n));
    try {
      await markNoticeRead(notice.id);
    } catch (error) {
      // keep optimistic local read state
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Notices</Text>
          {unread > 0 && <Text style={styles.headerSub}>{unread} unread</Text>}
        </View>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAllBtn}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            {f !== 'All' && (
              <Ionicons
                name={typeConfig[f.toLowerCase()]?.icon}
                size={13}
                color={filter === f ? COLORS.white : typeConfig[f.toLowerCase()]?.color}
              />
            )}
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading notices...</Text>
          </View>
        )}
        {filtered.map((notice, i) => {
          const tc = typeConfig[notice.type] || typeConfig.info;
          return (
            <TouchableOpacity
              key={notice.id}
              style={[styles.noticeCard, !notice.read && styles.noticeCardUnread]}
              onPress={() => openNotice(notice)}
              activeOpacity={0.85}
            >
              <View style={[styles.noticeIconWrap, { backgroundColor: tc.bg }]}>
                <Ionicons name={tc.icon} size={22} color={tc.color} />
              </View>
              <View style={styles.noticeContent}>
                <View style={styles.noticeTopRow}>
                  <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
                    <Text style={[styles.typeBadgeText, { color: tc.color }]}>{tc.label}</Text>
                  </View>
                  {!notice.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeBody} numberOfLines={2}>{notice.body}</Text>
                <View style={styles.noticeFoot}>
                  <Ionicons name="calendar-outline" size={11} color={COLORS.textMuted} />
                  <Text style={styles.noticeDate}>{notice.date}</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {selected && (() => {
              const tc = typeConfig[selected.type] || typeConfig.info;
              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={[styles.detailIconWrap, { backgroundColor: tc.bg }]}>
                    <Ionicons name={tc.icon} size={32} color={tc.color} />
                  </View>
                  <View style={[styles.detailTypeBadge, { backgroundColor: tc.bg }]}>
                    <Text style={[styles.detailTypeTxt, { color: tc.color }]}>{tc.label}</Text>
                  </View>
                  <Text style={styles.detailTitle}>{selected.title}</Text>
                  <Text style={styles.detailDate}>
                    <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} /> {selected.date}
                  </Text>
                  <Text style={styles.detailBody}>{selected.body}</Text>
                  <TouchableOpacity
                    style={styles.closeDetailBtn}
                    onPress={() => setSelected(null)}
                  >
                    <Text style={styles.closeDetailText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  header: {
    backgroundColor: COLORS.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: SPACING.lg,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white, textAlign: 'center' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs, textAlign: 'center' },
  markAllBtn: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm, fontWeight: '600' },

  filterScroll: { backgroundColor: COLORS.background, maxHeight: 56 },
  filterContent: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    gap: SPACING.sm, alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.white, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  filterChipTextActive: { color: COLORS.white },

  scroll: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  noticeCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    flexDirection: 'row', padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  noticeCardUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  noticeIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
    flexShrink: 0,
  },
  noticeContent: { flex: 1 },
  noticeTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  typeBadge: { borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  noticeTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  noticeBody: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 6 },
  noticeFoot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  noticeDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.lg, paddingBottom: 40, maxHeight: '80%',
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg,
  },
  detailIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: SPACING.md,
  },
  detailTypeBadge: {
    alignSelf: 'center', borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 5, marginBottom: SPACING.md,
  },
  detailTypeTxt: { fontWeight: '700', fontSize: FONTS.sizes.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 8 },
  detailDate: { textAlign: 'center', color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginBottom: SPACING.lg },
  detailBody: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.xl },
  closeDetailBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center',
  },
  closeDetailText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
});
