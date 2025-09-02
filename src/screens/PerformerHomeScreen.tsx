import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api';
import { Task } from '../types/Task';
import MyTasksScreen from './MyTasksScreen';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PerformerHomeScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'available' | 'my-tasks'>('available');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Monitor activeTab changes
  useEffect(() => {
    console.log('🔍 PerformerHomeScreen: activeTab changed to:', activeTab);
  }, [activeTab]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.getTasks({ status: 'open', limit: 50 });
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'available') {
      await fetchTasks();
    }
    setRefreshing(false);
  };

  const handleTaskPress = (task: Task) => {
    // Navigate to task details screen
    navigation.navigate('TaskDetail', { task });
  };

  const renderTaskItem = ({ item: task }: { item: Task }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => handleTaskPress(task)}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={styles.statusText}>{task.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.taskDescription} numberOfLines={2}>
        {task.description}
      </Text>
      
      <View style={styles.taskDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Budget:</Text>
          <Text style={styles.detailValue}>₹{task.budget}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{task.location?.city || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{task.category}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Posted:</Text>
          <Text style={styles.detailValue}>
            {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.taskActions}>
        <TouchableOpacity style={styles.openButton}>
          <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#4CAF50';
      case 'assigned': return '#2196F3';
      case 'in_progress': return '#FF9800';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderTabContent = () => {
    console.log('🔍 PerformerHomeScreen: renderTabContent called');
    console.log('🔍 PerformerHomeScreen: Active tab:', activeTab);
    console.log('🔍 PerformerHomeScreen: activeTab === "my-tasks":', activeTab === 'my-tasks');
    
    if (activeTab === 'my-tasks') {
      console.log('🔍 PerformerHomeScreen: Rendering MyTasksScreen');
      return <MyTasksScreen />;
    }

    console.log('🔍 PerformerHomeScreen: Rendering Available Tasks, count:', tasks.length);
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading available tasks...</Text>
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No tasks available</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new tasks
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Debug Header */}
      <View style={styles.debugHeader}>
        <Text style={styles.debugText}>🔍 Active Tab: {activeTab} | Available Tasks Count: {tasks.length}</Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => {
            console.log('🔍 Tab clicked: Available Tasks');
            setActiveTab('available');
            console.log('🔍 Active tab set to: available');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available Tasks
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-tasks' && styles.activeTab]}
          onPress={() => {
            console.log('🔍 Tab clicked: My Tasks');
            setActiveTab('my-tasks');
            console.log('🔍 Active tab set to: my-tasks');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'my-tasks' && styles.activeTabText]}>
            My Tasks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  debugHeader: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 14,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  taskList: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  taskDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  taskActions: {
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  openButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PerformerHomeScreen;
