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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { useAuth } from './AuthContext';
import { api } from './api';
import MobileNavBar from './components/MobileNavBar';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentUser, userData, refreshUserData } = useAuth();
  const [isMobileView, setIsMobileView] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state - initialized with user data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>(['both']);
  const [userType, setUserType] = useState('individual');
  const [photoURL, setPhotoURL] = useState('');
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [postedTasks, setPostedTasks] = useState(0);
  const [earnedAmount, setEarnedAmount] = useState(0);

  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      loadUserData();
    } else if (currentUser) {
      // Try to refresh user data
      refreshUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, currentUser]);

  const loadUserData = () => {
    if (!userData) return;

    // Parse name into first and last name
    const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' ') || '');

    setEmail(userData.email || '');
    setPhone(userData.phone || '');
    setLocation(userData.location?.address || '');
    setPhotoURL(userData.photoURL || '');
    setRoles(userData.roles || ['both']);
    setUserType(userData.userType || 'individual');
    setSkills(userData.skills || []);
    setRating(userData.rating || 0);
    setTotalReviews(userData.totalReviews || 0);
    setTotalTasks(userData.totalTasks || 0);
    setCompletedTasks(userData.completedTasks || 0);
    setPostedTasks(userData.postedTasks || 0);
    setEarnedAmount(userData.earnedAmount || 0);

    // Set tagline and description from business info if available
    if (userData.business?.description) {
      setDescription(userData.business.description);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Please fill in your first and last name.');
      return;
    }

    try {
      setSaving(true);

      const profileData = {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        phone: phone,
        location: location ? {
          address: location,
          coordinates: [0, 0], // Will be updated with proper geocoding
          city: location.split(',')[0]?.trim(),
          state: location.split(',')[1]?.trim(),
          country: 'India'
        } : null,
        roles: roles,
        userType: userType,
        skills: skills,
        photoURL: photoURL,
        business: userType === 'business' ? {
          name: `${firstName} ${lastName}`,
          description: description
        } : null
      };

      await api.upsertProfile(profileData);
      await refreshUserData();
      
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been deleted.');
          navigation.navigate('Landing');
        }},
      ]
    );
  };

  const handleViewPublicProfile = () => {
    // Navigate to public profile view
    Alert.alert('Public Profile', 'Viewing your public profile...');
  };

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Photo upload functionality would be implemented here.');
  };

  const handleUploadProfileImage = () => {
    Alert.alert('Upload Profile Image', 'Profile image upload functionality would be implemented here.');
  };

  const handleAddSkill = () => {
    // For web, we'll use a simple prompt
    if (Platform.OS === 'web') {
      const skill = prompt('Enter a new skill:');
      if (skill && skill.trim()) {
        setSkills([...skills, skill.trim().toLowerCase()]);
      }
    } else {
      Alert.prompt(
        'Add Skill',
        'Enter a new skill:',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add', onPress: (skill) => {
            if (skill && skill.trim()) {
              setSkills([...skills, skill.trim().toLowerCase()]);
            }
          }}
        ]
      );
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const getVerificationProgress = () => {
    let progress = 0;
    if (firstName && lastName) progress += 20;
    if (email) progress += 20;
    if (phone) progress += 20;
    if (location) progress += 20;
    if (photoURL) progress += 10;
    if (skills.length > 0) progress += 10;
    return Math.min(progress, 100);
  };

  const getPrimaryRole = () => {
    if (!roles || roles.length === 0) return 'both';
    if (roles.includes('tasker') && !roles.includes('poster')) return 'tasker';
    if (roles.includes('poster') && !roles.includes('tasker')) return 'poster';
    return 'both';
  };

  const isPerformer = () => {
    return roles.includes('tasker');
  };

  const isPoster = () => {
    return roles.includes('poster');
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

  // Show loading if no user data
  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text style={styles.loadingText}>Please sign in to view your profile</Text>
      </View>
    );
  }

  // Mobile layout
  if (isMobileView) {
    return (
      <View style={styles.mobileContainer}>
        {/* Mobile Navigation Bar */}
        <MobileNavBar title="Profile" showBackButton={true} />

        {/* Main Content */}
        <ScrollView style={styles.mobileScrollContent} showsVerticalScrollIndicator={false}>
          {/* Account Section */}
          <View style={styles.mobileAccountSection}>
            <View style={styles.mobileAccountHeader}>
              <Text style={styles.mobileAccountTitle}>Account</Text>
              <View style={styles.mobileRoleIndicator}>
                <Text style={styles.mobileRoleText}>
                  {getPrimaryRole() === 'tasker' ? 'Tasker' : 
                   getPrimaryRole() === 'poster' ? 'Poster' : 'Tasker & Poster'}
                </Text>
              </View>
              <View style={styles.mobileVerificationContainer}>
                <Text style={styles.mobileVerificationText}>
                  YOUR VERIFICATIONS ARE {getVerificationProgress()}% COMPLETE
                </Text>
                <View style={styles.mobileProgressBar}>
                  <View style={[styles.mobileProgressFill, { width: `${getVerificationProgress()}%` }]} />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.mobilePublicProfileButton} onPress={handleViewPublicProfile}>
              <Text style={styles.mobilePublicProfileText}>View Your public profile</Text>
            </TouchableOpacity>

            {/* User Stats Section */}
            <View style={styles.mobileStatsSection}>
              <Text style={styles.mobileSectionTitle}>Your Stats</Text>
              <View style={styles.mobileStatsGrid}>
                <View style={styles.mobileStatItem}>
                  <Text style={styles.mobileStatNumber}>{rating.toFixed(1)}</Text>
                  <Text style={styles.mobileStatLabel}>Rating</Text>
                </View>
                <View style={styles.mobileStatItem}>
                  <Text style={styles.mobileStatNumber}>{totalReviews}</Text>
                  <Text style={styles.mobileStatLabel}>Reviews</Text>
                </View>
                {isPerformer() && (
                  <>
                    <View style={styles.mobileStatItem}>
                      <Text style={styles.mobileStatNumber}>{completedTasks}</Text>
                      <Text style={styles.mobileStatLabel}>Completed</Text>
                    </View>
                    <View style={styles.mobileStatItem}>
                      <Text style={styles.mobileStatNumber}>₹{earnedAmount.toLocaleString()}</Text>
                      <Text style={styles.mobileStatLabel}>Earned</Text>
                    </View>
                  </>
                )}
                {isPoster() && (
                  <>
                    <View style={styles.mobileStatItem}>
                      <Text style={styles.mobileStatNumber}>{postedTasks}</Text>
                      <Text style={styles.mobileStatLabel}>Posted</Text>
                    </View>
                    <View style={styles.mobileStatItem}>
                      <Text style={styles.mobileStatNumber}>{totalTasks}</Text>
                      <Text style={styles.mobileStatLabel}>Total Tasks</Text>
                    </View>
                  </>
                )}
                {getPrimaryRole() === 'both' && (
                  <>
                    <View style={styles.mobileStatItem}>
                      <Text style={styles.mobileStatNumber}>{totalTasks}</Text>
                      <Text style={styles.mobileStatLabel}>Total Tasks</Text>
                    </View>
                    <View style={styles.mobileStatItem}>
                      <Text style={styles.mobileStatNumber}>{completedTasks}</Text>
                      <Text style={styles.mobileStatLabel}>Completed</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Upload Avatar Section */}
            <View style={styles.mobileUploadSection}>
              <Text style={styles.mobileSectionTitle}>Profile Photo</Text>
              <View style={styles.mobileAvatarContainer}>
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.mobileAvatarImage} />
                ) : (
                  <View style={styles.mobileAvatarPlaceholder}>
                    <Text style={styles.mobileAvatarIcon}>
                      {firstName ? firstName.charAt(0).toUpperCase() : '👤'}
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={styles.mobileUploadButton} onPress={handleUploadPhoto}>
                  <Text style={styles.mobileUploadButtonText}>Upload photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Image Section */}
            <View style={styles.mobileProfileImageSection}>
              <Text style={styles.mobileSectionTitle}>Profile image</Text>
              <Text style={styles.mobileSectionSubtitle}>modify your public profile</Text>
              <View style={styles.mobileProfileImagePlaceholder}>
                <Text style={styles.mobileProfileImageText}>&</Text>
              </View>
              <TouchableOpacity style={styles.mobileProfileImageButton} onPress={handleUploadProfileImage}>
                <Text style={styles.mobileProfileImageButtonText}>upload profile image</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.mobileFormSection}>
              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>First name*</Text>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Last name*</Text>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Tagline</Text>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Mini bio"
                  value={tagline}
                  onChangeText={setTagline}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Location</Text>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Enter your Location"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Email</Text>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Enter your mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Phone</Text>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="Phone number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>User Type</Text>
                <View style={styles.mobileRadioGroup}>
                  <TouchableOpacity 
                    style={[styles.mobileRadioButton, userType === 'individual' && styles.mobileRadioButtonActive]}
                    onPress={() => setUserType('individual')}
                  >
                    <Text style={[styles.mobileRadioText, userType === 'individual' && styles.mobileRadioTextActive]}>
                      Individual
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.mobileRadioButton, userType === 'business' && styles.mobileRadioButtonActive]}
                    onPress={() => setUserType('business')}
                  >
                    <Text style={[styles.mobileRadioText, userType === 'business' && styles.mobileRadioTextActive]}>
                      Business
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Roles</Text>
                <View style={styles.mobileCheckboxGroup}>
                  <TouchableOpacity 
                    style={[styles.mobileCheckbox, roles.includes('poster') && styles.mobileCheckboxActive]}
                    onPress={() => {
                      if (roles.includes('poster')) {
                        setRoles(roles.filter(r => r !== 'poster'));
                      } else {
                        setRoles([...roles, 'poster']);
                      }
                    }}
                  >
                    <Text style={[styles.mobileCheckboxText, roles.includes('poster') && styles.mobileCheckboxTextActive]}>
                      Post Tasks
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.mobileCheckbox, roles.includes('tasker') && styles.mobileCheckboxActive]}
                    onPress={() => {
                      if (roles.includes('tasker')) {
                        setRoles(roles.filter(r => r !== 'tasker'));
                      } else {
                        setRoles([...roles, 'tasker']);
                      }
                    }}
                  >
                    <Text style={[styles.mobileCheckboxText, roles.includes('tasker') && styles.mobileCheckboxTextActive]}>
                      Complete Tasks
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Skills</Text>
                <View style={styles.mobileSkillsContainer}>
                  {skills.map((skill, index) => (
                    <View key={index} style={styles.mobileSkillTag}>
                      <Text style={styles.mobileSkillText}>{skill}</Text>
                      <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                        <Text style={styles.mobileSkillRemove}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.mobileAddSkillButton} onPress={handleAddSkill}>
                    <Text style={styles.mobileAddSkillText}>+ Add Skill</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.mobileInputGroup}>
                <Text style={styles.mobileLabel}>Description</Text>
                <TextInput
                  style={styles.mobileTextArea}
                  placeholder="Enter your description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Business Description Section */}
              {userType === 'business' && (
                <View style={styles.mobileInputGroup}>
                  <Text style={styles.mobileLabel}>Business Description</Text>
                  <TextInput
                    style={[styles.mobileInput, styles.mobileTextArea]}
                    placeholder="Describe your business..."
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                  />
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.mobileActionButtons}>
                <TouchableOpacity 
                  style={[styles.mobileSaveButton, saving && styles.mobileSaveButtonDisabled]} 
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.mobileSaveButtonText}>Save profile</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.mobileDeleteButton} onPress={handleDeleteAccount}>
                  <Text style={styles.mobileDeleteButtonText}>Delete my account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Desktop layout
  return (
    <View style={styles.desktopContainer}>
              {/* Header */}
        <View style={styles.desktopHeader}>
          <TouchableOpacity 
            style={styles.desktopMenuButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.desktopMenuIcon}>←</Text>
          </TouchableOpacity>
        
                 <View style={styles.desktopLogoSection}>
           <Image
             source={require('../assets/images/extrahand-logo.png')}
             style={styles.desktopLogoImage}
             resizeMode="contain"
           />
         </View>
        
                 <TouchableOpacity 
           style={styles.desktopAddButton}
           onPress={() => navigation.navigate('TaskPostingForm')}
         >
           <Text style={styles.desktopAddIcon}>+</Text>
         </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopContentContainer}>
          {/* Account Section */}
          <View style={styles.desktopAccountSection}>
            <View style={styles.desktopAccountHeader}>
              <Text style={styles.desktopAccountTitle}>Account</Text>
              <View style={styles.desktopRoleIndicator}>
                <Text style={styles.desktopRoleText}>
                  {getPrimaryRole() === 'tasker' ? 'Tasker' : 
                   getPrimaryRole() === 'poster' ? 'Poster' : 'Tasker & Poster'}
                </Text>
              </View>
              <View style={styles.desktopVerificationContainer}>
                <Text style={styles.desktopVerificationText}>
                  YOUR VERIFICATIONS ARE {getVerificationProgress()}% COMPLETE
                </Text>
                <View style={styles.desktopProgressBar}>
                  <View style={[styles.desktopProgressFill, { width: `${getVerificationProgress()}%` }]} />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.desktopPublicProfileButton} onPress={handleViewPublicProfile}>
              <Text style={styles.desktopPublicProfileText}>View Your public profile</Text>
            </TouchableOpacity>

            {/* User Stats Section */}
            <View style={styles.desktopStatsSection}>
              <Text style={styles.desktopSectionTitle}>Your Stats</Text>
              <View style={styles.desktopStatsGrid}>
                <View style={styles.desktopStatItem}>
                  <Text style={styles.desktopStatNumber}>{rating.toFixed(1)}</Text>
                  <Text style={styles.desktopStatLabel}>Rating</Text>
                </View>
                <View style={styles.desktopStatItem}>
                  <Text style={styles.desktopStatNumber}>{totalReviews}</Text>
                  <Text style={styles.desktopStatLabel}>Reviews</Text>
                </View>
                {isPerformer() && (
                  <>
                    <View style={styles.desktopStatItem}>
                      <Text style={styles.desktopStatNumber}>{completedTasks}</Text>
                      <Text style={styles.desktopStatLabel}>Completed</Text>
                    </View>
                    <View style={styles.desktopStatItem}>
                      <Text style={styles.desktopStatNumber}>₹{earnedAmount.toLocaleString()}</Text>
                      <Text style={styles.desktopStatLabel}>Earned</Text>
                    </View>
                  </>
                )}
                {isPoster() && (
                  <>
                    <View style={styles.desktopStatItem}>
                      <Text style={styles.desktopStatNumber}>{postedTasks}</Text>
                      <Text style={styles.desktopStatLabel}>Posted</Text>
                    </View>
                    <View style={styles.desktopStatItem}>
                      <Text style={styles.desktopStatNumber}>{totalTasks}</Text>
                      <Text style={styles.desktopStatLabel}>Total Tasks</Text>
                    </View>
                  </>
                )}
                {getPrimaryRole() === 'both' && (
                  <>
                    <View style={styles.desktopStatItem}>
                      <Text style={styles.desktopStatNumber}>{totalTasks}</Text>
                      <Text style={styles.desktopStatLabel}>Total Tasks</Text>
                    </View>
                    <View style={styles.desktopStatItem}>
                      <Text style={styles.desktopStatNumber}>{completedTasks}</Text>
                      <Text style={styles.desktopStatLabel}>Completed</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Upload Avatar Section */}
            <View style={styles.desktopUploadSection}>
              <Text style={styles.desktopSectionTitle}>Upload Avatar</Text>
              <View style={styles.desktopAvatarContainer}>
                <Text style={styles.desktopAvatarIcon}>👤</Text>
                <TouchableOpacity style={styles.desktopUploadButton} onPress={handleUploadPhoto}>
                  <Text style={styles.desktopUploadButtonText}>Upload photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Image Section */}
            <View style={styles.desktopProfileImageSection}>
              <Text style={styles.desktopSectionTitle}>Profile image</Text>
              <Text style={styles.desktopSectionSubtitle}>modify your public profile</Text>
              <View style={styles.desktopProfileImagePlaceholder}>
                <Text style={styles.desktopProfileImageText}>&</Text>
              </View>
              <TouchableOpacity style={styles.desktopProfileImageButton} onPress={handleUploadProfileImage}>
                <Text style={styles.desktopProfileImageButtonText}>upload profile image</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.desktopFormSection}>
              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>First name*</Text>
                <TextInput
                  style={styles.desktopInput}
                  placeholder="Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Last name*</Text>
                <TextInput
                  style={styles.desktopInput}
                  placeholder="Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Tagline</Text>
                <TextInput
                  style={styles.desktopInput}
                  placeholder="Mini bio"
                  value={tagline}
                  onChangeText={setTagline}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Location</Text>
                <TextInput
                  style={styles.desktopInput}
                  placeholder="Enter your Location"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Email</Text>
                <TextInput
                  style={styles.desktopInput}
                  placeholder="Enter your mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Phone</Text>
                <TextInput
                  style={styles.desktopInput}
                  placeholder="Phone number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>User Type</Text>
                <View style={styles.desktopRadioGroup}>
                  <TouchableOpacity 
                    style={[styles.desktopRadioButton, userType === 'individual' && styles.desktopRadioButtonActive]}
                    onPress={() => setUserType('individual')}
                  >
                    <Text style={[styles.desktopRadioText, userType === 'individual' && styles.desktopRadioTextActive]}>
                      Individual
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.desktopRadioButton, userType === 'business' && styles.desktopRadioButtonActive]}
                    onPress={() => setUserType('business')}
                  >
                    <Text style={[styles.desktopRadioText, userType === 'business' && styles.desktopRadioTextActive]}>
                      Business
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Roles</Text>
                <View style={styles.desktopCheckboxGroup}>
                  <TouchableOpacity 
                    style={[styles.desktopCheckbox, roles.includes('poster') && styles.desktopCheckboxActive]}
                    onPress={() => {
                      if (roles.includes('poster')) {
                        setRoles(roles.filter(r => r !== 'poster'));
                      } else {
                        setRoles([...roles, 'poster']);
                      }
                    }}
                  >
                    <Text style={[styles.desktopCheckboxText, roles.includes('poster') && styles.desktopCheckboxTextActive]}>
                      Post Tasks
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.desktopCheckbox, roles.includes('tasker') && styles.desktopCheckboxActive]}
                    onPress={() => {
                      if (roles.includes('tasker')) {
                        setRoles(roles.filter(r => r !== 'tasker'));
                      } else {
                        setRoles([...roles, 'tasker']);
                      }
                    }}
                  >
                    <Text style={[styles.desktopCheckboxText, roles.includes('tasker') && styles.desktopCheckboxTextActive]}>
                      Complete Tasks
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Skills</Text>
                <View style={styles.desktopSkillsContainer}>
                  {skills.map((skill, index) => (
                    <View key={index} style={styles.desktopSkillTag}>
                      <Text style={styles.desktopSkillText}>{skill}</Text>
                      <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                        <Text style={styles.desktopSkillRemove}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.desktopAddSkillButton} onPress={handleAddSkill}>
                    <Text style={styles.desktopAddSkillText}>+ Add Skill</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.desktopInputGroup}>
                <Text style={styles.desktopLabel}>Description</Text>
                <TextInput
                  style={styles.desktopTextArea}
                  placeholder="Enter your description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Business Description Section */}
              {userType === 'business' && (
                <View style={styles.desktopInputGroup}>
                  <Text style={styles.desktopLabel}>Business Description</Text>
                  <TextInput
                    style={styles.desktopTextArea}
                    placeholder="Describe your business..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#999"
                  />
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.desktopActionButtons}>
                <TouchableOpacity 
                  style={[styles.desktopSaveButton, saving && styles.desktopSaveButtonDisabled]} 
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.desktopSaveButtonText}>Save profile</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.desktopDeleteButton} onPress={handleDeleteAccount}>
                  <Text style={styles.desktopDeleteButtonText}>Delete my account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
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
  mobileLogoSection: {
    flex: 1,
    alignItems: 'center',
  },
  mobileLogoImage: {
    width: 120,
    height: 40,
  },
  mobileAddButton: {
    width: 50,
    height: 36,
    borderRadius: 8,
    backgroundColor: PRIMARY_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileAddIcon: {
    fontSize: 20,
    color: '#fff',
  },
  mobileScrollContent: {
    flex: 1,
  },
  mobileAccountSection: {
    padding: 20,
  },
  mobileAccountHeader: {
    marginBottom: 20,
  },
  mobileAccountTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  mobileRoleIndicator: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  mobileRoleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  mobileVerificationContainer: {
    marginBottom: 15,
  },
  mobileVerificationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  mobileProgressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  mobileProgressFill: {
    height: '100%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 2,
  },
  mobilePublicProfileButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  mobilePublicProfileText: {
    color: PRIMARY_YELLOW,
    fontSize: 14,
    fontWeight: '500',
  },
  mobileUploadSection: {
    marginBottom: 20,
  },
  mobileSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  mobileAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileAvatarIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  mobileUploadButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  mobileUploadButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  mobileProfileImageSection: {
    marginBottom: 20,
  },
  mobileSectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  mobileProfileImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mobileProfileImageText: {
    fontSize: 48,
    color: '#ccc',
  },
  mobileProfileImageButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  mobileProfileImageButtonText: {
    color: PRIMARY_YELLOW,
    fontSize: 14,
    fontWeight: '500',
  },
  mobileFormSection: {
    marginTop: 20,
  },
  mobileInputGroup: {
    marginBottom: 20,
  },
  mobileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  mobileInput: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  mobileBirthdayContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  mobileBirthdayInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  mobileTextArea: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mobilePreferencesSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  mobilePreferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },

  mobileActionButtons: {
    gap: 15,
  },
  mobileSaveButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileSaveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileDeleteButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Desktop styles
  desktopContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  desktopMenuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopMenuIcon: {
    fontSize: 20,
    color: '#000',
  },
  desktopLogoSection: {
    flex: 1,
    alignItems: 'center',
  },
  desktopLogoImage: {
    width: 150,
    height: 50,
  },
  desktopAddButton: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: PRIMARY_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopAddIcon: {
    fontSize: 20,
    color: '#fff',
  },
  desktopScrollContent: {
    flex: 1,
  },
  desktopContentContainer: {
    maxWidth: 800,
    marginHorizontal: 'auto',
    padding: 40,
  },
  desktopAccountSection: {
    padding: 0,
  },
  desktopAccountHeader: {
    marginBottom: 20,
  },
  desktopAccountTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  desktopRoleIndicator: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  desktopRoleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  desktopVerificationContainer: {
    marginBottom: 15,
  },
  desktopVerificationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  desktopProgressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  desktopProgressFill: {
    height: '100%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 3,
  },
  desktopPublicProfileButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  desktopPublicProfileText: {
    color: PRIMARY_YELLOW,
    fontSize: 16,
    fontWeight: '500',
  },
  desktopUploadSection: {
    marginBottom: 30,
  },
  desktopSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  desktopAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopAvatarIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  desktopUploadButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  desktopUploadButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  desktopProfileImageSection: {
    marginBottom: 30,
  },
  desktopSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  desktopProfileImagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  desktopProfileImageText: {
    fontSize: 60,
    color: '#ccc',
  },
  desktopProfileImageButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  desktopProfileImageButtonText: {
    color: PRIMARY_YELLOW,
    fontSize: 16,
    fontWeight: '500',
  },
  desktopFormSection: {
    marginTop: 30,
  },
  desktopInputGroup: {
    marginBottom: 25,
  },
  desktopLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  desktopInput: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
  },
  desktopBirthdayContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  desktopBirthdayInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  desktopTextArea: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  desktopPreferencesSection: {
    marginTop: 30,
    marginBottom: 40,
  },
  desktopPreferencesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },

  desktopActionButtons: {
    gap: 20,
  },
  desktopSaveButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  desktopSaveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  desktopDeleteButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  desktopDeleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  // New styles for enhanced profile
  mobileStatsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  mobileStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  mobileStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
  },
  mobileStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mobileAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  mobileAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileRadioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  mobileRadioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  mobileRadioButtonActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  mobileRadioText: {
    color: '#666',
    fontWeight: '500',
  },
  mobileRadioTextActive: {
    color: 'white',
  },
  mobileCheckboxGroup: {
    gap: 12,
  },
  mobileCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  mobileCheckboxActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  mobileCheckboxText: {
    color: '#666',
    marginLeft: 8,
  },
  mobileCheckboxTextActive: {
    color: 'white',
  },
  mobileSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  mobileSkillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mobileSkillText: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  mobileSkillRemove: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mobileAddSkillButton: {
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mobileAddSkillText: {
    color: PRIMARY_BLUE,
    fontSize: 12,
  },
  mobileSaveButtonDisabled: {
    opacity: 0.6,
  },
  // Desktop styles for enhanced profile
  desktopStatsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  desktopStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  desktopStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
  },
  desktopStatLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  desktopRadioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  desktopRadioButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  desktopRadioButtonActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  desktopRadioText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  },
  desktopRadioTextActive: {
    color: 'white',
  },
  desktopCheckboxGroup: {
    gap: 16,
  },
  desktopCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  desktopCheckboxActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  desktopCheckboxText: {
    color: '#666',
    marginLeft: 12,
    fontSize: 16,
  },
  desktopCheckboxTextActive: {
    color: 'white',
  },
  desktopSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  desktopSkillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  desktopSkillText: {
    color: 'white',
    fontSize: 14,
    marginRight: 6,
  },
  desktopSkillRemove: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  desktopAddSkillButton: {
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  desktopAddSkillText: {
    color: PRIMARY_BLUE,
    fontSize: 14,
  },
  desktopSaveButtonDisabled: {
    opacity: 0.6,
  },
});

export default ProfileScreen; 