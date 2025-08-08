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
        {/* Header */}
        <View style={styles.mobileHeader}>
          <TouchableOpacity 
            style={styles.mobileBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.mobileBackIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.mobileHeaderCenter}>
            <Text style={styles.mobileTaskTitle} numberOfLines={1}>
              {taskData.title}
            </Text>
            <Text style={styles.mobileDomain}>extrahand.com</Text>
          </View>
          
          <View style={styles.mobileHeaderRight}>
            <TouchableOpacity style={styles.mobileHeaderIcon}>
              <Text style={styles.mobileHeaderIconText}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileHeaderIcon}>
              <Text style={styles.mobileHeaderIconText}>🔖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileHeaderIcon}>
              <Text style={styles.mobileHeaderIconText}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Header */}
        <View style={styles.mobileAppHeader}>
          <TouchableOpacity style={styles.mobileMenuButton}>
            <Text style={styles.mobileMenuIcon}>☰</Text>
          </TouchableOpacity>
          
          <Image
            source={require('../assets/images/extrahand-logo.png')}
            style={styles.mobileLogo}
            resizeMode="contain"
          />
          
          <TouchableOpacity style={styles.mobileAddButton}>
            <Text style={styles.mobileAddIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.mobileFilters}>
          <TouchableOpacity style={styles.mobileFilterButton}>
            <Text style={styles.mobileFilterText}>Category</Text>
            <Text style={styles.mobileFilterArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileFilterButton}>
            <Text style={styles.mobileFilterText}>50km Adelaide SA</Text>
            <Text style={styles.mobileFilterArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileFilterButton}>
            <Text style={styles.mobileFilterText}>Any</Text>
            <Text style={styles.mobileFilterIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mobileScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mobileContentContainer}>
            {/* Status and Follow */}
            <View style={styles.mobileStatusRow}>
              <View style={styles.mobileStatusTag}>
                <Text style={styles.mobileStatusText}>{taskData.status}</Text>
              </View>
              <TouchableOpacity style={styles.mobileFollowButton} onPress={handleFollow}>
                <Text style={styles.mobileFollowIcon}>❤️</Text>
                <Text style={styles.mobileFollowText}>Follow</Text>
              </TouchableOpacity>
            </View>

            {/* Task Title */}
            <Text style={styles.mobileMainTitle}>{taskData.title}</Text>

            {/* Poster Info */}
            <View style={styles.mobilePosterInfo}>
              <View style={styles.mobilePosterAvatar}>
                <Text style={styles.mobilePosterInitial}>M</Text>
              </View>
              <View style={styles.mobilePosterDetails}>
                <Text style={styles.mobilePosterLabel}>POSTED BY</Text>
                <Text style={styles.mobilePosterName}>{taskData.poster}</Text>
              </View>
              <Text style={styles.mobilePosterTime}>{taskData.postedTime}</Text>
            </View>

            {/* Location */}
            <View style={styles.mobileInfoRow}>
              <Text style={styles.mobileInfoIcon}>📍</Text>
              <View style={styles.mobileInfoContent}>
                <Text style={styles.mobileInfoLabel}>LOCATION</Text>
                <Text style={styles.mobileInfoValue}>{taskData.location}</Text>
              </View>
              <TouchableOpacity onPress={handleViewMap}>
                <Text style={styles.mobileViewMapText}>View map</Text>
              </TouchableOpacity>
            </View>

            {/* Due Date */}
            <View style={styles.mobileInfoRow}>
              <Text style={styles.mobileInfoIcon}>📅</Text>
              <View style={styles.mobileInfoContent}>
                <Text style={styles.mobileInfoLabel}>TO BE DONE ON</Text>
                <Text style={styles.mobileInfoValue}>{taskData.dueDate}</Text>
                <Text style={styles.mobileInfoSubtext}>{taskData.dueTime}</Text>
              </View>
            </View>

            {/* Budget Card */}
            <View style={styles.mobileBudgetCard}>
              <Text style={styles.mobileBudgetLabel}>TASK BUDGET</Text>
              <Text style={styles.mobileBudgetAmount}>{taskData.budget}</Text>
              <TouchableOpacity style={styles.mobileMakeOfferButton} onPress={handleMakeOffer}>
                <Text style={styles.mobileMakeOfferText}>Make an offer</Text>
              </TouchableOpacity>
            </View>

            {/* More Options */}
            <TouchableOpacity style={styles.mobileMoreOptionsButton} onPress={handleMoreOptions}>
              <Text style={styles.mobileMoreOptionsText}>More Options</Text>
              <Text style={styles.mobileMoreOptionsArrow}>▼</Text>
            </TouchableOpacity>

            {/* Report Link */}
            <TouchableOpacity style={styles.mobileReportButton}>
              <Text style={styles.mobileReportIcon}>🚩</Text>
              <Text style={styles.mobileReportText}>Report this task</Text>
            </TouchableOpacity>

            {/* Details Section */}
            <View style={styles.mobileDetailsSection}>
              <Text style={styles.mobileDetailsTitle}>Details</Text>
              <Text style={styles.mobileDetailsText}>{taskData.description}</Text>
            </View>

            {/* Images */}
            <View style={styles.mobileImagesSection}>
              <View style={styles.mobileImageGrid}>
                {taskData.images.map((image, index) => (
                  <View key={index} style={styles.mobileImageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.mobileImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Less Link */}
            <TouchableOpacity style={styles.mobileLessButton}>
              <Text style={styles.mobileLessText}>Less</Text>
              <Text style={styles.mobileLessArrow}>▲</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Floating CTA */}
        <TouchableOpacity style={styles.fabMobile} onPress={handleMakeOffer}>
          <Text style={styles.fabText}>Make an offer</Text>
        </TouchableOpacity>

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
              Offers
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
              Questions
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
        
        <Text style={styles.desktopTitle}>{taskData.title}</Text>
        
        <View style={styles.desktopHeaderActions}>
          <TouchableOpacity style={styles.desktopHeaderButton}>
            <Text style={styles.desktopHeaderButtonText}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopHeaderButton}>
            <Text style={styles.desktopHeaderButtonText}>🔖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopHeaderButton}>
            <Text style={styles.desktopHeaderButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopContentContainer}>
          {/* Status and Follow */}
          <View style={styles.desktopStatusRow}>
            <View style={styles.desktopStatusTag}>
              <Text style={styles.desktopStatusText}>{taskData.status}</Text>
            </View>
            <TouchableOpacity style={styles.desktopFollowButton} onPress={handleFollow}>
              <Text style={styles.desktopFollowIcon}>❤️</Text>
              <Text style={styles.desktopFollowText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Task Title */}
          <Text style={styles.desktopMainTitle}>{taskData.title}</Text>

          {/* Poster Info */}
          <View style={styles.desktopPosterInfo}>
            <View style={styles.desktopPosterAvatar}>
              <Text style={styles.desktopPosterInitial}>M</Text>
            </View>
            <View style={styles.desktopPosterDetails}>
              <Text style={styles.desktopPosterLabel}>POSTED BY</Text>
              <Text style={styles.desktopPosterName}>{taskData.poster}</Text>
            </View>
            <Text style={styles.desktopPosterTime}>{taskData.postedTime}</Text>
          </View>

          {/* Location */}
          <View style={styles.desktopInfoRow}>
            <Text style={styles.desktopInfoIcon}>📍</Text>
            <View style={styles.desktopInfoContent}>
              <Text style={styles.desktopInfoLabel}>LOCATION</Text>
              <Text style={styles.desktopInfoValue}>{taskData.location}</Text>
            </View>
            <TouchableOpacity onPress={handleViewMap}>
              <Text style={styles.desktopViewMapText}>View map</Text>
            </TouchableOpacity>
          </View>

          {/* Due Date */}
          <View style={styles.desktopInfoRow}>
            <Text style={styles.desktopInfoIcon}>📅</Text>
            <View style={styles.desktopInfoContent}>
              <Text style={styles.desktopInfoLabel}>TO BE DONE ON</Text>
              <Text style={styles.desktopInfoValue}>{taskData.dueDate}</Text>
              <Text style={styles.desktopInfoSubtext}>{taskData.dueTime}</Text>
            </View>
          </View>

          {/* Budget Card */}
          <View style={styles.desktopBudgetCard}>
            <Text style={styles.desktopBudgetLabel}>TASK BUDGET</Text>
            <Text style={styles.desktopBudgetAmount}>{taskData.budget}</Text>
            <TouchableOpacity style={styles.desktopMakeOfferButton} onPress={handleMakeOffer}>
              <Text style={styles.desktopMakeOfferText}>Make an offer</Text>
            </TouchableOpacity>
          </View>

          {/* More Options */}
          <TouchableOpacity style={styles.desktopMoreOptionsButton} onPress={handleMoreOptions}>
            <Text style={styles.desktopMoreOptionsText}>More Options</Text>
            <Text style={styles.desktopMoreOptionsArrow}>▼</Text>
          </TouchableOpacity>

          {/* Report Link */}
          <TouchableOpacity style={styles.desktopReportButton}>
            <Text style={styles.desktopReportIcon}>🚩</Text>
            <Text style={styles.desktopReportText}>Report this task</Text>
          </TouchableOpacity>

          {/* Details Section */}
          <View style={styles.desktopDetailsSection}>
            <Text style={styles.desktopDetailsTitle}>Details</Text>
            <Text style={styles.desktopDetailsText}>{taskData.description}</Text>
          </View>

          {/* Images */}
          <View style={styles.desktopImagesSection}>
            <View style={styles.desktopImageGrid}>
              {taskData.images.map((image, index) => (
                <View key={index} style={styles.desktopImageContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.desktopImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Less Link */}
          <TouchableOpacity style={styles.desktopLessButton}>
            <Text style={styles.desktopLessText}>Less</Text>
            <Text style={styles.desktopLessArrow}>▲</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating CTA */}
      <TouchableOpacity style={styles.fabDesktop} onPress={handleMakeOffer}>
        <Text style={styles.fabText}>Make an offer</Text>
      </TouchableOpacity>

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
            Offers
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
            Questions
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
    backgroundColor: '#f7fafc',
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  mobileHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  mobileTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  mobileDomain: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mobileHeaderRight: {
    flexDirection: 'row',
    gap: 15,
  },
  mobileHeaderIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileHeaderIconText: {
    fontSize: 16,
    color: '#666',
  },
  mobileAppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileMenuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileMenuIcon: {
    fontSize: 20,
    color: '#000',
  },
  mobileLogo: {
    height: 30,
    width: 120,
  },
  mobileAddButton: {
    width: 40,
    height: 40,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileAddIcon: {
    fontSize: 20,
    color: '#fff',
  },
  mobileFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 10,
  },
  mobileFilterText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  mobileFilterArrow: {
    fontSize: 12,
    color: '#666',
  },
  mobileFilterIcon: {
    fontSize: 14,
    color: '#666',
  },
  mobileScrollContent: {
    flex: 1,
  },
  mobileContentContainer: {
    padding: 20,
  },
  mobileStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mobileStatusTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mobileStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mobileFollowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  mobileFollowIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  mobileFollowText: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  mobileMainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  mobilePosterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mobilePosterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mobilePosterInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mobilePosterDetails: {
    flex: 1,
  },
  mobilePosterLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  mobilePosterName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  mobilePosterTime: {
    fontSize: 14,
    color: '#666',
  },
  mobileInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  mobileInfoIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
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
  mobileBudgetCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  mobileBudgetLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  mobileBudgetAmount: {
    fontSize: 32,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mobileMakeOfferButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  mobileMakeOfferText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileMoreOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
  },
  mobileMoreOptionsText: {
    fontSize: 16,
    color: '#000',
  },
  mobileMoreOptionsArrow: {
    fontSize: 14,
    color: '#666',
  },
  mobileReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mobileReportIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mobileReportText: {
    fontSize: 14,
    color: '#666',
  },
  mobileDetailsSection: {
    marginBottom: 20,
  },
  mobileDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  mobileDetailsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  mobileImagesSection: {
    marginBottom: 20,
  },
  mobileImageGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  mobileImageContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  mobileImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileImage: {
    width: '100%',
    height: '100%',
  },
  mobileLessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mobileLessText: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    marginRight: 5,
  },
  mobileLessArrow: {
    fontSize: 12,
    color: PRIMARY_BLUE,
  },
  mobileBottomTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
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
    backgroundColor: '#f7fafc',
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
  desktopTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  desktopHeaderActions: {
    flexDirection: 'row',
    gap: 20,
  },
  desktopHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopHeaderButtonText: {
    fontSize: 18,
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
  desktopStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  desktopStatusTag: {
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
  desktopMainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  desktopPosterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  desktopPosterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  desktopPosterInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  desktopPosterDetails: {
    flex: 1,
  },
  desktopPosterLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  desktopPosterName: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  desktopPosterTime: {
    fontSize: 16,
    color: '#666',
  },
  desktopInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  desktopInfoIcon: {
    fontSize: 20,
    marginRight: 15,
    marginTop: 2,
  },
  desktopInfoContent: {
    flex: 1,
  },
  desktopInfoLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
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
  desktopViewMapText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    fontWeight: '500',
  },
  desktopBudgetCard: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  desktopBudgetLabel: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  desktopBudgetAmount: {
    fontSize: 48,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  desktopMakeOfferButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  desktopMakeOfferText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  desktopMoreOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 18,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 20,
  },
  desktopMoreOptionsText: {
    fontSize: 18,
    color: '#000',
  },
  desktopMoreOptionsArrow: {
    fontSize: 16,
    color: '#666',
  },
  desktopReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  desktopReportIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  desktopReportText: {
    fontSize: 16,
    color: '#666',
  },
  desktopDetailsSection: {
    marginBottom: 30,
  },
  desktopDetailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  desktopDetailsText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
  },
  desktopImagesSection: {
    marginBottom: 30,
  },
  desktopImageGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  desktopImageContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  desktopImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopImage: {
    width: '100%',
    height: '100%',
  },
  desktopLessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  desktopLessText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
    marginRight: 8,
  },
  desktopLessArrow: {
    fontSize: 14,
    color: PRIMARY_BLUE,
  },
  desktopBottomTabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
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
  // Floating CTA (mobile)
  fabMobile: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  // Floating CTA (desktop)
  fabDesktop: {
    position: 'absolute',
    right: 40,
    bottom: 110,
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
    zIndex: 10,
  },
});

export default TaskDetailsScreen; 