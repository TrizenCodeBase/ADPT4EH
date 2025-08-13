import { api } from './api';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const [goal, setGoal] = useState('');
  const [userType, setUserType] = useState('');
  const [agreeUpdates, setAgreeUpdates] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const canComplete = goal && userType && agreeTerms;

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

  // Frameless layout for mobile (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.androidContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.androidBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.androidContent}>
          <Text style={styles.androidLabel}>What is your main goal on Extrahand? *</Text>
          <View style={styles.androidRow}>
            <TouchableOpacity
              style={[styles.androidSelectBtn, goal === 'get' && styles.androidSelectedBtn]}
              onPress={() => setGoal('get')}
            >
              <Text style={[styles.androidSelectIcon, goal === 'get' && styles.androidSelectedIcon]}>✔</Text>
              <Text style={[styles.androidSelectText, goal === 'get' && styles.androidSelectedText]}>Get things done</Text>
            </TouchableOpacity>
                         <TouchableOpacity
               style={[styles.androidSelectBtn, goal === 'earn' && styles.androidSelectedBtn]}
               onPress={() => setGoal('earn')}
             >
               <Text style={[styles.androidSelectIcon, goal === 'earn' && styles.androidSelectedIcon]}>₹</Text>
               <Text style={[styles.androidSelectText, goal === 'earn' && styles.androidSelectedText]}>Earn Money</Text>
             </TouchableOpacity>
          </View>
          <Text style={styles.androidLabel}>Tell us about your self *</Text>
          <View style={styles.androidRow}>
            <TouchableOpacity
              style={[styles.androidSelectBtn, userType === 'individual' && styles.androidSelectedBtn]}
              onPress={() => setUserType('individual')}
            >
              <Text style={[styles.androidSelectIcon, userType === 'individual' && styles.androidSelectedIcon]}>👤</Text>
              <Text style={[styles.androidSelectText, userType === 'individual' && styles.androidSelectedText]}>Individual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.androidSelectBtn, userType === 'business' && styles.androidSelectedBtn]}
              onPress={() => setUserType('business')}
            >
              <Text style={[styles.androidSelectIcon, userType === 'business' && styles.androidSelectedIcon]}>🏢</Text>
              <Text style={[styles.androidSelectText, userType === 'business' && styles.androidSelectedText]}>Business user</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.androidCheckboxRow}>
            <TouchableOpacity style={styles.androidCheckbox} onPress={() => setAgreeUpdates(!agreeUpdates)}>
              <Text style={agreeUpdates ? styles.androidCheckboxChecked : styles.androidCheckboxUnchecked}>✔</Text>
            </TouchableOpacity>
            <Text style={styles.androidCheckboxLabel}>
              I agree to receive product updates, marketing materials and special offers via email, SMS, and push notifications
            </Text>
          </View>
          <View style={styles.androidCheckboxRow}>
            <TouchableOpacity style={styles.androidCheckbox} onPress={() => setAgreeTerms(!agreeTerms)}>
              <Text style={agreeTerms ? styles.androidCheckboxChecked : styles.androidCheckboxUnchecked}>✔</Text>
            </TouchableOpacity>
            <Text style={styles.androidCheckboxLabel}>
              I agree to the Extrahand Terms & Conditions Community Guidelines, and Privacy Policy *
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.androidCompleteBtn, !canComplete && { opacity: 0.5 }]}
            disabled={!canComplete}
            onPress={async () => {
              const roles = goal === 'earn' ? ['tasker'] : ['poster'];
              try { await api.upsertProfile({ name: 'User', roles }); } catch {}
              if (goal === 'earn' && navigation && navigation.navigate) navigation.navigate('PerformerHome');
              else if (goal === 'get' && navigation && navigation.navigate) navigation.navigate('PosterHome');
            }}
          >
            <Text style={styles.androidCompleteText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Desktop web layout (without back button)
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>What is your main goal on Extrahand? *</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectBtn, goal === 'get' && styles.selectedBtn]}
            onPress={() => setGoal('get')}
          >
            <Text style={[styles.selectIcon, goal === 'get' && styles.selectedIcon]}>✔</Text>
            <Text style={[styles.selectText, goal === 'get' && styles.selectedText]}>Get things done</Text>
          </TouchableOpacity>
                     <TouchableOpacity
             style={[styles.selectBtn, goal === 'earn' && styles.selectedBtn]}
             onPress={() => setGoal('earn')}
           >
             <Text style={[styles.selectIcon, goal === 'earn' && styles.selectedIcon]}>₹</Text>
             <Text style={[styles.selectText, goal === 'earn' && styles.selectedText]}>Earn Money</Text>
           </TouchableOpacity>
        </View>
        <Text style={styles.label}>Tell us about your self *</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectBtn, userType === 'individual' && styles.selectedBtn]}
            onPress={() => setUserType('individual')}
          >
            <Text style={[styles.selectIcon, userType === 'individual' && styles.selectedIcon]}>👤</Text>
            <Text style={[styles.selectText, userType === 'individual' && styles.selectedText]}>Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectBtn, userType === 'business' && styles.selectedBtn]}
            onPress={() => setUserType('business')}
          >
            <Text style={[styles.selectIcon, userType === 'business' && styles.selectedIcon]}>🏢</Text>
            <Text style={[styles.selectText, userType === 'business' && styles.selectedText]}>Business user</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeUpdates(!agreeUpdates)}>
            <Text style={agreeUpdates ? styles.checkboxChecked : styles.checkboxUnchecked}>✔</Text>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I agree to receive product updates, marketing materials and special offers via email, SMS, and push notifications
          </Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeTerms(!agreeTerms)}>
            <Text style={agreeTerms ? styles.checkboxChecked : styles.checkboxUnchecked}>✔</Text>
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I agree to the Extrahand Terms & Conditions Community Guidelines, and Privacy Policy *
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.completeBtn, !canComplete && { opacity: 0.5 }]}
          disabled={!canComplete}
          onPress={async () => {
            const roles = goal === 'earn' ? ['tasker'] : ['poster'];
            try { await api.upsertProfile({ name: 'User', roles }); } catch {}
            if (goal === 'earn' && navigation && navigation.navigate) navigation.navigate('PerformerHome');
            else if (goal === 'get' && navigation && navigation.navigate) navigation.navigate('PosterHome');
          }}
        >
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Desktop web styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60,
  },
  label: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedBtn: {
    backgroundColor: PRIMARY_YELLOW,
    borderColor: PRIMARY_YELLOW,
  },
  selectIcon: {
    fontSize: 22,
    marginBottom: 8,
    color: DARK,
  },
  selectedIcon: {
    color: '#fff',
  },
  selectText: {
    fontSize: 15,
    color: DARK,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    width: '100%',
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: PRIMARY_YELLOW,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    color: PRIMARY_YELLOW,
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxUnchecked: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: DARK,
    fontWeight: '400',
  },
  completeBtn: {
    width: '100%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  completeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Mobile/Android styles
  androidContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingTop: 80,
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
  androidContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  androidLabel: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: '100%',
  },
  androidRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  androidSelectBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
    minHeight: 100,
  },
  androidSelectedBtn: {
    backgroundColor: PRIMARY_YELLOW,
    borderColor: PRIMARY_YELLOW,
  },
  androidSelectIcon: {
    fontSize: 24,
    marginBottom: 12,
    color: DARK,
  },
  androidSelectedIcon: {
    color: '#fff',
  },
  androidSelectText: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
    textAlign: 'center',
  },
  androidSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  androidCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  androidCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: PRIMARY_YELLOW,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#fff',
  },
  androidCheckboxChecked: {
    color: PRIMARY_YELLOW,
    fontSize: 18,
    fontWeight: 'bold',
  },
  androidCheckboxUnchecked: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  androidCheckboxLabel: {
    flex: 1,
    fontSize: 14,
    color: DARK,
    fontWeight: '400',
    lineHeight: 20,
  },
  androidCompleteBtn: {
    width: '100%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  androidCompleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RoleSelectionScreen; 