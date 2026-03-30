import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Modal, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';
import { AMENITIES } from '../data/mockData';

const AmenityCard = ({ amenity, onPress }) => (
  <TouchableOpacity style={[styles.amenityCard, { borderTopColor: amenity.color }]} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.amenityIconWrap, { backgroundColor: amenity.bgColor }]}>
      <Ionicons name={amenity.icon} size={28} color={amenity.color} />
    </View>
    <View style={styles.amenityInfo}>
      <Text style={styles.amenityName}>{amenity.name}</Text>
      <View style={styles.amenityMeta}>
        <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
        <Text style={styles.amenityLocation}>{amenity.location}</Text>
      </View>
      <View style={styles.amenityMeta}>
        <Ionicons name="people-outline" size={12} color={COLORS.textMuted} />
        <Text style={styles.amenityLocation}>Capacity: {amenity.capacity}</Text>
      </View>
    </View>
    <View style={styles.availableCount}>
      <Text style={[styles.countNum, { color: amenity.color }]}>
        {amenity.slots.filter(s => s.available).length}
      </Text>
      <Text style={styles.countLabel}>slots</Text>
    </View>
  </TouchableOpacity>
);

const SlotChip = ({ slot, selected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.slotChip,
      !slot.available && styles.slotUnavailable,
      selected && styles.slotSelected,
    ]}
    onPress={slot.available ? onPress : null}
    activeOpacity={slot.available ? 0.7 : 1}
  >
    <Text style={[
      styles.slotText,
      !slot.available && styles.slotTextUnavailable,
      selected && styles.slotTextSelected,
    ]}>
      {slot.time}
    </Text>
    {!slot.available && (
      <Text style={styles.bookedLabel}>Booked</Text>
    )}
  </TouchableOpacity>
);

export default function AmenitiesScreen({ navigation }) {
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookings, setBookings] = useState([]);

  const openAmenity = (amenity) => {
    setSelectedAmenity(amenity);
    setSelectedSlot(null);
    setModalVisible(true);
  };

  const handleBook = () => {
    if (!selectedSlot) {
      Alert.alert('Select Slot', 'Please select a time slot to book.');
      return;
    }
    Alert.alert(
      'Booking Confirmed! 🎉',
      `${selectedAmenity.name}\n${selectedSlot.time}\n\nYour booking is confirmed!`,
      [{ text: 'Done', onPress: () => { setModalVisible(false); setSelectedSlot(null); } }]
    );
    setBookings(prev => [...prev, { amenity: selectedAmenity, slot: selectedSlot }]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Amenities</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={18} color={COLORS.primary} />
          <Text style={styles.infoText}>Select an amenity to view available slots and book</Text>
        </View>

        <Text style={styles.sectionTitle}>Available Amenities</Text>

        {AMENITIES.map(amenity => (
          <AmenityCard key={amenity.id} amenity={amenity} onPress={() => openAmenity(amenity)} />
        ))}

        {bookings.length > 0 && (
          <View style={styles.myBookings}>
            <Text style={styles.sectionTitle}>My Bookings</Text>
            {bookings.map((b, i) => (
              <View key={i} style={styles.bookingItem}>
                <View style={[styles.bookingDot, { backgroundColor: b.amenity.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingName}>{b.amenity.name}</Text>
                  <Text style={styles.bookingTime}>{b.slot.time}</Text>
                </View>
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedText}>Confirmed</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            {selectedAmenity && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIcon, { backgroundColor: selectedAmenity.bgColor }]}>
                    <Ionicons name={selectedAmenity.icon} size={32} color={selectedAmenity.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.modalTitle}>{selectedAmenity.name}</Text>
                    <Text style={styles.modalSub}>{selectedAmenity.location}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.slotLabel}>Select Time Slot</Text>
                <View style={styles.slotGrid}>
                  {selectedAmenity.slots.map(slot => (
                    <SlotChip
                      key={slot.id}
                      slot={slot}
                      selected={selectedSlot?.id === slot.id}
                      onPress={() => setSelectedSlot(slot)}
                    />
                  ))}
                </View>

                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                    <Text style={styles.legendText}>Available</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.border }]} />
                    <Text style={styles.legendText}>Booked</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.accentGreen }]} />
                    <Text style={styles.legendText}>Selected</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.bookBtn, !selectedSlot && styles.bookBtnDisabled]}
                  onPress={handleBook}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                  <Text style={styles.bookBtnText}>
                    {selectedSlot ? `Book · ${selectedSlot.time}` : 'Select a Slot'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },

  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0EEFF', borderRadius: RADIUS.md,
    padding: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  infoText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '500' },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginVertical: SPACING.md },

  amenityCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, marginBottom: SPACING.sm,
    borderTopWidth: 3, ...SHADOW.sm,
  },
  amenityIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  amenityInfo: { flex: 1 },
  amenityName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  amenityMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  amenityLocation: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  availableCount: { alignItems: 'center' },
  countNum: { fontSize: FONTS.sizes.xxl, fontWeight: '700' },
  countLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  myBookings: { marginTop: SPACING.md },
  bookingItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.sm,
    ...SHADOW.sm,
  },
  bookingDot: { width: 10, height: 10, borderRadius: 5 },
  bookingName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  bookingTime: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  confirmedBadge: { backgroundColor: '#EAFAF1', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 4 },
  confirmedText: { color: COLORS.accentGreen, fontSize: FONTS.sizes.xs, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.lg, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  modalIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary },
  modalSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },
  slotLabel: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.md },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  slotChip: {
    borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.white,
  },
  slotUnavailable: { borderColor: COLORS.border, backgroundColor: COLORS.background },
  slotSelected: { backgroundColor: COLORS.accentGreen, borderColor: COLORS.accentGreen },
  slotText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.primary },
  slotTextUnavailable: { color: COLORS.textMuted },
  slotTextSelected: { color: COLORS.white },
  bookedLabel: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },
  legendRow: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  bookBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.md, gap: SPACING.sm,
  },
  bookBtnDisabled: { backgroundColor: COLORS.textMuted },
  bookBtnText: { color: COLORS.white, fontSize: FONTS.sizes.md, fontWeight: '700' },
});
