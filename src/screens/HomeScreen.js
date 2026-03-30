import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { USER, NOTICES } from '../data/mockData';
import { fetchResidents } from '../api/residents';
import { fetchNotices } from '../api/notices';
import { fetchVisitors } from '../api/visitors';
import { fetchTickets } from '../api/tickets';

const QuickAction = ({ icon, label, color, bgColor, badge, onPress }) => (
  <TouchableOpacity style={[styles.quickAction, { backgroundColor: bgColor }]} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon} size={24} color={color} />
      {badge ? (
        <View style={[styles.qaBadge, { backgroundColor: color }]}>
          <Text style={styles.qaBadgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
    <Text style={styles.quickActionLabel} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

const NoticeCard = ({ notice }) => {
  const typeConfig = {
    alert: { icon: 'warning', color: COLORS.error, bg: '#FEF2F2' },
    event: { icon: 'calendar', color: COLORS.primary, bg: '#F0EEFF' },
    payment: { icon: 'card', color: COLORS.warning, bg: '#FFFBEB' },
    info: { icon: 'information-circle', color: COLORS.accentBlue, bg: '#EFF6FF' },
  };
  const config = typeConfig[notice.type] || typeConfig.info;
  return (
    <TouchableOpacity style={[styles.noticeCard, !notice.read && styles.noticeCardUnread]} activeOpacity={0.85}>
      <View style={[styles.noticeIconWrap, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>
      <View style={styles.noticeContent}>
        <View style={styles.noticeHeader}>
          <Text style={styles.noticeTitle} numberOfLines={1}>{notice.title}</Text>
          {!notice.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.noticeBody} numberOfLines={2}>{notice.body}</Text>
        <Text style={styles.noticeDate}>{notice.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(USER);
  const [notices, setNotices] = useState(NOTICES);
  const [visitorCount, setVisitorCount] = useState(2);
  const [ticketOpenCount, setTicketOpenCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      const [residentsResult, noticesResult, visitorsResult, ticketsResult] = await Promise.allSettled([
        fetchResidents(),
        fetchNotices(),
        fetchVisitors(),
        fetchTickets(),
      ]);

      if (!mounted) return;

      if (residentsResult.status === 'fulfilled' && residentsResult.value.length > 0) {
        setUser(residentsResult.value[0]);
      }
      if (noticesResult.status === 'fulfilled' && noticesResult.value.length > 0) {
        setNotices(noticesResult.value);
      }
      if (visitorsResult.status === 'fulfilled') {
        setVisitorCount(visitorsResult.value.filter(v => v.status === 'pending').length);
      }
      if (ticketsResult.status === 'fulfilled') {
        setTicketOpenCount(ticketsResult.value.filter(t => t.status !== 'resolved').length);
      }
      setLoading(false);
    };

    loadDashboard().catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const unreadCount = useMemo(() => notices.filter(n => !n.read).length, [notices]);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const row1 = [
    { icon: 'calendar', label: 'Amenities', color: COLORS.primary, bgColor: '#F0EEFF', screen: 'Amenities' },
    { icon: 'people', label: 'Visitors', color: '#E74C3C', bgColor: '#FDEDEC', screen: 'Visitors', badge: visitorCount > 0 ? String(visitorCount) : null },
    { icon: 'shield', label: 'Security', color: '#27AE60', bgColor: '#EAFAF1', screen: 'Security' },
    { icon: 'chatbubbles', label: 'Support', color: '#F39C12', bgColor: '#FEF9E7', screen: 'Support' },
  ];
  const row2 = [
    { icon: 'card', label: 'Pay Dues', color: '#3498DB', bgColor: '#EBF5FB', screen: 'Payments', badge: '!' },
    { icon: 'qr-code', label: 'Gate Pass', color: '#8E44AD', bgColor: '#F5EEF8', screen: 'GatePass' },
    { icon: 'newspaper', label: 'Notices', color: '#E67E22', bgColor: '#FEF0E7', screen: 'Notices', badge: unreadCount > 0 ? String(unreadCount) : null },
    { icon: 'heart', label: 'Community', color: '#1ABC9C', bgColor: '#E8F8F5', screen: 'Community' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerGreeting}>Good morning 👋</Text>
              <Text style={styles.headerName}>{user.name}</Text>
              <View style={styles.flatBadge}>
                <Ionicons name="home" size={12} color={COLORS.primaryLight} />
                <Text style={styles.flatText}>{user.flat} · {user.society}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notices')}>
              <Ionicons name="notifications" size={22} color={COLORS.white} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.dateBar}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.primaryLight} />
            <Text style={styles.dateText}>{today}</Text>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Syncing dashboard...</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsBar}>
          {[
            { label: 'Visitors', value: String(visitorCount), icon: 'people' },
            { label: 'Tickets', value: String(ticketOpenCount), icon: 'construct' },
            { label: 'Due', value: '₹5.8k', icon: 'card' },
          ].map((s, i) => (
            <View key={i} style={[styles.statItem, i < 2 && styles.statDivider]}>
              <Ionicons name={s.icon} size={16} color={COLORS.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {row1.map(a => <QuickAction key={a.screen} {...a} onPress={() => navigation.navigate(a.screen)} />)}
          </View>
          <View style={[styles.quickGrid, { marginTop: SPACING.sm }]}>
            {row2.map(a => <QuickAction key={a.screen} {...a} onPress={() => navigation.navigate(a.screen)} />)}
          </View>
        </View>

        {/* Payment Banner */}
        <TouchableOpacity style={styles.payBanner} onPress={() => navigation.navigate('Payments')} activeOpacity={0.88}>
          <View style={styles.payBannerLeft}>
            <View style={styles.payBannerIconWrap}>
              <Ionicons name="card" size={22} color={COLORS.white} />
            </View>
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={styles.payBannerTitle}>Maintenance Due</Text>
              <Text style={styles.payBannerSub}>₹5,800 pending · Due 5 Apr 2025</Text>
            </View>
          </View>
          <View style={styles.payBannerBtn}>
            <Text style={styles.payBannerBtnText}>Pay</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* Notices */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Notices</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notices')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {notices.slice(0, 3).map(n => <NoticeCard key={n.id} notice={n} />)}
        </View>

        {/* Community CTA */}
        <TouchableOpacity style={styles.communityCard} onPress={() => navigation.navigate('Community')} activeOpacity={0.85}>
          <View style={styles.communityIconWrap}>
            <Ionicons name="people-circle" size={28} color={COLORS.accentGreen} />
          </View>
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.communityTitle}>Community Board</Text>
            <Text style={styles.communitySub}>6 new posts · See what's happening</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flex: 1, backgroundColor: COLORS.background },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerGreeting: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, fontWeight: '500' },
  headerName: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '700', marginTop: 2 },
  flatBadge: {
    flexDirection: 'row', alignItems: 'center', marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  flatText: { color: COLORS.white, fontSize: FONTS.sizes.xs, marginLeft: 4, fontWeight: '500' },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: COLORS.accent, borderRadius: 8, minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
  },
  notifBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  dateBar: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md },
  dateText: { color: COLORS.primaryLight, fontSize: FONTS.sizes.sm, marginLeft: 6 },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  loadingText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm },

  statsBar: {
    marginHorizontal: SPACING.lg, marginTop: SPACING.lg,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    flexDirection: 'row', ...SHADOW.sm, paddingVertical: SPACING.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { borderRightWidth: 1, borderRightColor: COLORS.border },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center' },

  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  seeAll: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '600' },

  quickGrid: { flexDirection: 'row', gap: SPACING.sm },
  quickAction: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.sm,
    alignItems: 'center', paddingVertical: SPACING.md, ...SHADOW.sm,
  },
  quickActionIcon: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  qaBadge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
  },
  qaBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },

  payBanner: {
    marginHorizontal: SPACING.lg, marginTop: SPACING.lg,
    backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.md, ...SHADOW.md,
  },
  payBannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  payBannerIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  payBannerTitle: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  payBannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs, marginTop: 2 },
  payBannerBtn: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.md, paddingVertical: 8,
  },
  payBannerBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.sm },

  noticeCard: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  noticeCardUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  noticeIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  noticeContent: { flex: 1 },
  noticeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  noticeTitle: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 6 },
  noticeBody: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 4 },
  noticeDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  communityCard: {
    marginHorizontal: SPACING.lg, marginTop: SPACING.sm,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md, ...SHADOW.sm,
  },
  communityIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E8F8F5', justifyContent: 'center', alignItems: 'center',
  },
  communityTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  communitySub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
});
