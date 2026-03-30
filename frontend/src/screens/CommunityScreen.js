import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';

const FEED_POSTS = [
  {
    id: 'f1',
    author: 'Society Admin',
    flat: 'Management',
    avatar: 'A',
    avatarColor: COLORS.primary,
    content: '🎉 Congratulations to Block B residents for winning the best-maintained block award this quarter! Keep up the great work.',
    time: '2 hours ago',
    likes: 24,
    comments: 5,
    category: 'announcement',
    liked: false,
    pinned: true,
  },
  {
    id: 'f2',
    author: 'Meera Nair',
    flat: 'A-102',
    avatar: 'M',
    avatarColor: '#E74C3C',
    content: 'Does anyone have a good recommendation for a reliable plumber? The one I called last time was not responsive.',
    time: '4 hours ago',
    likes: 3,
    comments: 8,
    category: 'question',
    liked: false,
    pinned: false,
  },
  {
    id: 'f3',
    author: 'Ravi Gupta',
    flat: 'C-201',
    avatar: 'R',
    avatarColor: '#27AE60',
    content: '🌱 I have extra tomato and basil saplings from my terrace garden. Free for anyone who wants them! Just message me.',
    time: 'Yesterday',
    likes: 18,
    comments: 12,
    category: 'community',
    liked: true,
    pinned: false,
  },
  {
    id: 'f4',
    author: 'Society Admin',
    flat: 'Management',
    avatar: 'A',
    avatarColor: COLORS.primary,
    content: '⚠️ Reminder: Please do not park vehicles in front of the fire exit near Block A. This is a safety hazard and action will be taken against repeat offenders.',
    time: 'Yesterday',
    likes: 34,
    comments: 7,
    category: 'announcement',
    liked: false,
    pinned: false,
  },
  {
    id: 'f5',
    author: 'Sunita Verma',
    flat: 'D-401',
    avatar: 'S',
    avatarColor: '#8E44AD',
    content: 'Lost: A black labrador puppy near Block D this morning. Name is Bruno. If found please contact 9876543210. Offering a reward 🐕',
    time: '2 days ago',
    likes: 41,
    comments: 22,
    category: 'lost_found',
    liked: false,
    pinned: false,
  },
  {
    id: 'f6',
    author: 'Arjun Reddy',
    flat: 'B-105',
    avatar: 'A',
    avatarColor: '#F39C12',
    content: 'Anyone interested in forming a badminton group? Looking for players for weekend morning sessions. All levels welcome! 🏸',
    time: '2 days ago',
    likes: 15,
    comments: 9,
    category: 'community',
    liked: false,
    pinned: false,
  },
];

const categoryConfig = {
  announcement: { label: 'Announcement', icon: 'megaphone', color: COLORS.primary, bg: '#F0EEFF' },
  question: { label: 'Question', icon: 'help-circle', color: COLORS.accentBlue, bg: '#EFF6FF' },
  community: { label: 'Community', icon: 'heart', color: COLORS.accentGreen, bg: '#EAFAF1' },
  lost_found: { label: 'Lost & Found', icon: 'search', color: COLORS.warning, bg: '#FFFBEB' },
  sale: { label: 'Sale', icon: 'pricetag', color: '#E74C3C', bg: '#FDEDEC' },
};

const FILTERS = ['All', 'Announcement', 'Question', 'Community', 'Lost & Found'];

function PostCard({ post, onLike }) {
  const cat = categoryConfig[post.category] || categoryConfig.community;

  return (
    <View style={[styles.postCard, post.pinned && styles.postCardPinned]}>
      {post.pinned && (
        <View style={styles.pinnedBar}>
          <Ionicons name="pin" size={12} color={COLORS.primary} />
          <Text style={styles.pinnedText}>Pinned Post</Text>
        </View>
      )}

      <View style={styles.postHeader}>
        <View style={[styles.postAvatar, { backgroundColor: post.avatarColor }]}>
          <Text style={styles.postAvatarText}>{post.avatar}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <Text style={styles.postFlat}>{post.flat} · {post.time}</Text>
        </View>
        <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
          <Ionicons name={cat.icon} size={11} color={cat.color} />
          <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.label}</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(post.id)}>
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={18}
            color={post.liked ? COLORS.error : COLORS.textMuted}
          />
          <Text style={[styles.actionCount, post.liked && { color: COLORS.error }]}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={17} color={COLORS.textMuted} />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={18} color={COLORS.textMuted} />
          <Text style={styles.actionCount}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState(FEED_POSTS);
  const [filter, setFilter] = useState('All');
  const [showPost, setShowPost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', category: 'community' });

  const handleLike = (id) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handlePost = () => {
    if (!newPost.content.trim()) { Alert.alert('Empty Post', 'Please write something.'); return; }
    const p = {
      id: `f${Date.now()}`,
      author: 'Rahul Sharma',
      flat: 'B-304',
      avatar: 'R',
      avatarColor: COLORS.primary,
      content: newPost.content,
      time: 'Just now',
      likes: 0,
      comments: 0,
      category: newPost.category,
      liked: false,
      pinned: false,
    };
    setPosts(prev => [p, ...prev]);
    setNewPost({ content: '', category: 'community' });
    setShowPost(false);
  };

  const filterKey = filter === 'Lost & Found' ? 'lost_found' : filter.toLowerCase();
  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filterKey);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.postBtn} onPress={() => setShowPost(true)}>
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* New post quick bar */}
      <TouchableOpacity style={styles.quickPost} onPress={() => setShowPost(true)} activeOpacity={0.8}>
        <View style={styles.quickAvatar}>
          <Text style={styles.quickAvatarText}>R</Text>
        </View>
        <Text style={styles.quickPlaceholder}>Share something with your community...</Text>
        <Ionicons name="image-outline" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      {/* Filter chips */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* New Post Modal */}
      <Modal visible={showPost} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTopRow}>
              <Text style={styles.modalTitle}>New Post</Text>
              <TouchableOpacity onPress={() => setShowPost(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="What's on your mind? Share with your community..."
              placeholderTextColor={COLORS.textMuted}
              value={newPost.content}
              onChangeText={t => setNewPost(p => ({ ...p, content: t }))}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.catGrid}>
              {Object.entries(categoryConfig).map(([key, val]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.catChip, newPost.category === key && { backgroundColor: val.color, borderColor: val.color }]}
                  onPress={() => setNewPost(p => ({ ...p, category: key }))}
                >
                  <Ionicons name={val.icon} size={13} color={newPost.category === key ? COLORS.white : val.color} />
                  <Text style={[styles.catChipText, newPost.category === key && { color: COLORS.white }]}>{val.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitPost} onPress={handlePost}>
              <Text style={styles.submitPostText}>Post to Community</Text>
            </TouchableOpacity>
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
  postBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },

  quickPost: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg, borderRadius: RADIUS.xl, padding: SPACING.md,
    marginTop: -16, ...SHADOW.md, gap: SPACING.sm,
  },
  quickAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  quickAvatarText: { color: COLORS.white, fontWeight: '700' },
  quickPlaceholder: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  filterScroll: { backgroundColor: COLORS.background, maxHeight: 56, marginTop: SPACING.sm },
  filterContent: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: 'center', paddingBottom: SPACING.sm },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full,
    backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white },

  postCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm, ...SHADOW.sm, overflow: 'hidden',
  },
  postCardPinned: { borderWidth: 1.5, borderColor: COLORS.primary + '40' },
  pinnedBar: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#F0EEFF', paddingHorizontal: SPACING.md, paddingVertical: 6,
  },
  pinnedText: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, paddingBottom: SPACING.sm },
  postAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  postAvatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  postAuthor: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  postFlat: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  catBadgeText: { fontSize: 10, fontWeight: '700' },
  postContent: {
    fontSize: FONTS.sizes.md, color: COLORS.textPrimary, lineHeight: 22,
    paddingHorizontal: SPACING.md, paddingBottom: SPACING.md,
  },
  postActions: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: SPACING.sm,
  },
  actionCount: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.lg, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg,
  },
  modalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary },
  postInput: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    padding: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.textPrimary,
    minHeight: 120, marginBottom: SPACING.md,
  },
  fieldLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  catChipText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  submitPost: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center',
  },
  submitPostText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
});
