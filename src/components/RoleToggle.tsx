import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../AuthContext';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';
const LIGHT_GRAY = '#f5f5f5';

interface RoleToggleProps {
  onRoleChange?: (role: 'performer' | 'poster') => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ onRoleChange }) => {
  const { userData, refreshUserData } = useAuth();
  
  // Determine current role based on user data
  const getCurrentRole = () => {
    if (!userData?.roles) return 'poster';
    if (userData.roles.includes('tasker') && !userData.roles.includes('poster')) return 'performer';
    if (userData.roles.includes('poster') && !userData.roles.includes('tasker')) return 'poster';
    // If user has both roles, default to poster
    return 'poster';
  };

  const currentRole = getCurrentRole();

  const handleRoleChange = async (newRole: 'performer' | 'poster') => {
    if (newRole === currentRole) return;

    try {
      // Update user roles in backend
      const newRoles = newRole === 'performer' ? ['tasker'] : ['poster'];
      
      // Call the API to update roles
      const { api } = await import('../api');
      await api.upsertProfile({
        ...userData,
        roles: newRoles
      });

      // Refresh user data to get updated roles
      await refreshUserData();

      // Notify parent component
      onRoleChange?.(newRole);
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
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
    color: '#fff',
  },
});

export default RoleToggle;
