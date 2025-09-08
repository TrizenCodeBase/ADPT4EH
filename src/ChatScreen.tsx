import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { api } from './api';
import { auth } from './firebase';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563EB';
const DARK = '#111827';
const GRAY = '#6b7280';
const LIGHT_BG = '#f8fafc';

interface Conversation {
  _id: string;
  chatId: string;
  otherParticipant: {
    uid: string;
    name: string;
    roles: string[];
    userType: string;
  };
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  chatId: string;
  text: string;
  senderId: string;
  type: string;
  status: string;
  createdAt: string;
  readBy: Array<{
    userId: string;
    readAt: string;
  }>;
}

// Helper function to format time
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short' 
    });
  }
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [showUserResults, setShowUserResults] = useState(false);

  // Load current user and chats
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Please log in to access chat');
        navigation.navigate('Login');
        return;
      }
      setCurrentUser(user);
      
      // Load chats
      const chatsResponse = await api.getChats();
      if (chatsResponse.success) {
        setConversations(chatsResponse.chats);
        // Don't automatically set activeId - let user choose from list
        // if (chatsResponse.chats.length > 0 && !activeId) {
        //   setActiveId(chatsResponse.chats[0].chatId);
        // }
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [activeId, navigation]);

  // Load messages for active chat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const messagesResponse = await api.getChatMessages(chatId);
      if (messagesResponse.success) {
        setMessages(messagesResponse.messages);
        // Mark as read
        await api.markChatAsRead(chatId);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId, loadMessages]);

  // Debounced user search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchUsers(query);
      } else {
        setUserSearchResults([]);
        setShowUserResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

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

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c => 
      c.otherParticipant.name.toLowerCase().includes(q) ||
      c.otherParticipant.roles.some(role => role.toLowerCase().includes(q)) ||
      c.lastMessage?.text.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const handleSend = async () => {
    if (!draft.trim() || !activeId || sending) return;
    
    try {
      setSending(true);
      const response = await api.sendMessage(activeId, draft.trim());
      
      if (response.success) {
        // Add message to local state immediately for better UX
        const newMessage = response.message;
        setMessages(prev => [...prev, newMessage]);
        setDraft('');
        
        // Refresh conversations to update last message
        loadData();
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Search users inline
  const searchUsers = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setUserSearchResults([]);
      setShowUserResults(false);
      return;
    }
    
    try {
      setSearchingUsers(true);
      const response = await api.searchUsers(searchQuery.trim());
      
      if (response.success) {
        setUserSearchResults(response.users);
        setShowUserResults(true);
      } else {
        setUserSearchResults([]);
        setShowUserResults(false);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setUserSearchResults([]);
      setShowUserResults(false);
    } finally {
      setSearchingUsers(false);
    }
  }, []);

  // Start chat with user
  const startChatWithUser = async (user: any) => {
    try {
      const response = await api.startChat(user.uid);
      
      if (response.success) {
        // Clear search and switch to the new chat
        setQuery('');
        setUserSearchResults([]);
        setShowUserResults(false);
        setActiveId(response.chat.chatId);
        
        // Refresh conversations
        loadData();
        
        Alert.alert('Success', `Started chat with ${user.name}`);
      } else {
        Alert.alert('Error', 'Failed to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isMe = message.senderId === currentUser?.uid;
    const time = formatTime(message.createdAt);
    
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowRight : styles.messageRowLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
            {message.text}
          </Text>
          <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextThem]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  const Header = ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack ? onBack : () => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ fontSize: 18, color: DARK }}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  if (isMobileView) {
    // Mobile: show list with search; tap to open chat; back to list
    const activeConv = conversations.find(c => c.chatId === activeId);
    const showList = activeId === '';

    return (
      <View style={styles.container}>
        <Header 
          title={showList ? 'Chats' : activeConv?.otherParticipant?.name || 'Chat'} 
          onBack={showList ? undefined : () => setActiveId('')} 
        />
        {showList ? (
          <View style={styles.mobileListContainer}>
            <View style={styles.searchBar}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search chats or start new chat..."
                placeholderTextColor={GRAY}
                style={styles.searchInput}
              />
            </View>
            <ScrollView style={{ flex: 1 }}>
              {/* User Search Results */}
              {showUserResults && (
                <View style={styles.userSearchSection}>
                  <Text style={styles.userSearchTitle}>Start New Chat</Text>
                  {searchingUsers ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>Searching users...</Text>
                    </View>
                  ) : userSearchResults.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>No users found</Text>
                    </View>
                  ) : (
                    userSearchResults.map(user => (
                      <TouchableOpacity
                        key={user.uid}
                        style={styles.userItem}
                        onPress={() => startChatWithUser(user)}
                      >
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{user.name}</Text>
                          <Text style={styles.userDetails}>
                            {user.roles.join(', ')} • {user.email}
                          </Text>
                          {user.rating > 0 && (
                            <Text style={styles.userRating}>
                              ⭐ {user.rating.toFixed(1)} ({user.totalReviews} reviews)
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.startChatBtn}
                          onPress={() => startChatWithUser(user)}
                        >
                          <Text style={styles.startChatBtnText}>Chat</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
              
              {/* Existing Chats */}
              {!showUserResults && (
                <>
                  {loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>Loading chats...</Text>
                    </View>
                  ) : filteredConversations.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>No chats found</Text>
                    </View>
                  ) : (
                    filteredConversations.map(c => (
                      <TouchableOpacity 
                        key={c.chatId} 
                        style={[styles.convItem, activeId === c.chatId && styles.convItemActive]} 
                        onPress={() => setActiveId(c.chatId)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.convName}>
                            {c.otherParticipant.name} ({c.otherParticipant.roles.join(', ')})
                          </Text>
                          <Text style={styles.convPreview} numberOfLines={1}>
                            {c.lastMessage?.text || 'No messages yet'}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.convTime}>
                            {c.lastMessage ? formatTime(c.lastMessage.timestamp) : ''}
                          </Text>
                          {c.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                              <Text style={styles.unreadText}>{c.unreadCount}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </>
              )}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.mobileContent}>
            <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 16 }}>
              {messages.map(m => (<MessageBubble key={m._id} message={m} />))}
            </ScrollView>
            <View style={styles.inputBar}>
              <TextInput 
                value={draft} 
                onChangeText={setDraft} 
                style={styles.input} 
                placeholder="Type a message" 
                placeholderTextColor={GRAY}
                editable={!sending}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, sending && styles.sendBtnDisabled]} 
                onPress={handleSend}
                disabled={sending}
              >
                <Text style={styles.sendText}>{sending ? 'Sending...' : 'Send'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  // Desktop view
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <View style={styles.container}>
        <Header title="Chat" />
        <View style={styles.desktopContent}>
          <View style={styles.sidebar}>
            <View style={styles.searchBarDesktop}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search chats or start new chat..."
                placeholderTextColor={GRAY}
                style={styles.searchInput}
              />
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 8 }}>
              {/* User Search Results */}
              {showUserResults && (
                <View style={styles.userSearchSection}>
                  <Text style={styles.userSearchTitle}>Start New Chat</Text>
                  {searchingUsers ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>Searching users...</Text>
                    </View>
                  ) : userSearchResults.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>No users found</Text>
                    </View>
                  ) : (
                    userSearchResults.map(user => (
                      <TouchableOpacity
                        key={user.uid}
                        style={styles.userItem}
                        onPress={() => startChatWithUser(user)}
                      >
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{user.name}</Text>
                          <Text style={styles.userDetails}>
                            {user.roles.join(', ')} • {user.email}
                          </Text>
                          {user.rating > 0 && (
                            <Text style={styles.userRating}>
                              ⭐ {user.rating.toFixed(1)} ({user.totalReviews} reviews)
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.startChatBtn}
                          onPress={() => startChatWithUser(user)}
                        >
                          <Text style={styles.startChatBtnText}>Chat</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
              
              {/* Existing Chats */}
              {!showUserResults && (
                <>
                  {loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>Loading chats...</Text>
                    </View>
                  ) : filteredConversations.length === 0 ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: GRAY }}>No chats found</Text>
                    </View>
                  ) : (
                    filteredConversations.map(c => (
                      <TouchableOpacity 
                        key={c.chatId} 
                        style={[styles.convItem, c.chatId === activeId && styles.convItemActive]} 
                        onPress={() => setActiveId(c.chatId)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.convName}>
                            {c.otherParticipant.name} ({c.otherParticipant.roles.join(', ')})
                          </Text>
                          <Text style={styles.convPreview} numberOfLines={1}>
                            {c.lastMessage?.text || 'No messages yet'}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.convTime}>
                            {c.lastMessage ? formatTime(c.lastMessage.timestamp) : ''}
                          </Text>
                          {c.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                              <Text style={styles.unreadText}>{c.unreadCount}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </>
              )}
            </ScrollView>
          </View>

          <View style={styles.chatPane}>
            {activeId ? (
              <>
                <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 16 }}>
                  {messages.map(m => (<MessageBubble key={m._id} message={m} />))}
                </ScrollView>
                <View style={styles.inputBar}>
                  <TextInput 
                    value={draft} 
                    onChangeText={setDraft} 
                    style={styles.input} 
                    placeholder="Type a message" 
                    placeholderTextColor={GRAY}
                    editable={!sending}
                  />
                  <TouchableOpacity 
                    style={[styles.sendBtn, sending && styles.sendBtnDisabled]} 
                    onPress={handleSend}
                    disabled={sending}
                  >
                    <Text style={styles.sendText}>{sending ? 'Sending...' : 'Send'}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptyChatState}>
                <Text style={styles.emptyChatText}>Select a chat to start messaging</Text>
                <Text style={styles.emptyChatSubtext}>Or search for users to start a new conversation</Text>
              </View>
            )}
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
  searchBarDesktop: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  searchBar: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  searchInput: { height: 40, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#fff' },
  sidebarTitle: { paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: GRAY, fontWeight: '600' },
  convItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  convItemActive: { backgroundColor: '#f9fafb' },
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
  mobileListContainer: { flex: 1, backgroundColor: '#fff' },
  mobileContent: { flex: 1, backgroundColor: LIGHT_BG },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 14, backgroundColor: '#fff' },
  sendBtn: { marginLeft: 8, backgroundColor: PRIMARY_YELLOW, paddingHorizontal: 16, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#111827', fontWeight: '700' },
  sendBtnDisabled: { backgroundColor: GRAY },
  convItemActive: { backgroundColor: '#f3f4f6' },
  
  // User search section
  userSearchSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userSearchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  
  // User item styles
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 13,
    color: GRAY,
    marginBottom: 2,
  },
  userRating: {
    fontSize: 12,
    color: PRIMARY_YELLOW,
  },
  startChatBtn: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  startChatBtnText: {
    color: DARK,
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Empty chat state
  emptyChatState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyChatText: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyChatSubtext: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
  },
});

export default ChatScreen;