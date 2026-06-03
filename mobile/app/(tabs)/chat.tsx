// Chat screen — your main interface with Sage.
// Works in 3 modes: daily check-in, goal creation interview, and highlight reel.
// This is essentially a chat UI, similar to iMessage or WhatsApp.
import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Pressable, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useStore } from '../../store/useStore';
import { sendChat, getGoals, createGoal } from '../../services/api';

export default function Chat() {
  const { chatMessages, addMessage, clearChat, chatMode, setChatMode, setGoals } = useStore();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Greet the user when they first open the chat
  useEffect(() => {
    if (chatMessages.length === 0) {
      const greeting =
        chatMode === 'goal_setting'
          ? "Let's build a new goal together. First — what area of your life do you want to work on? (health, career, social, learning, money, mental health, or something else?)"
          : chatMode === 'highlight_reel'
          ? "Give me a moment to pull together your highlight reel..."
          : "Hey! How are things going? Pick a goal you want to check in on, or just tell me what's on your mind.";

      addMessage({ role: 'assistant', content: greeting });

      if (chatMode === 'highlight_reel') {
        generateHighlightReel();
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [chatMessages]);

  const generateHighlightReel = async () => {
    setIsSending(true);
    try {
      const res = await sendChat([], 'highlight_reel');
      addMessage({ role: 'assistant', content: res.reply });
    } catch (e) {
      addMessage({ role: 'assistant', content: "I had trouble generating your highlight reel. Try again in a moment." });
    } finally {
      setIsSending(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg = { role: 'user' as const, content: text };
    addMessage(userMsg);
    setInput('');
    setIsSending(true);

    try {
      const allMessages = [...chatMessages, userMsg];
      const res = await sendChat(allMessages, chatMode);
      addMessage({ role: 'assistant', content: res.reply });

      // If goal_setting mode returned structured goal data, save it automatically
      if (chatMode === 'goal_setting' && res.goal_data) {
        const data = res.goal_data as any;
        await createGoal({
          title: data.title,
          description: data.description,
          category: data.category,
          frequency: data.frequency,
          implementation_intention: data.implementation_intention,
        });

        // Create subgoals if any
        if (data.subgoals?.length) {
          const parent = await createGoal({ title: data.title, category: data.category });
          for (const sub of data.subgoals) {
            await createGoal({ ...sub, parent_goal_id: parent.id, category: data.category });
          }
        }

        const updated = await getGoals();
        setGoals(updated);
        addMessage({
          role: 'assistant',
          content: `I've saved that goal for you. You'll see it in your Goals tab. Let's check in on it daily — you've got this.`,
        });
        setChatMode('checkin');
      }
    } catch (e) {
      addMessage({ role: 'assistant', content: "Something went wrong. Check your connection and try again." });
    } finally {
      setIsSending(false);
    }
  };

  const startNewChat = (mode: typeof chatMode) => {
    clearChat();
    setChatMode(mode);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sage</Text>
          <Text style={styles.headerSub}>
            {chatMode === 'goal_setting' ? 'Goal creation' : chatMode === 'highlight_reel' ? 'Highlight reel' : 'Check-in'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.modeBtn} onPress={() => startNewChat('goal_setting')}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
          </Pressable>
          <Pressable style={styles.modeBtn} onPress={() => startNewChat('highlight_reel')}>
            <Ionicons name="sparkles-outline" size={20} color={Colors.warning} />
          </Pressable>
          <Pressable style={styles.modeBtn} onPress={() => startNewChat('checkin')}>
            <Ionicons name="refresh-outline" size={18} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {chatMessages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isSending && (
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.typingText}>Sage is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Message Sage..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={1000}
          onSubmitEditing={send}
        />
        <Pressable
          style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!input.trim() || isSending}
        >
          <Ionicons name="send" size={18} color={Colors.text} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: { role: string; content: string } }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleSage]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  headerSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 4 },
  modeBtn: { padding: 8 },

  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },

  bubbleRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  bubbleRowUser: { justifyContent: 'flex-end' },

  avatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.primary, alignItems: 'center',
    justifyContent: 'center', marginRight: 8,
  },
  avatarText: { color: Colors.text, fontSize: 13, fontWeight: '700' },

  bubble: {
    maxWidth: '78%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10,
  },
  bubbleSage: { backgroundColor: Colors.surfaceElevated, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleText: { color: Colors.text, fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#fff' },

  typingBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surfaceElevated, borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 10,
    alignSelf: 'flex-start', marginBottom: 14,
  },
  typingText: { color: Colors.textSecondary, fontSize: 13 },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 12, borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, color: Colors.text,
    fontSize: 15, maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: Colors.primary, width: 40, height: 40,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
