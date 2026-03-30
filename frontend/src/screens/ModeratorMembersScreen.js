import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity,
  ScrollView, Modal, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { addMember, fetchMembers } from '../api/moderator';

export default function ModeratorMembersScreen() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'RESIDENT' });

  const loadMembers = async () => {
    try {
      const data = await fetchMembers();
      setMembers(data);
    } catch (error) {
      Alert.alert('Access Error', 'Only moderator/admin accounts can manage members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const onSubmit = async () => {
    if (!form.name || !form.phone) {
      Alert.alert('Missing info', 'Name and phone are required.');
      return;
    }

    try {
      const created = await addMember(form);
      setMembers(prev => [created, ...prev]);
      setForm({ name: '', phone: '', email: '', role: 'RESIDENT' });
      setShowModal(false);
    } catch (error) {
      Alert.alert('Unable to add member', 'Please verify phone uniqueness and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Moderator · Members</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="person-add" size={18} color={COLORS.white} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {loading ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loaderText}>Loading members...</Text>
          </View>
        ) : (
          members.map(member => (
            <View key={member.id} style={styles.card}>
              <Text style={styles.name}>{member.name || 'Unnamed Member'}</Text>
              <Text style={styles.meta}>{member.phone}</Text>
              {member.email ? <Text style={styles.meta}>{member.email}</Text> : null}
              <View style={styles.badges}>
                <View style={styles.roleBadge}><Text style={styles.roleText}>{member.role}</Text></View>
                <View style={[styles.roleBadge, { backgroundColor: '#E8F8F5' }]}><Text style={[styles.roleText, { color: '#148F77' }]}>{member.unit || 'No Unit'}</Text></View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add Member</Text>
            {[
              { key: 'name', placeholder: 'Full name *' },
              { key: 'phone', placeholder: 'Phone *', keyboardType: 'phone-pad' },
              { key: 'email', placeholder: 'Email (optional)', keyboardType: 'email-address' },
              { key: 'role', placeholder: 'Role (RESIDENT/MODERATOR)' },
            ].map(field => (
              <TextInput
                key={field.key}
                style={styles.input}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChangeText={text => setForm(prev => ({ ...prev, [field.key]: text }))}
                autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                keyboardType={field.keyboardType}
              />
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
                <Text style={styles.submitText}>Create</Text>
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
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  addBtnText: { color: COLORS.white, fontWeight: '700' },
  scroll: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  loaderRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  loaderText: { color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.light,
  },
  name: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  meta: { color: COLORS.textSecondary, marginTop: 2 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8 },
  roleBadge: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  roleText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.xs },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: { fontWeight: '700', fontSize: FONTS.sizes.lg, marginBottom: 8, color: COLORS.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 6,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  cancelText: { color: COLORS.textMuted, fontWeight: '600' },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 18, paddingVertical: 10 },
  submitText: { color: COLORS.white, fontWeight: '700' },
});
