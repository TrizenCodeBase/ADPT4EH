import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { api } from '../api';
import { Task } from '../types/Task';

interface EditTaskScreenProps {
  route: {
    params: {
      task: Task;
    };
  };
  navigation: any;
}

const EditTaskScreen: React.FC<EditTaskScreenProps> = ({ route, navigation }) => {
  const { task } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    budget: task.budget.toString(),
    category: task.category,
    urgency: task.urgency,
    priority: task.priority,
    estimatedDuration: task.estimatedDuration?.toString() || '',
    requirements: task.requirements?.join(', ') || '',
    tags: task.tags?.join(', ') || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Description is required');
      return false;
    }
    if (!formData.budget || isNaN(Number(formData.budget))) {
      Alert.alert('Error', 'Valid budget is required');
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: Number(formData.budget),
        category: formData.category.trim(),
        urgency: formData.urgency as 'low' | 'medium' | 'high' | 'urgent',
        priority: formData.priority as 'low' | 'normal' | 'high',
        estimatedDuration: formData.estimatedDuration ? Number(formData.estimatedDuration) : undefined,
        requirements: formData.requirements.trim() ? formData.requirements.split(',').map(r => r.trim()) : [],
        tags: formData.tags.trim() ? formData.tags.split(',').map(t => t.trim()) : [],
      };

      await api.updateTask(task._id, updateData);
      
      Alert.alert('Success', 'Task updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Task</Text>
        <Text style={styles.headerSubtitle}>Update your task details</Text>
      </View>

      <View style={styles.form}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholder="Enter task title"
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe your task in detail"
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget (₹) *</Text>
          <TextInput
            style={styles.input}
            value={formData.budget}
            onChangeText={(value) => handleInputChange('budget', value)}
            placeholder="Enter budget amount"
            keyboardType="numeric"
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(value) => handleInputChange('category', value)}
            placeholder="e.g., cleaning, repair, assembly"
          />
        </View>

        {/* Urgency */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Urgency</Text>
          <View style={styles.radioGroup}>
            {['low', 'medium', 'high', 'urgent'].map((urgency) => (
              <TouchableOpacity
                key={urgency}
                style={[
                  styles.radioButton,
                  formData.urgency === urgency && styles.radioButtonActive
                ]}
                onPress={() => handleInputChange('urgency', urgency)}
              >
                <Text style={[
                  styles.radioButtonText,
                  formData.urgency === urgency && styles.radioButtonTextActive
                ]}>
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.radioGroup}>
            {['low', 'normal', 'high'].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.radioButton,
                  formData.priority === priority && styles.radioButtonActive
                ]}
                onPress={() => handleInputChange('priority', priority)}
              >
                <Text style={[
                  styles.radioButtonText,
                  formData.priority === priority && styles.radioButtonTextActive
                ]}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estimated Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estimated Duration (hours)</Text>
          <TextInput
            style={styles.input}
            value={formData.estimatedDuration}
            onChangeText={(value) => handleInputChange('estimatedDuration', value)}
            placeholder="e.g., 2"
            keyboardType="numeric"
          />
        </View>

        {/* Requirements */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Requirements (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.requirements}
            onChangeText={(value) => handleInputChange('requirements', value)}
            placeholder="e.g., tools, experience, materials"
          />
        </View>

        {/* Tags */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={formData.tags}
            onChangeText={(value) => handleInputChange('tags', value)}
            placeholder="e.g., urgent, home, weekend"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Update Task</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  radioButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#666',
  },
  radioButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  actionButtons: {
    gap: 16,
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditTaskScreen;
