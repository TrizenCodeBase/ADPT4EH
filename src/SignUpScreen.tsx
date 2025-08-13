import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { signUpWithEmail, signInWithGoogle } from './firebase';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563EB';
const DARK = '#222';
const GRAY = '#888';
const LIGHT_BG = '#f8fafc';

// Custom Social Media Icons using PNG images for consistency
const AppleIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/social-svg/icons8-apple-inc-48.png')}
      style={{ width: 24, height: 24, resizeMode: 'contain' }}
    />
  </View>
);

const GoogleIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/social-svg/icons8-google-48.png')}
      style={{ width: 24, height: 24, resizeMode: 'contain' }}
    />
  </View>
);

const FacebookIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/social-svg/icons8-facebook-48.png')}
      style={{ width: 44, height: 54, resizeMode: 'contain' }}
    />
  </View>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text style={{ fontSize: 18, color: '#666' }}>
    {visible ? '👁️' : '👁️‍🗨️'}
  </Text>
);

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Check if we're on mobile web view
  useEffect(() => {
    const checkScreenSize = () => {
      if (Platform.OS === 'web') {
        const { width } = Dimensions.get('window');
        setIsMobileView(width <= 768);
      } else {
        setIsMobileView(true); // Always frameless on native mobile
      }
    };

    checkScreenSize();
    if (Platform.OS === 'web') {
      const subscription = Dimensions.addEventListener('change', checkScreenSize);
      return () => subscription?.remove();
    }
  }, []);

  const mapFirebaseSignUpError = (code?: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in instead.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled for this project.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/invalid-api-key':
        return 'Invalid API key. Please verify your Firebase configuration.';
      case 'auth/unauthorized-domain':
      case 'auth/invalid-origin':
        return 'This domain is not authorized in Firebase Authentication. Add localhost to Authorized Domains.';
      default:
        return 'Failed to create account. Please try again.';
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showAlert('Missing info', 'Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showAlert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password, {
        name: fullName,
        phone: phone,
        role: 'performer',
        location: 'Not specified'
      });

      if (result.success) {
        // After signup, go to OTP verification with phone prefilled
        navigation.navigate('OTPVerification', { phone });
      } else {
        const friendly = mapFirebaseSignUpError(result.code);
        showAlert('Sign up failed', friendly);
        console.warn('Signup failed:', result.code, result.error);
      }
    } catch (error) {
      console.error('Signup exception:', error);
      showAlert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        showAlert('Account Created', 'Signed up with Google successfully!');
        navigation.navigate('PerformerHome');
      } else {
        showAlert('Google Sign up failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Google signup exception:', error);
      showAlert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Frameless layout for mobile (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.androidContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.androidBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <ScrollView 
          style={styles.androidScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.androidScrollContent}
        >
          {/* Title Section */}
          <View style={styles.androidTitleSection}>
            <Text style={styles.androidHeading}>Create Account</Text>
            <Text style={styles.androidSubtext}>Sign up to get started</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.androidFormContainer}>
            <View style={styles.androidInputGroup}>
              <Text style={styles.androidLabel}>Name</Text>
              <TextInput
                style={styles.androidInput}
                placeholder="Ex. John Doe"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.androidInputGroup}>
              <Text style={styles.androidLabel}>Email</Text>
              <TextInput
                style={styles.androidInput}
                placeholder="johndoe@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.androidInputGroup}>
              <Text style={styles.androidLabel}>Phone Number</Text>
              <TextInput
                style={styles.androidInput}
                placeholder="8985******"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.androidInputGroup}>
              <Text style={styles.androidLabel}>Password</Text>
              <View style={styles.androidPasswordContainer}>
                <TextInput
                  style={styles.androidPasswordInput}
                  placeholder="************"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.androidEyeIcon}
                >
                  <EyeIcon visible={showPassword} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.androidInputGroup}>
              <Text style={styles.androidLabel}>Confirm Password</Text>
              <View style={styles.androidPasswordContainer}>
                <TextInput
                  style={styles.androidPasswordInput}
                  placeholder="************"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={styles.androidEyeIcon}
                >
                  <EyeIcon visible={showConfirmPassword} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity 
            style={styles.androidCheckboxContainer} 
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.androidCheckbox, { backgroundColor: agree ? PRIMARY_YELLOW : 'transparent' }]}>
              {agree && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
            <Text style={styles.androidCheckboxLabel}>
              Agree with <Text style={styles.androidTermsText}>Terms & Condition</Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.androidSignUpButton, { opacity: agree ? 1 : 0.6 }]}
            disabled={!agree || loading}
            onPress={agree ? handleSignUp : undefined}
          >
            <Text style={styles.androidSignUpButtonText}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Social Sign Up */}
          <View style={styles.androidSocialSection}>
            <Text style={styles.androidSocialText}>Or sign up with</Text>
            <View style={styles.androidSocialButtons}>
              <TouchableOpacity style={styles.androidSocialButton}>
                <AppleIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.androidSocialButton} onPress={handleGoogleSignUp}>
                <GoogleIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.androidSocialButton}>
                <FacebookIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Link */}
          <View style={styles.androidLoginLink}>
            <Text style={styles.androidLoginText}>
              Already have an account? <Text style={styles.androidSignInLink} onPress={() => navigation.navigate('Login')}>Sign In</Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Desktop web layout (with form frame)
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subtext}>Sign up to get started</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex. John Doe"
          value={fullName}
          onChangeText={setFullName}
          editable={true}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={true}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="8985******"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={true}
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="************"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={true}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <EyeIcon visible={showPassword} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="************"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            editable={true}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <EyeIcon visible={showConfirmPassword} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgree(!agree)} activeOpacity={0.8}>
          <Text style={{
            fontSize: 18,
            marginRight: 8,
            color: agree ? PRIMARY_YELLOW : GRAY,
            borderWidth: 1,
            borderColor: agree ? PRIMARY_YELLOW : GRAY,
            borderRadius: 4,
            width: 22,
            height: 22,
            textAlign: 'center',
            lineHeight: 22,
            backgroundColor: agree ? PRIMARY_YELLOW + '22' : 'transparent',
          }}>{agree ? '✓' : ''}</Text>
          <Text style={styles.checkboxLabel}>
            Agree with <Text style={styles.termsText}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.signupButton, { backgroundColor: PRIMARY_YELLOW }]}
          disabled={!agree || loading}
          onPress={agree ? handleSignUp : undefined}
          activeOpacity={agree ? 0.7 : 1}
        >
          <Text style={styles.signupButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or sign up with</Text>
          <View style={styles.divider} />
        </View>
        {/* Social Signup Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIconButton}>
            <AppleIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton} onPress={handleGoogleSignUp}>
            <GoogleIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton}>
            <FacebookIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  // Android-specific styles
  androidContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  androidBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  androidScrollView: {
    flex: 1,
  },
  androidScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  androidTitleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  androidHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  androidSubtext: {
    fontSize: 16,
    color: '#666',
  },
  androidFormContainer: {
    marginBottom: 30,
  },
  androidInputGroup: {
    marginBottom: 20,
  },
  androidLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  androidInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  androidPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  androidPasswordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  androidEyeIcon: {
    padding: 16,
  },
  eyeIconText: {
    fontSize: 18,
    color: '#666',
  },
  androidCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  androidCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: PRIMARY_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  androidCheckboxLabel: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  androidTermsText: {
    color: PRIMARY_YELLOW,
    fontWeight: 'bold',
  },
  androidSignUpButton: {
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  androidSignUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  androidSocialSection: {
    marginBottom: 30,
  },
  androidSocialText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  androidSocialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  androidSocialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleIcon: {
    fontSize: 24,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA4335',
  },
  facebookIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1877F3',
  },
  androidLoginLink: {
    alignItems: 'center',
  },
  androidLoginText: {
    fontSize: 14,
    color: '#000',
  },
  androidSignInLink: {
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  // Web styles (existing)
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: DARK,
    marginBottom: 2,
    marginTop: 6,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: LIGHT_BG,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    fontSize: 14,
    color: DARK,
  },
  termsText: {
    color: PRIMARY_YELLOW,
    fontWeight: 'bold',
  },
  signupButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: GRAY,
  },
  dividerText: {
    marginHorizontal: 8,
    color: GRAY,
    fontWeight: 'bold',
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 16,
  },
  socialIconButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 10,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  footerText: {
    fontSize: 14,
    color: DARK,
    marginTop: 12,
    textAlign: 'center',
  },
  loginText: {
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 