import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useNavigation } from '../SimpleNavigation';
import { useAuth } from '../AuthContext';

const DARK = '#222';

interface MobileNavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ 
  title, 
  showBackButton = false, 
  onBackPress 
}) => {
  const navigation = useNavigation();
  const { currentUser, userData, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuPress = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (route: string) => {
    setIsMenuOpen(false);
    navigation.navigate(route);
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const menuItems = [
    { label: 'Home', route: 'PerformerHome', icon: '⌂' },
    { label: 'Browse Tasks', route: 'TaskListing', icon: '☐' },
    { label: 'Post a Task', route: 'TaskPostingForm', icon: '＋' },
    { label: 'My Tasks', route: 'TaskListing', icon: '📋' },
    { label: 'Chat', route: 'Chat', icon: '💬' },
    { label: 'Profile', route: 'Profile', icon: '👤' },
    { label: 'Settings', route: 'Profile', icon: '⚙️' },
  ];

  return (
    <>
      {/* Mobile Navigation Bar */}
      <View style={styles.mobileNavBar}>
        {/* Left: Back Button or Logo */}
        <View style={styles.mobileNavLeft}>
          {showBackButton ? (
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          ) : (
                         <View style={styles.logoContainer}>
               <Image
                 source={require('../../assets/images/logo.png')}
                 style={styles.logoImage}
                 resizeMode="contain"
               />
               <Text style={styles.logoText}>Extrahand</Text>
             </View>
          )}
        </View>

        {/* Center: Title (if provided) */}
        {title && (
          <View style={styles.mobileNavCenter}>
            <Text style={styles.mobileNavTitle}>{title}</Text>
          </View>
        )}

        {/* Right: Hamburger Menu */}
        <View style={styles.mobileNavRight}>
          <TouchableOpacity style={styles.hamburgerButton} onPress={handleMenuPress}>
            <View style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1} 
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
                             <View style={styles.menuLogoContainer}>
                 <Image
                   source={require('../../assets/images/logo.png')}
                   style={styles.menuLogoImage}
                   resizeMode="contain"
                 />
                 <Text style={styles.menuLogoText}>Extrahand</Text>
               </View>
              <TouchableOpacity 
                style={styles.menuCloseButton} 
                onPress={() => setIsMenuOpen(false)}
              >
                <Text style={styles.menuCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.route)}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* User Info Section */}
            {currentUser && (
              <View style={styles.menuUserSection}>
                <View style={styles.menuUserInfo}>
                  <Text style={styles.menuUserName}>
                    {userData?.firstName || userData?.name || 'User'}
                  </Text>
                  <Text style={styles.menuUserEmail}>
                    {userData?.email || currentUser.email}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.menuLogoutButton}
                  onPress={async () => {
                    setIsMenuOpen(false);
                    try {
                      await logout();
                      // Navigation will be handled automatically by AuthContext
                      // The user will be redirected to Landing page
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                >
                  <Text style={styles.menuLogoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mobileNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    height: 60,
  },
  mobileNavLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  mobileNavCenter: {
    flex: 2,
    alignItems: 'center',
  },
  mobileNavRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: DARK,
    fontWeight: 'bold',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK,
  },
  mobileNavTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
  },
  hamburgerButton: {
    padding: 8,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: DARK,
    borderRadius: 1,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80%',
    maxWidth: 300,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLogoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  menuLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK,
  },
  menuCloseButton: {
    padding: 8,
  },
  menuCloseText: {
    fontSize: 20,
    color: DARK,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
  },
  menuUserSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  menuUserInfo: {
    marginBottom: 16,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 4,
  },
  menuUserEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuLogoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuLogoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MobileNavBar;
