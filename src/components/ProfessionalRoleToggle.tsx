import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../AuthContext';
import { useNavigation } from '../SimpleNavigation';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';
const LIGHT_GRAY = '#f5f5f5';
const WHITE = '#ffffff';
const BORDER_GRAY = '#e0e0e0';

interface ProfessionalRoleToggleProps {
  onRoleChange?: (role: 'performer' | 'poster') => void;
  compact?: boolean;
}

const ProfessionalRoleToggle: React.FC<ProfessionalRoleToggleProps> = ({ 
  onRoleChange, 
  compact = false 
}) => {
  const { userData, refreshUserData } = useAuth();
  const { navigate } = useNavigation();

  const getCurrentRole = () => {
    if (!userData?.roles) return 'poster';
    if (userData.roles.includes('tasker') && !userData.roles.includes('poster')) return 'performer';
    if (userData.roles.includes('poster') && !userData.roles.includes('tasker')) return 'poster';
    return 'poster';
  };

  const currentRole = getCurrentRole();

  const handleRoleChange = async (newRole: 'performer' | 'poster') => {
    if (newRole === currentRole) return;

    try {
      const newRoles = newRole === 'performer' ? ['tasker'] : ['poster'];

      const { api } = await import('../api');
      await api.upsertProfile({
        ...userData,
        roles: newRoles
      });

      await refreshUserData();
      onRoleChange?.(newRole);
      
      // Navigate to the appropriate home screen based on the new role
      const targetRoute = newRole === 'performer' ? 'PerformerHome' : 'PosterHome';
      console.log('🔄 Role changed to', newRole, '- navigating to', targetRoute);
      navigate(targetRoute);
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  if (compact) {
             // Compact version for profile section
         return (
           <View style={styles.compactContainer}>
             <View style={styles.compactToggleContainer}>
          <TouchableOpacity
            style={[
              styles.compactToggleButton,
              currentRole === 'poster' && styles.compactActiveToggleButton
            ]}
            onPress={() => handleRoleChange('poster')}
            accessibilityLabel="Switch to Poster role"
            accessibilityRole="button"
            accessibilityState={{ selected: currentRole === 'poster' }}
          >
            <Text style={[
              styles.compactToggleText,
              currentRole === 'poster' && styles.compactActiveToggleText
            ]}>
              Poster
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.compactToggleButton,
              currentRole === 'performer' && styles.compactActiveToggleButton
            ]}
            onPress={() => handleRoleChange('performer')}
            accessibilityLabel="Switch to Performer role"
            accessibilityRole="button"
            accessibilityState={{ selected: currentRole === 'performer' }}
          >
            <Text style={[
              styles.compactToggleText,
              currentRole === 'performer' && styles.compactActiveToggleText
            ]}>
              Performer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Full version for other screens
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Role:</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentRole === 'poster' && styles.activeToggleButton
          ]}
          onPress={() => handleRoleChange('poster')}
          accessibilityLabel="Switch to Poster role"
          accessibilityRole="button"
          accessibilityState={{ selected: currentRole === 'poster' }}
        >
          <Text style={[
            styles.toggleText,
            currentRole === 'poster' && styles.activeToggleText
          ]}>
            Poster
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentRole === 'performer' && styles.activeToggleButton
          ]}
          onPress={() => handleRoleChange('performer')}
          accessibilityLabel="Switch to Performer role"
          accessibilityRole="button"
          accessibilityState={{ selected: currentRole === 'performer' }}
        >
          <Text style={[
            styles.toggleText,
            currentRole === 'performer' && styles.activeToggleText
          ]}>
            Performer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Full version styles
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: WHITE,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    }),
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK,
    marginRight: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 6,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: PRIMARY_YELLOW,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK,
  },
  activeToggleText: {
    color: WHITE,
  },

           // Compact version styles for profile section
         compactContainer: {
           position: 'absolute',
           top: 60,
           right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    }),
    zIndex: 1000,
  },
  
  compactToggleContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    padding: 2,
  },
  compactToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  compactActiveToggleButton: {
    backgroundColor: PRIMARY_YELLOW,
  },
  compactToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: DARK,
  },
  compactActiveToggleText: {
    color: WHITE,
  },
});

export default ProfessionalRoleToggle;
