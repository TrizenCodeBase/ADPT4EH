import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { api } from './api';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

const TaskPostingForm: React.FC = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we're on mobile web view
  useEffect(() => {
    const checkScreenSize = () => {
      if (Platform.OS === 'web') {
        const { width } = Dimensions.get('window');
        setIsMobileView(width <= 768);
      } else {
        setIsMobileView(true); // Always mobile layout on native mobile
      }
    };

    checkScreenSize();
    if (Platform.OS === 'web') {
      const subscription = Dimensions.addEventListener('change', checkScreenSize);
      return () => subscription?.remove();
    }
  }, []);

  const categories = [
    'Home Services', 'Delivery', 'Tech Help', 'Cleaning', 
    'Handyman', 'Gardening', 'Moving', 'Other'
  ];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission - Create task in database
      if (isSubmitting) return; // Prevent double submission
      
      try {
        setIsSubmitting(true);
        
        // Validate required fields
        if (!taskTitle || !taskDescription || !taskCategory || !location || !budget) {
          Alert.alert('Error', 'Please fill in all required fields');
          return;
        }

        // Prepare task data
        const coordinates = getCoordinatesFromAddress(location);
        const taskData = {
          type: taskCategory,
          description: `${taskTitle}\n\n${taskDescription}`,
          location: {
            lat: coordinates.lat,
            lng: coordinates.lng,
            address: location,
          },
          preferredTime: dueDate && dueTime ? `${dueDate} ${dueTime}` : null,
          budget: parseFloat(budget) || null,
          skillsRequired: getSkillsForCategory(taskCategory),
        };

        console.log('Creating task with data:', taskData);

        // Create task in database
        const createdTask = await api.createTask(taskData);
        
        console.log('Task created successfully:', createdTask);
        
        Alert.alert('Success', 'Task posted successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } catch (error) {
        console.error('Error creating task:', error);
        Alert.alert('Error', 'Failed to create task. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleImageUpload = () => {
    Alert.alert('Image Upload', 'Image upload functionality would be implemented here.');
  };

  // Simple function to get coordinates from address (placeholder implementation)
  const getCoordinatesFromAddress = (address: string) => {
    // TODO: Implement proper geocoding service (Google Maps, OpenStreetMap, etc.)
    // For now, return default coordinates
    return {
      lat: 17.375562271011905, // Default to Hyderabad coordinates
      lng: 78.48684327079734,
    };
  };

  // Function to get skills required based on task category
  const getSkillsForCategory = (category: string) => {
    const skillsMap: { [key: string]: string[] } = {
      'Home Services': ['home maintenance', 'repair', 'installation'],
      'Delivery': ['delivery', 'transportation', 'logistics'],
      'Tech Help': ['technology', 'computer repair', 'software'],
      'Cleaning': ['cleaning', 'housekeeping', 'sanitization'],
      'Handyman': ['repair', 'maintenance', 'construction'],
      'Gardening': ['gardening', 'landscaping', 'plant care'],
      'Moving': ['moving', 'packing', 'transportation'],
      'Other': ['general', 'assistance'],
    };
    return skillsMap[category] || ['general'];
  };

  const renderStep1 = () => (
    <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
      <Text style={isMobileView ? styles.mobileQuestion : styles.desktopQuestion}>
        What type of task is this?
      </Text>
      
      <View style={isMobileView ? styles.mobileCategoryGrid : styles.desktopCategoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              isMobileView ? styles.mobileCategoryButton : styles.desktopCategoryButton,
              taskCategory === category && (isMobileView ? styles.mobileCategoryButtonSelected : styles.desktopCategoryButtonSelected)
            ]}
            onPress={() => setTaskCategory(category)}
          >
            <Text style={[
              isMobileView ? styles.mobileCategoryText : styles.desktopCategoryText,
              taskCategory === category && (isMobileView ? styles.mobileCategoryTextSelected : styles.desktopCategoryTextSelected)
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>Task Title*</Text>
        <TextInput
          style={isMobileView ? styles.mobileInput : styles.desktopInput}
          placeholder="e.g., Replace a kitchen tap"
          value={taskTitle}
          onChangeText={setTaskTitle}
          placeholderTextColor="#999"
        />
      </View>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>Task Description*</Text>
        <TextInput
          style={isMobileView ? styles.mobileTextArea : styles.desktopTextArea}
          placeholder="Describe your task in detail..."
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
          numberOfLines={6}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
      <Text style={isMobileView ? styles.mobileQuestion : styles.desktopQuestion}>
        Location & Timing
      </Text>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>📍 Location*</Text>
        <TextInput
          style={isMobileView ? styles.mobileTextArea : styles.desktopTextArea}
          placeholder="Enter your address or location"
          value={location}
          onChangeText={setLocation}
          multiline
          numberOfLines={3}
          placeholderTextColor="#999"
        />
      </View>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>📅 Due Date</Text>
        <TextInput
          style={isMobileView ? styles.mobileInput : styles.desktopInput}
          placeholder="e.g., Before Wed, 23 Jul"
          value={dueDate}
          onChangeText={setDueDate}
          placeholderTextColor="#999"
        />
      </View>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>⏰ Preferred Time</Text>
        <TextInput
          style={isMobileView ? styles.mobileInput : styles.desktopInput}
          placeholder="e.g., Anytime, Morning, Afternoon"
          value={dueTime}
          onChangeText={setDueTime}
          placeholderTextColor="#999"
        />
      </View>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>📸 Add Photos (Optional)</Text>
        <TouchableOpacity 
          style={isMobileView ? styles.mobileImageUploadButton : styles.desktopImageUploadButton}
          onPress={handleImageUpload}
        >
          <Text style={isMobileView ? styles.mobileImageUploadText : styles.desktopImageUploadText}>
            📷 Upload Images
          </Text>
        </TouchableOpacity>
        {selectedImages.length > 0 && (
          <Text style={isMobileView ? styles.mobileImageCount : styles.desktopImageCount}>
            {selectedImages.length} image(s) selected
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
      <Text style={isMobileView ? styles.mobileQuestion : styles.desktopQuestion}>
        Set Your Budget
      </Text>

      <View style={isMobileView ? styles.mobileBudgetCard : styles.desktopBudgetCard}>
        <Text style={isMobileView ? styles.mobileBudgetLabel : styles.desktopBudgetLabel}>
          TASK BUDGET
        </Text>
        <View style={isMobileView ? styles.mobileBudgetInputContainer : styles.desktopBudgetInputContainer}>
          <Text style={isMobileView ? styles.mobileBudgetSymbol : styles.desktopBudgetSymbol}>₹</Text>
          <TextInput
            style={isMobileView ? styles.mobileBudgetInput : styles.desktopBudgetInput}
            placeholder="110"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={isMobileView ? styles.mobileSection : styles.desktopSection}>
        <Text style={isMobileView ? styles.mobileLabel : styles.desktopLabel}>Additional Notes</Text>
        <TextInput
          style={isMobileView ? styles.mobileTextArea : styles.desktopTextArea}
          placeholder="Any additional requirements or special instructions..."
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <View style={styles.mobileContainer}>
        {/* Header */}
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            style={styles.mobileBackButton}
            onPress={handleBack}
          >
            <Text style={styles.mobileBackIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.mobileTitle}>Create Task</Text>
          
          <View style={styles.mobileProgressContainer}>
            {[1, 2, 3].map((step) => (
              <View 
                key={step} 
                style={[
                  styles.mobileProgressDot, 
                  step === currentStep && styles.mobileProgressDotActive
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mobileScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mobileContentContainer}>
            {renderCurrentStep()}
          </View>
        </ScrollView>

        {/* Bottom Action Button */}
        <View style={styles.mobileBottomContainer}>
          <TouchableOpacity 
            style={[styles.mobileNextButton, isSubmitting && styles.mobileNextButtonDisabled]} 
            onPress={handleNext}
            disabled={isSubmitting}
          >
            <Text style={styles.mobileNextButtonText}>
              {isSubmitting ? 'Creating Task...' : (currentStep === 3 ? 'Post Task' : 'Next')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Desktop layout
  return (
    <View style={styles.desktopContainer}>
      {/* Header */}
      <View style={styles.desktopHeader}>
        <TouchableOpacity 
          style={styles.desktopBackButton}
          onPress={handleBack}
        >
          <Text style={styles.desktopBackIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.desktopTitle}>Create Task</Text>
        
        <View style={styles.desktopProgressContainer}>
          {[1, 2, 3].map((step) => (
            <View 
              key={step} 
              style={[
                styles.desktopProgressDot, 
                step === currentStep && styles.desktopProgressDotActive
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopContentContainer}>
          {renderCurrentStep()}
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.desktopBottomContainer}>
        <TouchableOpacity 
          style={[styles.desktopNextButton, isSubmitting && styles.desktopNextButtonDisabled]} 
          onPress={handleNext}
          disabled={isSubmitting}
        >
          <Text style={styles.desktopNextButtonText}>
            {isSubmitting ? 'Creating Task...' : (currentStep === 3 ? 'Post Task' : 'Next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Mobile styles
  mobileContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mobileHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mobileBackIcon: {
    fontSize: 20,
    color: '#000',
  },
  mobileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  mobileProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  mobileProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  mobileProgressDotActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  mobileScrollContent: {
    flex: 1,
  },
  mobileContentContainer: {
    padding: 20,
  },
  mobileSection: {
    marginBottom: 25,
  },
  mobileQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  mobileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  mobileCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mobileCategoryButton: {
    width: '48%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileCategoryButtonSelected: {
    backgroundColor: PRIMARY_YELLOW,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
  },
  mobileCategoryText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  mobileCategoryTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  mobileInput: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    minHeight: 45,
    minWidth: '60%',
  },
  mobileTextArea: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
    minWidth: '60%',
  },
  mobileImageUploadButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  mobileImageUploadText: {
    fontSize: 16,
    color: '#666',
  },
  mobileImageCount: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    marginTop: 8,
  },
  mobileBudgetCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  mobileBudgetLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  mobileBudgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileBudgetSymbol: {
    fontSize: 24,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    marginRight: 8,
  },
  mobileBudgetInput: {
    fontSize: 24,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    flex: 1,
    backgroundColor: 'transparent',
  },
  mobileBottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mobileNextButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileNextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileNextButtonDisabled: {
    opacity: 0.7,
  },

  // Desktop styles
  desktopContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopHeader: {
    paddingHorizontal: 60,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  desktopBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  desktopBackIcon: {
    fontSize: 20,
    color: '#000',
  },
  desktopTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
  },
  desktopProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  desktopProgressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  desktopProgressDotActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  desktopScrollContent: {
    flex: 1,
  },
  desktopContentContainer: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    padding: 80,
  },
  desktopSection: {
    marginBottom: 40,
  },
  desktopQuestion: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
  },
  desktopLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  desktopCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  desktopCategoryButton: {
    width: '47%',
    paddingVertical: 24,
    paddingHorizontal: 35,
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  desktopCategoryButtonSelected: {
    backgroundColor: PRIMARY_YELLOW,
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
  },
  desktopCategoryText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  desktopCategoryTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  desktopInput: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 50,
    width: '100%',
    maxWidth: 600,
  },
  desktopTextArea: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
    maxWidth: 600,
  },
  desktopImageUploadButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  desktopImageUploadText: {
    fontSize: 18,
    color: '#666',
  },
  desktopImageCount: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    marginTop: 12,
  },
  desktopBudgetCard: {
    backgroundColor: '#f8f9fa',
    padding: 50,
    borderRadius: 18,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  desktopBudgetLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontWeight: '600',
  },
  desktopBudgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopBudgetSymbol: {
    fontSize: 36,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    marginRight: 15,
  },
  desktopBudgetInput: {
    fontSize: 36,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    flex: 1,
    backgroundColor: 'transparent',
  },
  desktopBottomContainer: {
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  desktopNextButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingVertical: 24,
    paddingHorizontal: 60,
    borderRadius: 14,
    alignItems: 'center',
    maxWidth: 280,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  desktopNextButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
  desktopNextButtonDisabled: {
    opacity: 0.7,
  },
});

export default TaskPostingForm; 