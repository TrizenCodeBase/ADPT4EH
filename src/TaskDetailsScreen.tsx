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

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

const TaskDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' or 'questions'
  const [questionText, setQuestionText] = useState('');
  
  // Mock task data
  const taskData = {
    title: 'Replace a kitchen tap',
    poster: 'Myint K.',
    postedTime: '7 minutes ago',
    location: 'Paradise SA, Australia',
    dueDate: 'Before Wed, 23 Jul',
    dueTime: 'Anytime',
    budget: '₹110',
    description: 'Replace a kitchen tap. Tap provided.',
    status: 'OPEN',
    images: [
      'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=New+Tap',
      'https://via.placeholder.com/300x200/7ED321/FFFFFF?text=Existing+Sink'
    ]
  };

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

  const handleMakeOffer = () => {
    navigation.navigate('MakeOfferDetails');
  };

  const handleFollow = () => {
    Alert.alert('Follow', 'Follow functionality would be implemented here.');
  };

  const handleSendQuestion = () => {
    if (questionText.trim()) {
      Alert.alert('Question Sent', 'Your question has been sent to the task poster.');
      setQuestionText('');
    }
  };

  const handleMoreOptions = () => {
    Alert.alert('More Options', 'More options functionality would be implemented here.');
  };

  const handleViewMap = () => {
    Alert.alert('View Map', 'Map view functionality would be implemented here.');
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <View style={styles.mobileContainer}>
        {/* Simple Header */}
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            style={styles.mobileBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.mobileBackIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.mobileHeaderTitle}>Task Details</Text>
          
          <TouchableOpacity style={styles.mobileShareButton}>
            <Text style={styles.mobileShareIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mobileScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mobileContentContainer}>
            
            {/* Status Badge */}
            <View style={styles.mobileStatusContainer}>
              <View style={styles.mobileStatusBadge}>
                <Text style={styles.mobileStatusText}>{taskData.status}</Text>
              </View>
            </View>

            {/* Task Title */}
            <Text style={styles.mobileTaskTitle}>{taskData.title}</Text>

            {/* Price and Make Offer Section */}
            <View style={styles.mobilePriceSection}>
              <View style={styles.mobilePriceContainer}>
                <Text style={styles.mobilePriceLabel}>Task Budget</Text>
                <Text style={styles.mobilePriceAmount}>{taskData.budget}</Text>
              </View>
              <TouchableOpacity style={styles.mobileMakeOfferButton} onPress={handleMakeOffer}>
                <Text style={styles.mobileMakeOfferText}>Make an offer</Text>
              </TouchableOpacity>
            </View>

            {/* Task Information Card */}
            <View style={styles.mobileInfoCard}>
              
              {/* Poster Information */}
              <View style={styles.mobileInfoSection}>
                <View style={styles.mobileInfoRow}>
                  <View style={styles.mobileInfoIcon}>
                    <View style={styles.mobilePosterAvatar}>
                      <Text style={styles.mobilePosterInitial}>M</Text>
                    </View>
                  </View>
                  <View style={styles.mobileInfoContent}>
                    <Text style={styles.mobileInfoLabel}>Posted by</Text>
                    <Text style={styles.mobileInfoValue}>{taskData.poster}</Text>
                    <Text style={styles.mobileInfoSubtext}>{taskData.postedTime}</Text>
                  </View>
                </View>
              </View>

              {/* Location */}
              <View style={styles.mobileInfoSection}>
                <View style={styles.mobileInfoRow}>
                  <View style={styles.mobileInfoIcon}>
                    <Text style={styles.mobileInfoIconText}>📍</Text>
                  </View>
                  <View style={styles.mobileInfoContent}>
                    <Text style={styles.mobileInfoLabel}>Location</Text>
                    <Text style={styles.mobileInfoValue}>{taskData.location}</Text>
                  </View>
                  <TouchableOpacity onPress={handleViewMap}>
                    <Text style={styles.mobileViewMapText}>View map</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Due Date */}
              <View style={styles.mobileInfoSection}>
                <View style={styles.mobileInfoRow}>
                  <View style={styles.mobileInfoIcon}>
                    <Text style={styles.mobileInfoIconText}>📅</Text>
                  </View>
                  <View style={styles.mobileInfoContent}>
                    <Text style={styles.mobileInfoLabel}>Due date</Text>
                    <Text style={styles.mobileInfoValue}>{taskData.dueDate}</Text>
                    <Text style={styles.mobileInfoSubtext}>{taskData.dueTime}</Text>
                  </View>
                </View>
              </View>

            </View>

            {/* Task Description */}
            <View style={styles.mobileDescriptionCard}>
              <Text style={styles.mobileDescriptionTitle}>What you need to do</Text>
              <Text style={styles.mobileDescriptionText}>{taskData.description}</Text>
            </View>

            {/* Task Images */}
            {taskData.images && taskData.images.length > 0 && (
              <View style={styles.mobileImagesCard}>
                <Text style={styles.mobileImagesTitle}>Photos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mobileImagesScroll}>
                  {taskData.images.map((image, index) => (
                    <View key={index} style={styles.mobileImageContainer}>
                      <View style={styles.mobileImagePlaceholder}>
                        <Text style={styles.mobileImageText}>Photo {index + 1}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.mobileActionButtons}>
              <TouchableOpacity style={styles.mobileFollowButton} onPress={handleFollow}>
                <Text style={styles.mobileFollowIcon}>❤️</Text>
                <Text style={styles.mobileFollowText}>Follow Task</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mobileReportButton}>
                <Text style={styles.mobileReportIcon}>🚩</Text>
                <Text style={styles.mobileReportText}>Report</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.mobileBottomSpacing} />

          </View>
        </ScrollView>

        {/* Bottom Tabs */}
        <View style={styles.mobileBottomTabs}>
          <TouchableOpacity 
            style={[
              styles.mobileTabButton, 
              activeTab === 'offers' && styles.mobileTabButtonActive
            ]}
            onPress={() => setActiveTab('offers')}
          >
            <Text style={[
              styles.mobileTabText,
              activeTab === 'offers' && styles.mobileTabTextActive
            ]}>
              Offers (0)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.mobileTabButton, 
              activeTab === 'questions' && styles.mobileTabButtonActive
            ]}
            onPress={() => setActiveTab('questions')}
          >
            <Text style={[
              styles.mobileTabText,
              activeTab === 'questions' && styles.mobileTabTextActive
            ]}>
              Questions (0)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question Input (when questions tab is active) */}
        {activeTab === 'questions' && (
          <View style={styles.mobileQuestionInput}>
            <View style={styles.mobileQuestionHeader}>
              <Text style={styles.mobileQuestionIcon}>👁️</Text>
              <Text style={styles.mobileQuestionDisclaimer}>
                These messages are public and can be seen by anyone. Do not share your personal info.
              </Text>
            </View>
            <View style={styles.mobileQuestionInputContainer}>
              <View style={styles.mobileQuestionAvatar}>
                <Text style={styles.mobileQuestionAvatarText}>U</Text>
              </View>
              <TextInput
                style={styles.mobileQuestionTextInput}
                placeholder="Ask a question"
                value={questionText}
                onChangeText={setQuestionText}
                multiline
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.mobileQuestionSendButton} onPress={handleSendQuestion}>
                <Text style={styles.mobileQuestionSendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.desktopBackIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.desktopHeaderTitle}>Task Details</Text>
        
        <TouchableOpacity style={styles.desktopShareButton}>
          <Text style={styles.desktopShareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopContentContainer}>
          
          {/* Status Badge */}
          <View style={styles.desktopStatusContainer}>
            <View style={styles.desktopStatusBadge}>
              <Text style={styles.desktopStatusText}>{taskData.status}</Text>
            </View>
          </View>

          {/* Task Title */}
          <Text style={styles.desktopTaskTitle}>{taskData.title}</Text>

          {/* Two Column Layout */}
          <View style={styles.desktopTwoColumn}>
            
            {/* Left Column - Task Information */}
            <View style={styles.desktopLeftColumn}>
              
              {/* Task Information Card */}
              <View style={styles.desktopInfoCard}>
                
                {/* Poster Information */}
                <View style={styles.desktopInfoSection}>
                  <View style={styles.desktopInfoRow}>
                    <View style={styles.desktopInfoIcon}>
                      <View style={styles.desktopPosterAvatar}>
                        <Text style={styles.desktopPosterInitial}>M</Text>
                      </View>
                    </View>
                    <View style={styles.desktopInfoContent}>
                      <Text style={styles.desktopInfoLabel}>Posted by</Text>
                      <Text style={styles.desktopInfoValue}>{taskData.poster}</Text>
                      <Text style={styles.desktopInfoSubtext}>{taskData.postedTime}</Text>
                    </View>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.desktopInfoSection}>
                  <View style={styles.desktopInfoRow}>
                    <View style={styles.desktopInfoIcon}>
                      <Text style={styles.desktopInfoIconText}>📍</Text>
                    </View>
                    <View style={styles.desktopInfoContent}>
                      <Text style={styles.desktopInfoLabel}>Location</Text>
                      <Text style={styles.desktopInfoValue}>{taskData.location}</Text>
                    </View>
                    <TouchableOpacity onPress={handleViewMap}>
                      <Text style={styles.desktopViewMapText}>View map</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Due Date */}
                <View style={styles.desktopInfoSection}>
                  <View style={styles.desktopInfoRow}>
                    <View style={styles.desktopInfoIcon}>
                      <Text style={styles.desktopInfoIconText}>📅</Text>
                    </View>
                    <View style={styles.desktopInfoContent}>
                      <Text style={styles.desktopInfoLabel}>Due date</Text>
                      <Text style={styles.desktopInfoValue}>{taskData.dueDate}</Text>
                      <Text style={styles.desktopInfoSubtext}>{taskData.dueTime}</Text>
                    </View>
                  </View>
                </View>

              </View>

              {/* Task Description */}
              <View style={styles.desktopDescriptionCard}>
                <Text style={styles.desktopDescriptionTitle}>What you need to do</Text>
                <Text style={styles.desktopDescriptionText}>{taskData.description}</Text>
              </View>

              {/* Task Images */}
              {taskData.images && taskData.images.length > 0 && (
                <View style={styles.desktopImagesCard}>
                  <Text style={styles.desktopImagesTitle}>Photos</Text>
                  <View style={styles.desktopImageGrid}>
                    {taskData.images.map((image, index) => (
                      <View key={index} style={styles.desktopImageContainer}>
                        <View style={styles.desktopImagePlaceholder}>
                          <Text style={styles.desktopImageText}>Photo {index + 1}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            </View>

            {/* Right Column - Price and Actions */}
            <View style={styles.desktopRightColumn}>
              
              {/* Price and Make Offer Section */}
              <View style={styles.desktopPriceCard}>
                <Text style={styles.desktopPriceLabel}>Task Budget</Text>
                <Text style={styles.desktopPriceAmount}>{taskData.budget}</Text>
                <TouchableOpacity style={styles.desktopMakeOfferButton} onPress={handleMakeOffer}>
                  <Text style={styles.desktopMakeOfferText}>Make an offer</Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.desktopActionButtons}>
                <TouchableOpacity style={styles.desktopFollowButton} onPress={handleFollow}>
                  <Text style={styles.desktopFollowIcon}>❤️</Text>
                  <Text style={styles.desktopFollowText}>Follow Task</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.desktopReportButton}>
                  <Text style={styles.desktopReportIcon}>🚩</Text>
                  <Text style={styles.desktopReportText}>Report</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>

          {/* Bottom Spacing */}
          <View style={styles.desktopBottomSpacing} />

        </View>
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.desktopBottomTabs}>
        <TouchableOpacity 
          style={[
            styles.desktopTabButton, 
            activeTab === 'offers' && styles.desktopTabButtonActive
          ]}
          onPress={() => setActiveTab('offers')}
        >
          <Text style={[
            styles.desktopTabText,
            activeTab === 'offers' && styles.desktopTabTextActive
          ]}>
            Offers (0)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.desktopTabButton, 
            activeTab === 'questions' && styles.desktopTabButtonActive
          ]}
          onPress={() => setActiveTab('questions')}
        >
          <Text style={[
            styles.desktopTabText,
            activeTab === 'questions' && styles.desktopTabTextActive
          ]}>
            Questions (0)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Question Input (when questions tab is active) */}
      {activeTab === 'questions' && (
        <View style={styles.desktopQuestionInput}>
          <View style={styles.desktopQuestionHeader}>
            <Text style={styles.desktopQuestionIcon}>👁️</Text>
            <Text style={styles.desktopQuestionDisclaimer}>
              These messages are public and can be seen by anyone. Do not share your personal info.
            </Text>
          </View>
          <View style={styles.desktopQuestionInputContainer}>
            <View style={styles.desktopQuestionAvatar}>
              <Text style={styles.desktopQuestionAvatarText}>U</Text>
            </View>
            <TextInput
              style={styles.desktopQuestionTextInput}
              placeholder="Ask a question"
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.desktopQuestionSendButton} onPress={handleSendQuestion}>
              <Text style={styles.desktopQuestionSendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileBackIcon: {
    fontSize: 20,
    color: '#000',
  },
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  mobileShareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileShareIcon: {
    fontSize: 20,
    color: '#666',
  },
  mobileTaskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  mobileInfoIconText: {
    fontSize: 18,
  },
  mobileScrollContent: {
    flex: 1,
  },
  mobileContentContainer: {
    padding: 20,
  },
  mobileStatusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mobileStatusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  mobileStatusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mobilePriceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mobilePriceContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  mobilePriceLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  mobilePriceAmount: {
    fontSize: 24,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
  },
  mobileMakeOfferButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mobileMakeOfferText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  mobileInfoSection: {
    marginBottom: 15,
  },
  mobileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mobilePosterAvatar: {
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobilePosterInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mobileInfoContent: {
    flex: 1,
  },
  mobileInfoLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  mobileInfoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  mobileInfoSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mobileViewMapText: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  mobileDescriptionCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  mobileDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  mobileDescriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  mobileImagesCard: {
    marginBottom: 20,
  },
  mobileImagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  mobileImagesScroll: {
    // Add any specific styles for the ScrollView if needed
  },
  mobileImageContainer: {
    width: 100, // Fixed width for horizontal scroll
    marginRight: 10,
  },
  mobileImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileImageText: {
    fontSize: 14,
    color: '#666',
  },
  mobileActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  mobileFollowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  mobileFollowIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  mobileFollowText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  mobileReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  mobileReportIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  mobileReportText: {
    fontSize: 16,
    color: '#666',
  },
  mobileBottomSpacing: {
    height: 100, // Add some space at the bottom
  },
  mobileBottomTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mobileTabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  mobileTabButtonActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  mobileTabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  mobileTabTextActive: {
    color: '#fff',
  },
  mobileQuestionInput: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mobileQuestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  mobileQuestionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mobileQuestionDisclaimer: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  mobileQuestionInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mobileQuestionAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mobileQuestionAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mobileQuestionTextInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 45,
    textAlignVertical: 'top',
  },
  mobileQuestionSendButton: {
    marginLeft: 10,
  },
  mobileQuestionSendText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },

  // Desktop styles
  desktopContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  desktopBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopBackIcon: {
    fontSize: 20,
    color: '#000',
  },
  desktopHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  desktopShareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopShareIcon: {
    fontSize: 20,
    color: '#666',
  },
  desktopScrollContent: {
    flex: 1,
  },
  desktopContentContainer: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    padding: 60,
  },
  desktopStatusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  desktopStatusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  desktopStatusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  desktopTaskTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  desktopTwoColumn: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  desktopLeftColumn: {
    flex: 2,
  },
  desktopRightColumn: {
    flex: 1,
  },
  desktopInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  desktopInfoSection: {
    marginBottom: 15,
  },
  desktopInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  desktopPosterAvatar: {
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopPosterInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  desktopInfoContent: {
    flex: 1,
  },
  desktopInfoLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  desktopInfoValue: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  desktopInfoSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  desktopInfoIconText: {
    fontSize: 20,
  },
  desktopViewMapText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  desktopDescriptionCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  desktopDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  desktopDescriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  desktopImagesCard: {
    marginBottom: 20,
  },
  desktopImagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  desktopImageGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  desktopImageContainer: {
    flex: 1,
  },
  desktopImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopImageText: {
    fontSize: 16,
    color: '#666',
  },
  desktopPriceCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  desktopPriceLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  desktopPriceAmount: {
    fontSize: 28,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  desktopMakeOfferButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  desktopMakeOfferText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  desktopActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  desktopFollowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  desktopFollowIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  desktopFollowText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  desktopReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  desktopReportIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  desktopReportText: {
    fontSize: 16,
    color: '#666',
  },
  desktopBottomSpacing: {
    height: 100, // Add some space at the bottom
  },
  desktopBottomTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  desktopTabButton: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  desktopTabButtonActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  desktopTabText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  desktopTabTextActive: {
    color: '#fff',
  },
  desktopQuestionInput: {
    padding: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  desktopQuestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  desktopQuestionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  desktopQuestionDisclaimer: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  desktopQuestionInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  desktopQuestionAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  desktopQuestionAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  desktopQuestionTextInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    color: '#000',
    minHeight: 55,
    textAlignVertical: 'top',
  },
  desktopQuestionSendButton: {
    marginLeft: 15,
  },
  desktopQuestionSendText: {
    fontSize: 18,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
});

export default TaskDetailsScreen; 