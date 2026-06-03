// Profile screen — XP history, achievements, and persona settings.
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useStore } from '../../store/useStore';

const BADGES = [
  { key: 'first_step', label: 'First Step', icon: 'footsteps-outline', desc: 'Complete your first check-in' },
  { key: 'streak_7', label: '7-Day Warrior', icon: 'flame-outline', desc: '7-day streak on any habit' },
  { key: 'deep_dive', label: 'Deep Dive', icon: 'book-outline', desc: 'Submit a 100+ word check-in' },
  { key: 'long_game', label: 'Long Game', icon: 'time-outline', desc: 'Maintain a goal for 66+ days' },
  { key: 'mind_body', label: 'Mind & Body', icon: 'body-outline', desc: 'Active goals in Health + Mental Health' },
  { key: 'built_different', label: 'Built Different', icon: 'trophy-outline', desc: 'Reach Level 10' },
  { key: 'full_life', label: 'The Full Life', icon: 'globe-outline', desc: 'Active goals in 5+ categories' },
];

const PERSONA_STYLES = [
  { key: 'supportive_friend', label: 'Supportive Friend', icon: 'heart-outline' },
  { key: 'hype_man', label: 'Hype Man', icon: 'megaphone-outline' },
  { key: 'strict_coach', label: 'Strict Coach', icon: 'barbell-outline' },
  { key: 'therapist_mode', label: 'Therapist Mode', icon: 'medical-outline' },
  { key: 'just_the_facts', label: 'Just the Facts', icon: 'stats-chart-outline' },
];

export default function Profile() {
  const { stats } = useStore();
  const level = stats?.level;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      {/* Level Card */}
      <View style={styles.levelCard}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level?.level ?? 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.levelTitle}>{level?.title ?? 'Beginner'}</Text>
          <Text style={styles.levelXP}>{level?.current_xp ?? 0} total XP</Text>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${(level?.progress ?? 0) * 100}%` as any }]} />
          </View>
          <Text style={styles.xpNext}>{level?.xp_to_next ?? 100} XP to next level</Text>
        </View>
      </View>

      {/* Highlight Reel Button */}
      <Pressable
        style={styles.highlightBtn}
        onPress={() => {
          useStore.getState().setChatMode('highlight_reel');
          useStore.getState().clearChat();
          router.push('/(tabs)/chat');
        }}
      >
        <Ionicons name="sparkles" size={18} color={Colors.warning} />
        <Text style={styles.highlightBtnText}>Generate Highlight Reel</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </Pressable>

      {/* Persona */}
      <Text style={styles.sectionTitle}>Coaching Style</Text>
      <View style={styles.personaGrid}>
        {PERSONA_STYLES.map((p) => (
          <View key={p.key} style={styles.personaChip}>
            <Ionicons name={p.icon as any} size={14} color={Colors.textSecondary} />
            <Text style={styles.personaLabel}>{p.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.personaNote}>
        Tell Sage in chat how you want to be coached — it will adapt over time.
      </Text>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>Achievements</Text>
      {BADGES.map((badge) => (
        <View key={badge.key} style={styles.badgeRow}>
          <View style={styles.badgeIcon}>
            <Ionicons name={badge.icon as any} size={20} color={Colors.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeLabel}>{badge.label}</Text>
            <Text style={styles.badgeDesc}>{badge.desc}</Text>
          </View>
          <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { color: Colors.text, fontSize: 28, fontWeight: '800', marginBottom: 24 },

  levelCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: Colors.border,
  },
  levelBadge: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  levelNumber: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  levelTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  levelXP: { color: Colors.primary, fontSize: 12, marginBottom: 8 },
  xpBarBg: { height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  xpBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  xpNext: { color: Colors.textMuted, fontSize: 11 },

  highlightBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 28, borderWidth: 1, borderColor: Colors.border,
  },
  highlightBtnText: { flex: 1, color: Colors.text, fontWeight: '600', fontSize: 14 },

  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  personaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  personaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surface, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: Colors.border,
  },
  personaLabel: { color: Colors.textSecondary, fontSize: 12 },
  personaNote: { color: Colors.textMuted, fontSize: 12, marginBottom: 28, lineHeight: 18 },

  badgeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
    opacity: 0.6,
  },
  badgeIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center',
  },
  badgeLabel: { color: Colors.text, fontSize: 13, fontWeight: '600' },
  badgeDesc: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
});
