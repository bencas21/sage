// Dashboard — first thing you see when you open the app.
// Shows Life Score, XP level, streaks, and active goal cards.
import { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useStore } from '../../store/useStore';
import { getDashboard } from '../../services/api';

export default function Dashboard() {
  const { stats, setStats, isLoading, setLoading } = useStore();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (isLoading && !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor={Colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good work today 👋</Text>
        <Text style={styles.appName}>Sage</Text>
      </View>

      {/* Life Score Card */}
      <View style={styles.lifeScoreCard}>
        <Text style={styles.lifeScoreLabel}>LIFE SCORE</Text>
        <Text style={styles.lifeScoreValue}>{stats?.life_score ?? '--'}</Text>
        <Text style={styles.lifeScoreSubtext}>out of 100</Text>
      </View>

      {/* XP Level Bar */}
      {stats?.level && (
        <View style={styles.card}>
          <View style={styles.levelRow}>
            <Text style={styles.levelTitle}>Level {stats.level.level} — {stats.level.title}</Text>
            <Text style={styles.xpText}>{stats.level.current_xp} XP</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${stats.level.progress * 100}%` as any }]} />
          </View>
          <Text style={styles.xpNext}>{stats.level.xp_to_next} XP to next level</Text>
        </View>
      )}

      {/* Stats Row */}
      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.round((stats.completion_7d ?? 0) * 100)}%</Text>
            <Text style={styles.statLabel}>7-day rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.round((stats.completion_30d ?? 0) * 100)}%</Text>
            <Text style={styles.statLabel}>30-day rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.total_streak_days}</Text>
            <Text style={styles.statLabel}>streak days</Text>
          </View>
        </View>
      )}

      {/* Active Goals */}
      <Text style={styles.sectionTitle}>Active Goals</Text>
      {!stats?.active_goals?.length ? (
        <View style={styles.emptyCard}>
          <Ionicons name="flag-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No active goals yet</Text>
          <Text style={styles.emptySubtext}>Go to Goals tab to create your first one</Text>
        </View>
      ) : (
        stats.active_goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))
      )}
    </ScrollView>
  );
}

function GoalCard({ goal }: { goal: any }) {
  const categoryColor = (Colors.categories as any)[goal.category] ?? Colors.primary;
  const recentDays = goal.recent_checkins?.slice(0, 7) ?? [];

  return (
    <View style={styles.goalCard}>
      <View style={styles.goalCardHeader}>
        <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
        <Text style={styles.goalTitle} numberOfLines={1}>{goal.title}</Text>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={12} color={Colors.warning} />
          <Text style={styles.streakText}>{goal.streak}</Text>
        </View>
      </View>

      {/* Mini 7-day completion dots */}
      <View style={styles.dotRow}>
        {Array.from({ length: 7 }, (_, i) => {
          const day = recentDays[i];
          return (
            <View
              key={i}
              style={[
                styles.dot,
                day?.completed && { backgroundColor: categoryColor },
                !day && styles.dotFuture,
              ]}
            />
          );
        })}
        <Text style={styles.dotLabel}>last 7 days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  center: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { color: Colors.textSecondary, fontSize: 14 },
  appName: { color: Colors.primary, fontSize: 18, fontWeight: '700' },

  lifeScoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lifeScoreLabel: { color: Colors.textMuted, fontSize: 11, letterSpacing: 2, marginBottom: 8 },
  lifeScoreValue: { color: Colors.text, fontSize: 72, fontWeight: '800', lineHeight: 80 },
  lifeScoreSubtext: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  levelTitle: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  xpText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  xpBarBg: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  xpNext: { color: Colors.textMuted, fontSize: 11, marginTop: 6 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 4, letterSpacing: 0.5 },

  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  goalCard: {
    backgroundColor: Colors.surface, borderRadius: 14,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
  },
  goalCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  goalTitle: { flex: 1, color: Colors.text, fontSize: 14, fontWeight: '600' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  streakText: { color: Colors.warning, fontSize: 13, fontWeight: '700' },

  dotRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  dotFuture: { opacity: 0.3 },
  dotLabel: { color: Colors.textMuted, fontSize: 10, marginLeft: 6 },

  emptyCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  emptyText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '600', marginTop: 12 },
  emptySubtext: { color: Colors.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center' },
});
