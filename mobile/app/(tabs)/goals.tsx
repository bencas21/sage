// Goals screen — lists active goals and lets you create new ones
// via an AI-guided interview in the Chat tab.
import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Pressable, RefreshControl, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useStore } from '../../store/useStore';
import { getGoals, updateGoalStatus, Goal } from '../../services/api';

export default function Goals() {
  const { goals, setGoals } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleComplete = (goal: Goal) => {
    Alert.alert(
      'Complete this goal?',
      `Mark "${goal.title}" as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete ✓',
          onPress: async () => {
            await updateGoalStatus(goal.id, 'completed');
            load();
          },
        },
      ]
    );
  };

  // Group goals by parent — top-level goals first, then subgoals
  const topLevel = goals.filter(g => !g.parent_goal_id);
  const subgoalsOf = (id: string) => goals.filter(g => g.parent_goal_id === id);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} tintColor={Colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        {/* Tapping + opens Chat in goal_setting mode */}
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            useStore.getState().setChatMode('goal_setting');
            useStore.getState().clearChat();
            router.push('/(tabs)/chat');
          }}
        >
          <Ionicons name="add" size={22} color={Colors.text} />
        </Pressable>
      </View>

      {topLevel.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="flag-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No goals yet</Text>
          <Text style={styles.emptySubtext}>
            Tap + to let Sage help you create your first goal.
            {'\n'}It'll interview you and build something specific.
          </Text>
          <Pressable
            style={styles.createBtn}
            onPress={() => {
              useStore.getState().setChatMode('goal_setting');
              useStore.getState().clearChat();
              router.push('/(tabs)/chat');
            }}
          >
            <Text style={styles.createBtnText}>Create a goal with Sage</Text>
          </Pressable>
        </View>
      ) : (
        topLevel.map((goal) => (
          <View key={goal.id}>
            <GoalRow goal={goal} onComplete={handleComplete} isSubgoal={false} />
            {subgoalsOf(goal.id).map((sub) => (
              <GoalRow key={sub.id} goal={sub} onComplete={handleComplete} isSubgoal />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function GoalRow({ goal, onComplete, isSubgoal }: { goal: Goal; onComplete: (g: Goal) => void; isSubgoal: boolean }) {
  const categoryColor = (Colors.categories as any)[goal.category] ?? Colors.primary;

  return (
    <View style={[styles.goalRow, isSubgoal && styles.subgoalRow]}>
      {isSubgoal && <View style={styles.subgoalLine} />}
      <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />
      <View style={styles.goalInfo}>
        <Text style={styles.goalTitle} numberOfLines={2}>{goal.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.categoryTag}>{goal.category.replace('_', ' ')}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.frequencyTag}>{goal.frequency}</Text>
        </View>
        {goal.implementation_intention && (
          <Text style={styles.intention} numberOfLines={2}>
            "{goal.implementation_intention}"
          </Text>
        )}
      </View>
      <Pressable onPress={() => onComplete(goal)} style={styles.checkBtn}>
        <Ionicons name="checkmark-circle-outline" size={26} color={Colors.success} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: Colors.text, fontSize: 28, fontWeight: '800' },
  addBtn: {
    backgroundColor: Colors.primary, width: 36, height: 36,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },

  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubtext: { color: Colors.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 21 },
  createBtn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12, marginTop: 24,
  },
  createBtnText: { color: Colors.text, fontWeight: '700', fontSize: 15 },

  goalRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.surface, borderRadius: 14,
    marginBottom: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border,
  },
  subgoalRow: { marginLeft: 20, marginBottom: 8 },
  subgoalLine: {
    position: 'absolute', left: -12, top: 0, bottom: 0,
    width: 2, backgroundColor: Colors.border,
  },
  categoryBar: { width: 4, alignSelf: 'stretch' },
  goalInfo: { flex: 1, padding: 12 },
  goalTitle: { color: Colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryTag: { color: Colors.textMuted, fontSize: 11, textTransform: 'capitalize' },
  dot: { color: Colors.textMuted, fontSize: 11 },
  frequencyTag: { color: Colors.textMuted, fontSize: 11 },
  intention: { color: Colors.textSecondary, fontSize: 11, marginTop: 6, fontStyle: 'italic' },
  checkBtn: { padding: 12, justifyContent: 'center' },
});
