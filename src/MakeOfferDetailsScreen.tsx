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

const MakeOfferDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

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

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Photo upload functionality would be implemented here.');
  };

  const handleAddDateOfBirth = () => {
    Alert.alert('Add Date of Birth', 'Date picker would be implemented here.');
  };

  const handleVerifyMobile = () => {
    Alert.alert('Verify Mobile', 'Mobile verification would be implemented here.');
  };

  const handleLinkBankAccount = () => {
    Alert.alert('Link Bank Account', 'Bank account linking would be implemented here.');
  };

  const handleAddBillingAddress = () => {
    Alert.alert('Add Billing Address', 'Address form would be implemented here.');
  };

  const handleContinue = () => {
    // Navigate to the actual offer submission screen
    Alert.alert('Continue', 'This would navigate to the offer submission screen.');
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
            <Text style={styles.mobileBackIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mobileScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mobileContentContainer}>
            {/* Icon */}
            <View style={styles.mobileIconContainer}>
              <View style={styles.mobileIcon}>
                <View style={styles.mobileIconInner}>
                  <View style={styles.mobileIconBox1} />
                  <View style={styles.mobileIconBox2} />
                </View>
                <View style={styles.mobileIconRibbon} />
              </View>
            </View>

            {/* Title and Description */}
            <Text style={styles.mobileTitle}>Before you make an offer</Text>
            <Text style={styles.mobileDescription}>
              Help us keep Airtasker safe and fun, and fill in a few details.
            </Text>

            {/* Details List */}
            <View style={styles.mobileDetailsList}>
              {/* Profile Picture */}
              <TouchableOpacity style={styles.mobileDetailItem} onPress={handleUploadPhoto}>
                <View style={styles.mobileDetailIcon}>
                  <Text style={styles.mobileDetailIconText}>👤</Text>
                </View>
                <Text style={styles.mobileDetailText}>Upload a profile picture</Text>
                <View style={styles.mobileDetailAction}>
                  <Text style={styles.mobileAddIcon}>+</Text>
                </View>
              </TouchableOpacity>

              {/* Date of Birth */}
              <TouchableOpacity style={styles.mobileDetailItem} onPress={handleAddDateOfBirth}>
                <View style={styles.mobileDetailIcon}>
                  <Text style={styles.mobileDetailIconText}>📅</Text>
                </View>
                <Text style={styles.mobileDetailText}>Add your date of birth</Text>
                <View style={styles.mobileDetailAction}>
                  <Text style={styles.mobileAddIcon}>+</Text>
                </View>
              </TouchableOpacity>

              {/* Mobile Verification */}
              <TouchableOpacity style={styles.mobileDetailItem} onPress={handleVerifyMobile}>
                <View style={styles.mobileDetailIcon}>
                  <Text style={styles.mobileDetailIconText}>📱</Text>
                </View>
                <Text style={styles.mobileDetailText}>Verify your mobile</Text>
                <View style={styles.mobileDetailAction}>
                  <Text style={styles.mobileAddIcon}>+</Text>
                </View>
              </TouchableOpacity>

              {/* Bank Account */}
              <TouchableOpacity style={styles.mobileDetailItem} onPress={handleLinkBankAccount}>
                <View style={styles.mobileDetailIcon}>
                  <Text style={styles.mobileDetailIconText}>💳</Text>
                </View>
                <View style={styles.mobileDetailTextContainer}>
                  <Text style={styles.mobileDetailText}>Link your bank account</Text>
                  <TouchableOpacity style={styles.mobileInfoIcon}>
                    <Text style={styles.mobileInfoIconText}>ⓘ</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.mobileDetailAction}>
                  <Text style={styles.mobileAddIcon}>+</Text>
                </View>
              </TouchableOpacity>

              {/* Billing Address */}
              <TouchableOpacity style={styles.mobileDetailItem} onPress={handleAddBillingAddress}>
                <View style={styles.mobileDetailIcon}>
                  <Text style={styles.mobileDetailIconText}>📍</Text>
                </View>
                <Text style={styles.mobileDetailText}>Add your billing address</Text>
                <View style={styles.mobileDetailAction}>
                  <Text style={styles.mobileAddIcon}>+</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.mobileContinueButton} onPress={handleContinue}>
              <Text style={styles.mobileContinueText}>Continue</Text>
            </TouchableOpacity>
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
          style={styles.desktopBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.desktopBackIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.desktopScrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.desktopContentContainer}>
          {/* Icon */}
          <View style={styles.desktopIconContainer}>
            <View style={styles.desktopIcon}>
              <View style={styles.desktopIconInner}>
                <View style={styles.desktopIconBox1} />
                <View style={styles.desktopIconBox2} />
              </View>
              <View style={styles.desktopIconRibbon} />
            </View>
          </View>

          {/* Title and Description */}
          <Text style={styles.desktopTitle}>Before you make an offer</Text>
          <Text style={styles.desktopDescription}>
            Help us keep Airtasker safe and fun, and fill in a few details.
          </Text>

          {/* Details List */}
          <View style={styles.desktopDetailsList}>
            {/* Profile Picture */}
            <TouchableOpacity style={styles.desktopDetailItem} onPress={handleUploadPhoto}>
              <View style={styles.desktopDetailIcon}>
                <Text style={styles.desktopDetailIconText}>👤</Text>
              </View>
              <Text style={styles.desktopDetailText}>Upload a profile picture</Text>
              <View style={styles.desktopDetailAction}>
                <Text style={styles.desktopAddIcon}>+</Text>
              </View>
            </TouchableOpacity>

            {/* Date of Birth */}
            <TouchableOpacity style={styles.desktopDetailItem} onPress={handleAddDateOfBirth}>
              <View style={styles.desktopDetailIcon}>
                <Text style={styles.desktopDetailIconText}>📅</Text>
              </View>
              <Text style={styles.desktopDetailText}>Add your date of birth</Text>
              <View style={styles.desktopDetailAction}>
                <Text style={styles.desktopAddIcon}>+</Text>
              </View>
            </TouchableOpacity>

            {/* Mobile Verification */}
            <TouchableOpacity style={styles.desktopDetailItem} onPress={handleVerifyMobile}>
              <View style={styles.desktopDetailIcon}>
                <Text style={styles.desktopDetailIconText}>📱</Text>
              </View>
              <Text style={styles.desktopDetailText}>Verify your mobile</Text>
              <View style={styles.desktopDetailAction}>
                <Text style={styles.desktopAddIcon}>+</Text>
              </View>
            </TouchableOpacity>

            {/* Bank Account */}
            <TouchableOpacity style={styles.desktopDetailItem} onPress={handleLinkBankAccount}>
              <View style={styles.desktopDetailIcon}>
                <Text style={styles.desktopDetailIconText}>💳</Text>
              </View>
              <View style={styles.desktopDetailTextContainer}>
                <Text style={styles.desktopDetailText}>Link your bank account</Text>
                <TouchableOpacity style={styles.desktopInfoIcon}>
                  <Text style={styles.desktopInfoIconText}>ⓘ</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.desktopDetailAction}>
                <Text style={styles.desktopAddIcon}>+</Text>
              </View>
            </TouchableOpacity>

            {/* Billing Address */}
            <TouchableOpacity style={styles.desktopDetailItem} onPress={handleAddBillingAddress}>
              <View style={styles.desktopDetailIcon}>
                <Text style={styles.desktopDetailIconText}>📍</Text>
              </View>
              <Text style={styles.desktopDetailText}>Add your billing address</Text>
              <View style={styles.desktopDetailAction}>
                <Text style={styles.desktopAddIcon}>+</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.desktopContinueButton} onPress={handleContinue}>
            <Text style={styles.desktopContinueText}>Continue</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
  },
  mobileBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileBackIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: '300',
  },
  mobileScrollContent: {
    flex: 1,
  },
  mobileContentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  mobileIconContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  mobileIcon: {
    width: 100,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileIconInner: {
    width: 80,
    height: 60,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileIconBox1: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
    top: 15,
    left: 15,
  },
  mobileIconBox2: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
    top: 15,
    right: 15,
  },
  mobileIconRibbon: {
    width: 60,
    height: 8,
    backgroundColor: PRIMARY_YELLOW,
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
  },
  mobileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  mobileDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mobileDetailsList: {
    width: '100%',
    marginBottom: 40,
  },
  mobileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mobileDetailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mobileDetailIconText: {
    fontSize: 18,
  },
  mobileDetailText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  mobileDetailTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileInfoIcon: {
    marginLeft: 8,
  },
  mobileInfoIconText: {
    fontSize: 16,
    color: '#666',
  },
  mobileDetailAction: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: PRIMARY_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileAddIcon: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  mobileContinueButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  mobileContinueText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },

  // Desktop styles
  desktopContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 20,
  },
  desktopBackButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopBackIcon: {
    fontSize: 28,
    color: '#000',
    fontWeight: '300',
  },
  desktopScrollContent: {
    flex: 1,
  },
  desktopContentContainer: {
    maxWidth: 600,
    marginHorizontal: 'auto',
    padding: 40,
    alignItems: 'center',
  },
  desktopIconContainer: {
    marginBottom: 40,
    marginTop: 20,
  },
  desktopIcon: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopIconInner: {
    width: 100,
    height: 80,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopIconBox1: {
    width: 25,
    height: 25,
    backgroundColor: '#fff',
    borderRadius: 6,
    position: 'absolute',
    top: 18,
    left: 18,
  },
  desktopIconBox2: {
    width: 25,
    height: 25,
    backgroundColor: '#fff',
    borderRadius: 6,
    position: 'absolute',
    top: 18,
    right: 18,
  },
  desktopIconRibbon: {
    width: 80,
    height: 10,
    backgroundColor: PRIMARY_YELLOW,
    position: 'absolute',
    bottom: 0,
    borderRadius: 5,
  },
  desktopTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  desktopDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 50,
    paddingHorizontal: 40,
  },
  desktopDetailsList: {
    width: '100%',
    marginBottom: 50,
  },
  desktopDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  desktopDetailIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  desktopDetailIconText: {
    fontSize: 22,
  },
  desktopDetailText: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  desktopDetailTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopInfoIcon: {
    marginLeft: 10,
  },
  desktopInfoIconText: {
    fontSize: 18,
    color: '#666',
  },
  desktopDetailAction: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PRIMARY_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopAddIcon: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  desktopContinueButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  desktopContinueText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default MakeOfferDetailsScreen;