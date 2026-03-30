import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';

const { width } = Dimensions.get('window');

const PAYMENT_DATA = {
  outstanding: [
    {
      id: 'p1',
      title: 'Maintenance Charges',
      subtitle: 'Q1 April – June 2025',
      amount: 4500,
      dueDate: '5 Apr 2025',
      category: 'maintenance',
      overdue: false,
    },
    {
      id: 'p2',
      title: 'Water Tanker Charges',
      subtitle: 'March 2025',
      amount: 800,
      dueDate: '1 Apr 2025',
      category: 'utility',
      overdue: true,
    },
    {
      id: 'p3',
      title: 'Parking Fee',
      subtitle: 'April 2025',
      amount: 500,
      dueDate: '10 Apr 2025',
      category: 'parking',
      overdue: false,
    },
  ],
  history: [
    { id: 'h1', title: 'Maintenance Charges', subtitle: 'Q4 Jan – Mar 2025', amount: 4500, date: '5 Jan 2025', mode: 'UPI', status: 'paid' },
    { id: 'h2', title: 'Water Tanker Charges', subtitle: 'February 2025', amount: 800, date: '1 Feb 2025', mode: 'Net Banking', status: 'paid' },
    { id: 'h3', title: 'Parking Fee', subtitle: 'March 2025', amount: 500, date: '10 Mar 2025', mode: 'UPI', status: 'paid' },
    { id: 'h4', title: 'Maintenance Charges', subtitle: 'Q3 Oct – Dec 2024', amount: 4500, date: '5 Oct 2024', mode: 'Cheque', status: 'paid' },
    { id: 'h5', title: 'Club Membership', subtitle: 'Annual 2024', amount: 2000, date: '15 Jan 2024', mode: 'UPI', status: 'paid' },
  ],
};

const categoryConfig = {
  maintenance: { icon: 'construct', color: COLORS.primary, bg: '#F0EEFF' },
  utility: { icon: 'water', color: COLORS.accentBlue, bg: '#EFF6FF' },
  parking: { icon: 'car', color: COLORS.warning, bg: '#FFFBEB' },
  clubhouse: { icon: 'business', color: '#8E44AD', bg: '#F5EEF8' },
};

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: 'phone-portrait', desc: 'Pay via any UPI app' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: 'globe', desc: 'All major banks' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet', desc: 'Paytm, PhonePe, etc.' },
];

function OutstandingCard({ item, onPay }) {
  const cat = categoryConfig[item.category] || categoryConfig.maintenance;
  return (
    <View style={[styles.outCard, item.overdue && styles.outCardOverdue]}>
      <View style={styles.outCardTop}>
        <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
          <Ionicons name={cat.icon} size={20} color={cat.color} />
        </View>
        <View style={{ flex: 1, marginLeft: SPACING.md }}>
          <Text style={styles.outTitle}>{item.title}</Text>
          <Text style={styles.outSub}>{item.subtitle}</Text>
        </View>
        {item.overdue && (
          <View style={styles.overdueTag}>
            <Text style={styles.overdueText}>Overdue</Text>
          </View>
        )}
      </View>
      <View style={styles.outCardBottom}>
        <View>
          <Text style={styles.amountLabel}>Amount Due</Text>
          <Text style={[styles.amount, { color: item.overdue ? COLORS.error : COLORS.textPrimary }]}>
            ₹{item.amount.toLocaleString()}
          </Text>
          <Text style={styles.dueDate}>
            <Ionicons name="time-outline" size={11} color={COLORS.textMuted} /> Due: {item.dueDate}
          </Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={() => onPay(item)} activeOpacity={0.85}>
          <Text style={styles.payBtnText}>Pay Now</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HistoryCard({ item }) {
  return (
    <View style={styles.histCard}>
      <View style={[styles.histIcon, { backgroundColor: COLORS.surfaceAlt }]}>
        <Ionicons name="checkmark-circle" size={20} color={COLORS.accentGreen} />
      </View>
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <Text style={styles.histTitle}>{item.title}</Text>
        <Text style={styles.histSub}>{item.subtitle}</Text>
        <View style={styles.histMeta}>
          <Ionicons name="calendar-outline" size={11} color={COLORS.textMuted} />
          <Text style={styles.histMetaText}>{item.date}</Text>
          <Text style={styles.histDot}>·</Text>
          <Text style={styles.histMetaText}>{item.mode}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.histAmount}>₹{item.amount.toLocaleString()}</Text>
        <View style={styles.paidBadge}>
          <Text style={styles.paidText}>Paid</Text>
        </View>
      </View>
    </View>
  );
}

export default function PaymentsScreen({ navigation }) {
  const [tab, setTab] = useState('outstanding');
  const [payModal, setPayModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [paid, setPaid] = useState([]);

  const outstanding = PAYMENT_DATA.outstanding.filter(p => !paid.includes(p.id));
  const totalDue = outstanding.reduce((s, p) => s + p.amount, 0);

  const openPay = (item) => {
    setSelectedBill(item);
    setPayModal(true);
  };

  const handlePayment = () => {
    setPayModal(false);
    setTimeout(() => {
      Alert.alert(
        '✅ Payment Successful',
        `₹${selectedBill.amount.toLocaleString()} paid for ${selectedBill.title}\n\nTransaction ID: TXN${Date.now()}`,
        [{ text: 'View Receipt', onPress: () => {} }, { text: 'Done' }]
      );
      setPaid(prev => [...prev, selectedBill.id]);
    }, 300);
  };

  const handlePayAll = () => {
    Alert.alert(
      'Pay All Dues',
      `Pay ₹${totalDue.toLocaleString()} for all ${outstanding.length} pending bill(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now', onPress: () => {
            setPaid(PAYMENT_DATA.outstanding.map(p => p.id));
            Alert.alert('✅ All Paid!', `₹${totalDue.toLocaleString()} paid successfully.`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="download-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Summary Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerLabel}>Total Outstanding</Text>
          <Text style={styles.bannerAmount}>₹{totalDue.toLocaleString()}</Text>
          <Text style={styles.bannerSub}>{outstanding.length} bill(s) pending</Text>
        </View>
        {outstanding.length > 0 && (
          <TouchableOpacity style={styles.payAllBtn} onPress={handlePayAll}>
            <Text style={styles.payAllText}>Pay All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['outstanding', 'history'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'outstanding' ? 'Outstanding' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'outstanding' ? (
          outstanding.length === 0 ? (
            <View style={styles.allClear}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.accentGreen} />
              <Text style={styles.allClearTitle}>All Clear! 🎉</Text>
              <Text style={styles.allClearSub}>You have no pending dues</Text>
            </View>
          ) : (
            outstanding.map(item => (
              <OutstandingCard key={item.id} item={item} onPay={openPay} />
            ))
          )
        ) : (
          <>
            <Text style={styles.histSectionLabel}>Transaction History</Text>
            {PAYMENT_DATA.history.map(item => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Payment Modal */}
      <Modal visible={payModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose Payment Method</Text>

            {selectedBill && (
              <View style={styles.billSummary}>
                <Text style={styles.billSummaryTitle}>{selectedBill.title}</Text>
                <Text style={styles.billSummaryAmount}>₹{selectedBill.amount.toLocaleString()}</Text>
              </View>
            )}

            <View style={styles.methodList}>
              {PAYMENT_METHODS.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.methodRow, selectedMethod === m.id && styles.methodRowActive]}
                  onPress={() => setSelectedMethod(m.id)}
                >
                  <View style={[styles.methodIcon, selectedMethod === m.id && { backgroundColor: COLORS.primary }]}>
                    <Ionicons name={m.icon} size={18} color={selectedMethod === m.id ? COLORS.white : COLORS.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodLabel}>{m.label}</Text>
                    <Text style={styles.methodDesc}>{m.desc}</Text>
                  </View>
                  <View style={[styles.radio, selectedMethod === m.id && styles.radioActive]}>
                    {selectedMethod === m.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setPayModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handlePayment}>
                <Ionicons name="lock-closed" size={16} color={COLORS.white} />
                <Text style={styles.confirmText}>
                  Pay ₹{selectedBill?.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.secureNote}>
              <Ionicons name="shield-checkmark" size={12} color={COLORS.accentGreen} /> 100% Secure · SSL Encrypted
            </Text>
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
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },

  banner: {
    backgroundColor: COLORS.primaryDark, marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl, padding: SPACING.lg, marginTop: -12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...SHADOW.lg,
  },
  bannerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  bannerAmount: { color: COLORS.white, fontSize: FONTS.sizes.xxxl, fontWeight: '800', marginVertical: 4 },
  bannerSub: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.sm },
  payAllBtn: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg, paddingVertical: 12,
  },
  payAllText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.sm },

  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg, marginTop: SPACING.md,
    borderRadius: RADIUS.full, padding: 4, ...SHADOW.sm,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.full },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },

  scroll: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },

  outCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  outCardOverdue: { borderLeftWidth: 4, borderLeftColor: COLORS.error },
  outCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  catIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  outTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  outSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  overdueTag: {
    backgroundColor: '#FEF2F2', borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  overdueText: { color: COLORS.error, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  outCardBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  amountLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  amount: { fontSize: FONTS.sizes.xxl, fontWeight: '700', marginVertical: 2 },
  dueDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  payBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.lg, paddingVertical: 12,
  },
  payBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },

  allClear: { alignItems: 'center', paddingVertical: 60, gap: SPACING.md },
  allClearTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary },
  allClearSub: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },

  histSectionLabel: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.md },
  histCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  histIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  histTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  histSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  histMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  histMetaText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  histDot: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  histAmount: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  paidBadge: { backgroundColor: '#EAFAF1', borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  paidText: { color: COLORS.accentGreen, fontSize: FONTS.sizes.xs, fontWeight: '700' },

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
  billSummary: {
    backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  billSummaryTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  billSummaryAmount: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  methodList: { gap: SPACING.sm, marginBottom: SPACING.lg },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    gap: SPACING.md,
  },
  methodRowActive: { borderColor: COLORS.primary, backgroundColor: '#F0EEFF' },
  methodIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center',
  },
  methodLabel: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  methodDesc: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  modalActions: { flexDirection: 'row', gap: SPACING.sm },
  cancelBtn: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center',
  },
  cancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  confirmBtn: {
    flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 8,
  },
  confirmText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  secureNote: { textAlign: 'center', color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: SPACING.md },
});
