import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { Task } from '../types/Task';

const { width } = Dimensions.get('window');

interface TaskDetailScreenProps {
  route: {
    params: {
      task: Task;
    };
  };
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route }) => {
  const { task } = route.params;
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const handleEditTask = () => {
    navigation.navigate('EditTask', { task });
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDeleteTask }
      ]
    );
  };

  const confirmDeleteTask = async () => {
    try {
      setLoading(true);
      await api.deleteTask(task._id);
      
      Alert.alert('Success', 'Task deleted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await api.updateTaskStatus(task._id, newStatus);
      
      Alert.alert('Success', 'Task status updated successfully');
      // Navigate back to refresh the task list
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}
          >
            <Text style={styles.statusText}>{task.status.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Title</Text>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        {/* Basic Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Budget</Text>
            <Text style={styles.infoValue}>₹{task.budget}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{task.category}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Urgency</Text>
            <Text style={styles.infoValue}>{task.urgency}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Priority</Text>
            <Text style={styles.infoValue}>{task.priority}</Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>{task.location?.address}</Text>
            <Text style={styles.locationText}>{task.location?.city}, {task.location?.state}</Text>
            <Text style={styles.locationText}>{task.location?.country}</Text>
          </View>
        </View>

        {/* Additional Details */}
        {task.estimatedDuration && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Duration</Text>
            <Text style={styles.detailText}>{task.estimatedDuration} hours</Text>
          </View>
        )}

        {task.requirements && task.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.tagsContainer}>
              {task.requirements.map((req, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {task.tags && task.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {task.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Timestamps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Posted:</Text>
              <Text style={styles.timelineValue}>{formatDate(task.createdAt)}</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Last Updated:</Text>
              <Text style={styles.timelineValue}>{formatDate(task.updatedAt)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEditTask}
          >
            <Text style={styles.actionButtonText}>Edit Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteTask}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.actionButtonText}>Delete Task</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Status Change Section */}
        {task.status === 'open' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={[styles.actionButton, styles.statusButton]}
              onPress={() => handleStatusChange('cancelled')}
            >
              <Text style={styles.actionButtonText}>Cancel Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationInfo: {
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  timeline: {
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timelineValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  statusButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskDetailScreen;
