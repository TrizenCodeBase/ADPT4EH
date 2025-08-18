import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Dimensions, Alert } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { auth } from './firebase';
import { sendOTP, confirmOTP } from './phoneAuth';
import { api } from './api';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';
const GRAY = '#888';
const LIGHT_BG = '#f8fafc';

// Keep a module-scoped confirmationResult for web flow
let webConfirmation: any = null;

const maskPhone = (phone: string) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return `+${digits}`;
  return `+${digits.slice(0, 2)} ${digits.slice(2, 4)}******${digits.slice(-2)}`;
};

const OTP_LENGTH = 6;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const initialPhone = navigation.params?.phone || '';
  const [currentPhone, setCurrentPhone] = useState<string>(initialPhone);
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>(initialPhone);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRefs = Array.from({ length: OTP_LENGTH }, () => useRef<any>(null));

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

  const sanitizedDigits = (raw: string) => raw.replace(/\D/g, '');

  const sendOtpInternal = async (digitsOnlyPhone: string) => {
    try {
      setSending(true);
      if (Platform.OS === 'web') {
        const containerId = 'recaptcha-container';
        // Container should already exist in HTML, but ensure it's visible
        const container = document.getElementById(containerId);
        if (container) {
          container.style.display = 'block';
        }
        const res = await sendOTP(`+${digitsOnlyPhone}`);
        if (res.success) {
          webConfirmation = res.confirmation;
          setOtp(Array(OTP_LENGTH).fill(''));
          setTimer(30);
          focusIndex(0);
        } else {
          const msg = res.code ? `${res.code}: ${res.error}` : (res.error || 'Failed to send verification code.');
          Alert.alert('OTP Error', msg);
        }
      } else {
        const res = await sendOTP(`+${digitsOnlyPhone}`);
        if (res.success) {
          webConfirmation = res.confirmation;
          setOtp(Array(OTP_LENGTH).fill(''));
          setTimer(30);
          focusIndex(0);
        } else {
          const msg = res.code ? `${res.code}: ${res.error}` : (res.error || 'Failed to send verification code.');
          Alert.alert('OTP Error', msg);
        }
      }
    } catch (e) {
      const msg = (e as any)?.message || 'Could not send verification code.';
      Alert.alert('OTP Error', msg);
    } finally {
      setSending(false);
    }
  };

  // Send OTP on mount when phone exists
  useEffect(() => {
    const sendOtp = async () => {
      const digits = sanitizedDigits(currentPhone);
      if (!digits) return;
      await sendOtpInternal(digits);
    };
    sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhone]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const focusIndex = (i: number) => {
    if (i >= 0 && i < OTP_LENGTH) {
      inputRefs[i].current?.focus?.();
    }
  };

  const handleChange = (text: string, idx: number) => {
    const digits = (text || '').replace(/\D/g, '');
    if (digits.length <= 1) {
      const next = [...otp];
      next[idx] = digits;
      setOtp(next);
      if (digits && idx < OTP_LENGTH - 1) focusIndex(idx + 1);
      return;
    }
    const next = [...otp];
    let i = idx;
    for (const d of digits.split('')) {
      if (i >= OTP_LENGTH) break;
      next[i] = d;
      i += 1;
    }
    setOtp(next);
    focusIndex(Math.min(i, OTP_LENGTH - 1));
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e?.nativeEvent?.key === 'Backspace') {
      if (!otp[idx] && idx > 0) {
        const next = [...otp];
        next[idx - 1] = '';
        setOtp(next);
        focusIndex(idx - 1);
      }
    }
  };

  const handleResend = async () => {
    if (timer > 0 || sending) return;
    const digits = sanitizedDigits(currentPhone);
    if (!digits) return;
    await sendOtpInternal(digits);
  };

  const handleContinue = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      Alert.alert('Invalid code', `Please enter the ${OTP_LENGTH}-digit verification code.`);
      return;
    }
    try {
      if (!webConfirmation) {
        Alert.alert('OTP Error', 'No verification session found. Please resend the code.');
        return;
      }
      const res = await confirmOTP(webConfirmation, code);
      if (res.success) {
        try {
          const user = auth.currentUser;
          const name = user?.displayName || 'User';
          // Ensure minimal profile on backend (name and roles required)
          await api.upsertProfile({ name, roles: ['both'], phone: `+${sanitizedDigits(currentPhone)}` });
        } catch {}
        Alert.alert('Verified', 'Phone number verified successfully.');
        navigation.navigate('ChooseLocationMethod');
      } else {
        Alert.alert('Verification failed', res.error || 'The code is invalid or expired.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not verify the code.');
    }
  };

  // TEMPORARY BYPASS FUNCTION FOR DEBUGGING
  const handleBypassOTP = async () => {
    try {
      console.log('🚀 TEMPORARY OTP BYPASS ACTIVATED - FOR DEBUGGING ONLY');
      console.log('Current phone:', currentPhone);
      console.log('Navigation object:', navigation);
      
      // Create a mock user profile for testing
      const mockUser = {
        uid: 'temp-user-' + Date.now(),
        displayName: 'Test User',
        phoneNumber: `+${sanitizedDigits(currentPhone)}`
      };
      
      console.log('Mock user created:', mockUser);
      
      // Ensure minimal profile on backend (name and roles required)
      try {
        console.log('Attempting to create profile...');
        const profileResult = await api.upsertProfile({ 
          name: mockUser.displayName, 
          roles: ['both'], 
          phone: mockUser.phoneNumber 
        });
        console.log('✅ Mock profile created successfully:', profileResult);
      } catch (profileError) {
        console.warn('⚠️ Could not create profile, continuing anyway:', profileError);
      }
      
      console.log('About to show alert...');
      Alert.alert(
        'Debug Mode', 
        'OTP verification bypassed for debugging. This should be removed in production.',
        [
          {
            text: 'Continue',
            onPress: () => {
              console.log('Alert Continue button pressed, navigating to ChooseLocationMethod...');
              navigation.navigate('ChooseLocationMethod');
            }
          }
        ]
      );
    } catch (e) {
      console.error('Bypass error:', e);
      Alert.alert('Bypass Error', 'Could not bypass OTP verification.');
    }
  };

  const saveNewPhone = async () => {
    const digits = sanitizedDigits(phoneInput);
    if (digits.length < 8 || digits.length > 15) {
      Alert.alert('Invalid phone', 'Please enter a valid phone number with country code digits (8-15).');
      return;
    }
    setCurrentPhone(digits);
    setIsEditingPhone(false);
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

        {/* Title Section */}
        <View style={styles.androidTitleSection}>
          <Text style={styles.androidHeading}>Verification Code</Text>
          <Text style={styles.androidSubtext}>We have sent a verification code to</Text>
          {!isEditingPhone ? (
            <Text style={styles.androidPhoneText}>
              {maskPhone(currentPhone)}{' '}
              <Text style={styles.androidEditText} onPress={() => { setPhoneInput(currentPhone); setIsEditingPhone(true); }}>Edit</Text>
            </Text>
          ) : (
            <View style={{ width: '100%', maxWidth: 400 }}>
              <TextInput
                style={styles.androidPhoneInput}
                placeholder="Enter phone with country code (digits only)"
                keyboardType="phone-pad"
                value={phoneInput}
                onChangeText={setPhoneInput}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: PRIMARY_YELLOW }]} onPress={saveNewPhone} disabled={sending}>
                  <Text style={styles.smallButtonText}>Save & Resend</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#e5e7eb' }]} onPress={() => setIsEditingPhone(false)} disabled={sending}>
                  <Text style={[styles.smallButtonText, { color: '#111' }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* OTP Input */}
        <View style={styles.androidOtpContainer}>
          <View style={styles.androidOtpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputRefs[idx]}
                style={styles.androidOtpInput}
                value={digit}
                onChangeText={text => handleChange(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={idx === 0}
                textAlign="center"
              />
            ))}
          </View>
        </View>

        {/* Resend Section */}
        <View style={styles.androidResendContainer}>
          <Text style={styles.androidResendText}>
            Didn't receive OTP ? <Text style={[styles.androidResendLink, timer > 0 && { color: GRAY }]} onPress={handleResend}>Resend SMS in {timer.toString().padStart(2, '0')}s</Text>
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[styles.androidContinueButton, { opacity: otp.join('').length === OTP_LENGTH ? 1 : 0.6 }]}
          onPress={handleContinue} 
          disabled={otp.join('').length !== OTP_LENGTH}
        >
          <Text style={styles.androidContinueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* TEMPORARY DEBUG BYPASS BUTTON */}
        {/* <TouchableOpacity 
          style={[styles.androidContinueButton, { backgroundColor: '#dc2626', marginTop: 12 }]}
          onPress={handleBypassOTP}
        >
          <Text style={styles.androidContinueButtonText}>🚀 DEBUG: Skip OTP</Text>
        </TouchableOpacity> */}

        {/* SIMPLE BYPASS BUTTON (NO API) */}
        <TouchableOpacity 
          style={[styles.androidContinueButton, { backgroundColor: '#059669', marginTop: 8 }]}
          onPress={() => {
            console.log('🟢 SIMPLE BYPASS - Direct navigation');
            navigation.navigate('ChooseLocationMethod');
          }}
        >
          <Text style={styles.androidContinueButtonText}>Get Verified Later</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Desktop web layout (with form frame)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Verification Code</Text>
          <Text style={styles.subtext}>We have sent a verification code to</Text>
          {!isEditingPhone ? (
            <Text style={styles.phoneText}>
              {maskPhone(currentPhone)}{' '}
              <Text style={styles.editText} onPress={() => { setPhoneInput(currentPhone); setIsEditingPhone(true); }}>Edit</Text>
            </Text>
          ) : (
            <View style={{ width: '100%' }}>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter phone with country code (digits only)"
                keyboardType="phone-pad"
                value={phoneInput}
                onChangeText={setPhoneInput}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: PRIMARY_YELLOW }]} onPress={saveNewPhone} disabled={sending}>
                  <Text style={styles.smallButtonText}>Save & Resend</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#e5e7eb' }]} onPress={() => setIsEditingPhone(false)} disabled={sending}>
                  <Text style={[styles.smallButtonText, { color: '#111' }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={inputRefs[idx]}
                style={styles.otpInput}
                value={digit}
                onChangeText={text => handleChange(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={idx === 0}
                textAlign="center"
              />
            ))}
          </View>
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive OTP ? </Text>
            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
              <Text style={[styles.resendLink, timer > 0 && { color: GRAY }]}>Resend SMS in {timer.toString().padStart(2, '0')}s</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.continueButton, { opacity: otp.join('').length === OTP_LENGTH ? 1 : 0.6 }]} onPress={handleContinue} disabled={otp.join('').length !== OTP_LENGTH}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          
          {/* TEMPORARY DEBUG BYPASS BUTTON */}
          {/* <TouchableOpacity 
            style={[styles.continueButton, { backgroundColor: '#dc2626', marginTop: 12 }]}
            onPress={handleBypassOTP}
          >
            <Text style={styles.continueButtonText}>🚀 DEBUG: Skip OTP</Text>
          </TouchableOpacity> */}

          {/* SIMPLE BYPASS BUTTON (NO API) */}
          <TouchableOpacity 
            style={[styles.continueButton, { backgroundColor: '#059669', marginTop: 8 }]}
            onPress={() => {
              console.log('🟢 SIMPLE BYPASS - Direct navigation');
              navigation.navigate('ChooseLocationMethod');
            }}
          >
            <Text style={styles.continueButtonText}>Get Verified Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </div>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    color: GRAY,
    marginBottom: 12,
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 16,
    color: DARK,
    marginBottom: 18,
    textAlign: 'center',
  },
  editText: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 15,
  },
  phoneInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: LIGHT_BG,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 34,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    fontSize: 22,
    backgroundColor: LIGHT_BG,
    textAlign: 'center',
    marginHorizontal: 6,
    marginBottom: 18,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'center',
  },
  resendText: {
    textAlign: 'center',
    color: DARK,
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendLink: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 14,
  },
  continueButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: PRIMARY_YELLOW,
    marginTop: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Android-specific
  androidContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  androidBackButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: DARK,
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: DARK,
    fontWeight: 'bold',
  },
  androidTitleSection: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  androidHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 8,
  },
  androidSubtext: {
    fontSize: 15,
    color: GRAY,
    marginBottom: 12,
  },
  androidPhoneText: {
    fontSize: 16,
    color: DARK,
    marginBottom: 18,
  },
  androidEditText: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 15,
  },
  androidPhoneInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: LIGHT_BG,
  },
  androidOtpContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  androidOtpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  androidOtpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    fontSize: 22,
    backgroundColor: LIGHT_BG,
    textAlign: 'center',
    marginHorizontal: 6,
  },
  androidResendContainer: {
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'center',
  },
  androidResendText: {
    color: DARK,
    fontSize: 14,
    textAlign: 'center',
  },
  androidResendLink: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 14,
  },
  androidContinueButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: PRIMARY_YELLOW,
    marginTop: 8,
  },
  androidContinueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 