import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useNavigation } from './SimpleNavigation';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563EB';
const DARK = '#111827';
const GRAY = '#6b7280';
const LIGHT_BG = '#f8fafc';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handle = () => setIsMobileView(window.innerWidth <= 768);
      handle();
      window.addEventListener('resize', handle);
      return () => window.removeEventListener('resize', handle);
    } else {
      setIsMobileView(true);
    }
  }, []);

  const conversations = useMemo(() => ([
    { id: 'c1', name: 'Alicia (Electrician)', lastMessage: 'I can come by 5 PM', time: '2:12 PM', unread: 2 },
    { id: 'c2', name: 'Ravi (Delivery)', lastMessage: 'Package picked up', time: '12:30 PM', unread: 0 },
    { id: 'c3', name: 'Meera (Cleaning)', lastMessage: 'Sharing photos now', time: 'Yesterday', unread: 0 },
  ]), []);

  const messages = useMemo(() => ([
    { id: 'm1', from: 'them', text: 'Hi! Is the router available today?', time: '2:03 PM' },
    { id: 'm2', from: 'me', text: 'Yes, please come around 5 PM if possible.', time: '2:05 PM' },
    { id: 'm3', from: 'them', text: 'Great, I will be there. Please share landmark.', time: '2:06 PM' },
    { id: 'm4', from: 'me', text: 'Apartment A, Gate 2, next to Community Hall.', time: '2:07 PM' },
  ]), []);

  const MessageBubble = ({ from, text, time }: { from: 'me' | 'them'; text: string; time: string }) => (
    <View style={[styles.messageRow, from === 'me' ? styles.messageRowRight : styles.messageRowLeft]}>
      <View style={[styles.bubble, from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, from === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem]}>{text}</Text>
        <Text style={[styles.timeText, from === 'me' ? styles.timeTextMe : styles.timeTextThem]}>{time}</Text>
      </View>
    </View>
  );

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ fontSize: 18, color: DARK }}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Chat</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  if (isMobileView) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.mobileContent}>
          <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 16 }}>
            {messages.map(m => (<MessageBubble key={m.id} from={m.from as any} text={m.text} time={m.time} />))}
          </ScrollView>
          <View style={styles.inputBar}>
            <TextInput style={styles.input} placeholder="Type a message" placeholderTextColor={GRAY} />
            <TouchableOpacity style={styles.sendBtn}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.desktopContent}>
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Conversations</Text>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 8 }}>
              {conversations.map(c => (
                <TouchableOpacity key={c.id} style={styles.convItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.convName}>{c.name}</Text>
                    <Text style={styles.convPreview} numberOfLines={1}>{c.lastMessage}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.convTime}>{c.time}</Text>
                    {c.unread > 0 && (
                      <View style={styles.unreadBadge}><Text style={styles.unreadText}>{c.unread}</Text></View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.chatPane}>
            <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 16 }}>
              {messages.map(m => (<MessageBubble key={m.id} from={m.from as any} text={m.text} time={m.time} />))}
            </ScrollView>
            <View style={styles.inputBar}>
              <TextInput style={styles.input} placeholder="Type a message" placeholderTextColor={GRAY} />
              <TouchableOpacity style={styles.sendBtn}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </div>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb'
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: DARK },

  // Desktop layout
  desktopContent: { flexDirection: 'row', height: 'calc(100vh - 56px)' as unknown as number },
  sidebar: { width: 320, borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  sidebarTitle: { paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: GRAY, fontWeight: '600' },
  convItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  convName: { fontSize: 15, fontWeight: '600', color: DARK },
  convPreview: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  convTime: { fontSize: 11, color: '#9ca3af' },
  unreadBadge: { backgroundColor: PRIMARY_BLUE, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 6 },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  chatPane: { flex: 1, backgroundColor: LIGHT_BG },
  messagesList: { flex: 1 },
  messageRow: { flexDirection: 'row', marginBottom: 12 },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  bubbleThem: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  bubbleMe: { backgroundColor: PRIMARY_YELLOW },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextThem: { color: DARK },
  bubbleTextMe: { color: '#111827', fontWeight: '600' },
  timeText: { fontSize: 11, marginTop: 4 },
  timeTextThem: { color: '#9ca3af' },
  timeTextMe: { color: '#111827' },

  // Mobile layout
  mobileContent: { flex: 1, backgroundColor: LIGHT_BG },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 14, backgroundColor: '#fff' },
  sendBtn: { marginLeft: 8, backgroundColor: PRIMARY_YELLOW, paddingHorizontal: 16, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#111827', fontWeight: '700' },
});

export default ChatScreen;