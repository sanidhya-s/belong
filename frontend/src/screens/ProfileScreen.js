import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { USER } from '../data/mockData';
import { fetchResidents } from '../api/residents';

const MenuItem = ({ icon, label, sublabel, color, onPress, showArrow = true }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.menuText}>
      <Text style={styles.menuLabel}>{label}</Text>
      {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
    </View>
    {showArrow && <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [resident, setResident] = useState(USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadResident = async () => {
      try {
        const residents = await fetchResidents();
        if (mounted && residents.length > 0) {
          setResident(residents[0]);
        }
      } catch (error) {
        // Keep fallback user when backend is unavailable.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadResident();
    return () => {
      mounted = false;
    };
  }, []);

  const avatarLetter = useMemo(() => resident.name?.charAt(0) || 'U', [resident.name]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{avatarLetter}</Text>
          </View>
          <Text style={styles.profileName}>{resident.name}</Text>
          <Text style={styles.profilePhone}>{resident.phone}</Text>
          <View style={styles.flatTag}>
            <Ionicons name="home" size={14} color={COLORS.primary} />
            <Text style={styles.flatTagText}>{resident.flat} · {resident.society}</Text>
          </View>
        </View>

        {/* Resident Info */}
        <View style={styles.infoCard}>
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading resident profile...</Text>
            </View>
          )}
          {[
            { label: 'Flat Number', value: resident.flat, icon: 'home-outline' },
            { label: 'Society', value: resident.society, icon: 'business-outline' },
            { label: 'Resident Type', value: resident.role || 'Owner', icon: 'person-outline' },
            { label: 'Member Since', value: 'January 2024', icon: 'calendar-outline' },
          ].map((item, i) => (
            <View key={i} style={[styles.infoRow, i < 3 && styles.infoDivider]}>
              <Ionicons name={item.icon} size={16} color={COLORS.textMuted} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="notifications-outline" label="Notifications" sublabel="Manage your alerts" color={COLORS.primary} onPress={() => {}} />
            <MenuItem icon="lock-closed-outline" label="Privacy" sublabel="Security settings" color={COLORS.accentBlue} onPress={() => {}} />
            <MenuItem icon="card-outline" label="Payment History" sublabel="View past transactions" color={COLORS.accentGreen} onPress={() => {}} />
          </View>

          <Text style={styles.menuSectionTitle}>Community</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="people-outline" label="Family Members" sublabel="Add family to your account" color={COLORS.warning} onPress={() => {}} />
            <MenuItem icon="car-outline" label="My Vehicles" sublabel="2 vehicles registered" color={COLORS.accentBlue} onPress={() => {}} />
            <MenuItem icon="document-text-outline" label="My Documents" sublabel="NOC, ID, Agreements" color={COLORS.primary} onPress={() => {}} />
          </View>

          <Text style={styles.menuSectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="help-circle-outline" label="Help & FAQ" color="#8E44AD" onPress={() => {}} />
            <MenuItem icon="chatbubble-ellipses-outline" label="Contact Us" color={COLORS.accentGreen} onPress={() => {}} />
            <MenuItem icon="star-outline" label="Rate App" color={COLORS.warning} onPress={() => {}} />
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive' },
            ])}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Belong v1.0.0 · Made with ❤️ for communities</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  header: {
    backgroundColor: COLORS.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: SPACING.xxl,
  },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.white },
  editBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },

  profileCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg, marginTop: -28,
    padding: SPACING.lg, alignItems: 'center', ...SHADOW.lg,
  },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: SPACING.md, borderWidth: 4, borderColor: COLORS.white,
    ...SHADOW.md,
  },
  avatarLargeText: { color: COLORS.white, fontSize: FONTS.sizes.xxxl, fontWeight: '700' },
  profileName: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary },
  profilePhone: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },
  flatTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 6, marginTop: SPACING.sm,
  },
  flatTagText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.sm },

  infoCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg, marginTop: SPACING.md, ...SHADOW.sm,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  infoDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoText: { flex: 1 },
  infoLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  infoValue: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary, marginTop: 2 },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },

  menuSection: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  menuSectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textMuted, marginBottom: SPACING.sm, marginTop: SPACING.md, textTransform: 'uppercase', letterSpacing: 1 },
  menuCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, ...SHADOW.sm, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  menuText: { flex: 1 },
  menuLabel: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  menuSublabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, backgroundColor: '#FEF2F2', borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md, marginTop: SPACING.md,
    borderWidth: 1, borderColor: '#FEE2E2',
  },
  logoutText: { color: COLORS.error, fontSize: FONTS.sizes.md, fontWeight: '700' },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: SPACING.lg },
});
