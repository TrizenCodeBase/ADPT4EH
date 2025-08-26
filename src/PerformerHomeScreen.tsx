import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { useAuth } from './AuthContext';
import { api } from './api';
import Footer from './Footer';
import MobileNavBar from './components/MobileNavBar';
import DevModeBanner from './components/DevModeBanner';
import RoleToggle from './components/RoleToggle';
import { FEATURE_FLAGS } from './config';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';
const DARK = '#222';

const categories = [
  "Accountants", "Admin", "Alterations", "Appliances", "Assembly", "Auto Electricians", "Bakers", "Barbers", "Beauticians", "Bicycle Service", "Bricklaying", "Building & Construction", "Business", "Car Body Work", "Car Detailing", "Car Repair", "Car Service", "Carpentry", "Cat Care", "Catering", "Chef", "Cladding", "Cleaning", "Computers & IT", "Concreting", "Decking", "Delivery", "Design", "Dog Care", "Draftsman", "Driving", "Electricians", "Entertainment", "Events", "Fencing", "Flooring", "Florist", "Furniture Assembly", "Gardening", "Gate Installation", "Hairdressers", "Handyman", "Heating & Cooling", "Home", "Automation And Security", "Home Theatre", "Interior Designer", "Landscaping", "Laundry", "Lawn Care", "Lessons", "Locksmith", "Makeup Artist", "Marketing", "Mobile Mechanic", "Painting", "Paving", "Pet Care", "Photographers", "Plasterer", "Plumbing", "Pool Maintenance", "Removals", "Roofing", "Sharpening", "Staffing", "Tailors", "Tattoo Artists", "Tiling", "Tradesman", "Tutoring", "Wall Hanging & Mounting", "Wallpapering", "Waterproofing", "Web", "Wheel & Tyre Service", "Writing"
];

// Utility function to format time ago
const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// Utility function to format budget
const formatBudget = (budget: any) => {
  if (!budget) return '₹0';
  const amount = budget.amount || budget;
  const currency = budget.currency || 'INR';
  return `${currency === 'INR' ? '₹' : '$'}${amount}`;
};

// Utility function to get default avatar
const getDefaultAvatar = (name: string) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=100`;
};

const PerformerHomeScreen = () => {
  const navigation = useNavigation();
  const { currentUser, userData, logout } = useAuth();
  const [isMobileView, setIsMobileView] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<any>(null);

  // Fetch tasks from database
  const fetchTasks = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        status: 'open',
        limit: '50',
        ...filters
      };

      // If user is logged in, get recommended tasks
      if (currentUser && userData) {
        params.recommend = 'true';
      }

      const response = await api.getTasks(params);
      const fetchedTasks = response.tasks || response || [];
      
      // Transform tasks to match the expected format
      const transformedTasks = fetchedTasks.map((task: any) => ({
        id: task.id,
        title: task.title || task.description?.split('\n')[0] || 'Untitled Task',
        location: task.location?.address || 'Location not specified',
        date: task.preferredTime?.startDate ? new Date(task.preferredTime.startDate).toLocaleDateString() : 'Flexible',
        time: task.preferredTime?.timeSlots?.join(', ') || 'Anytime',
        price: formatBudget(task.budget),
        budget: formatBudget(task.budget),
        status: task.status || 'Open',
        poster: task.creator?.name || 'Anonymous',
        postedTime: formatTimeAgo(task.createdAt),
        dueDate: task.preferredTime?.endDate ? new Date(task.preferredTime.endDate).toLocaleDateString() : 'Flexible',
        dueTime: task.preferredTime?.timeSlots?.join(', ') || 'Anytime',
        description: task.description || 'No description provided',
        images: task.images || [],
        avatar: task.creator?.photoURL || getDefaultAvatar(task.creator?.name || 'Anonymous'),
        type: task.type,
        skillsRequired: task.skillsRequired || [],
        isUrgent: task.isUrgent || false,
        views: task.views || 0,
        applications: task.applications || 0
      }));

      setTasks(transformedTasks);
      
      // Set first task as selected for desktop view
      if (transformedTasks.length > 0 && !selectedTask) {
        setSelectedTask(transformedTasks[0]);
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
      // Fallback to empty array
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search and category
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || task.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    console.log(`Selected category: ${category}`);
    setSelectedCategory(category === selectedCategory ? null : category);
    setShowCategories(false);
    return false;
  };

  // Handle task card click
  const handleTaskClick = (taskId: string) => {
    if (isMobileView) {
      navigation.navigate('TaskDetails', { taskId });
    } else {
      // For desktop, update the selected task to show in right panel
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
      }
    }
  };

  // Handle open button click
  const handleOpenClick = (taskId: string) => {
    if (isMobileView) {
      navigation.navigate('TaskDetails', { taskId });
    } else {
      // For desktop, update the selected task to show in right panel
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setSelectedTask(task);
      }
    }
  };

  // Handle make offer button click
  const handleMakeOffer = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please login to make an offer');
      return;
    }
    navigation.navigate('MakeOfferDetails', { taskId: selectedTask?.id });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  // Initial data fetch
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Handle dropdown click outside
  useEffect(() => {
    if (!showCategories) return;
    
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCategories]);

  // Mobile layout (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.mobileContainer}>
        {/* Development Mode Banner */}
        <DevModeBanner 
          isVisible={FEATURE_FLAGS.showDevBanner} 
          message="🛠️ DEVELOPMENT MODE - Using Mock Data"
        />
        
        {/* Mobile Navigation Bar */}
        <MobileNavBar />

        {/* Search and Filters */}
        <View style={styles.mobileSearchRow}>
          <View style={styles.mobileSearchContainer}>
            <Text style={styles.mobileSearchIcon}>🔍</Text>
            <TextInput 
              style={styles.mobileSearchInput} 
              placeholder="Search for a task" 
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <TouchableOpacity 
            style={[styles.mobileFilterBtn, selectedCategory && styles.mobileFilterBtnActive]}
            onPress={() => setShowCategories(!showCategories)}
          >
            <Text style={[styles.mobileFilterText, selectedCategory && styles.mobileFilterTextActive]}>
              {selectedCategory || 'Category'} {selectedCategory ? '✓' : '▼'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mobileFilterBtn}
            onPress={() => fetchTasks()}
          >
            <Text style={styles.mobileFilterText}>🔄</Text>
          </TouchableOpacity>
        </View>
        {(selectedCategory || searchQuery) && (
          <View style={styles.mobileFilterRow}>
            <TouchableOpacity 
              style={styles.mobileClearFilterBtn}
              onPress={clearFilters}
            >
              <Text style={styles.mobileClearFilterText}>✕ Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Task List */}
        <ScrollView style={styles.mobileTaskList} contentContainerStyle={{ paddingBottom: 100 }}>
          {loading ? (
            <ActivityIndicator size="large" color={PRIMARY_BLUE} style={{ marginTop: 50 }} />
          ) : error ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ textAlign: 'center', color: 'red', marginBottom: 10 }}>{error}</Text>
              <TouchableOpacity 
                style={{ backgroundColor: PRIMARY_BLUE, padding: 10, borderRadius: 8 }}
                onPress={() => fetchTasks()}
              >
                <Text style={{ color: 'white' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredTasks.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ textAlign: 'center', marginBottom: 10 }}>No tasks found matching your criteria.</Text>
              <TouchableOpacity 
                style={{ backgroundColor: PRIMARY_BLUE, padding: 10, borderRadius: 8 }}
                onPress={() => fetchTasks()}
              >
                <Text style={{ color: 'white' }}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredTasks.map(task => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.mobileTaskCard}
                onPress={() => handleTaskClick(task.id)}
              >
                <View style={styles.mobileTaskContent}>
                  <View style={styles.mobileTaskLeft}>
                    <Text style={styles.mobileTaskTitle}>{task.title}</Text>
                    <View style={styles.mobileTaskMetaRow}>
                      <Text style={styles.mobileTaskMeta}>📍 {task.location}</Text>
                      <Text style={styles.mobileTaskMeta}>📅 {task.date}</Text>
                      {task.time ? <Text style={styles.mobileTaskMeta}>⏰ {task.time}</Text> : null}
                    </View>
                    <Text style={styles.mobileTaskStatus}>{task.status}</Text>
                  </View>
                  <View style={styles.mobileTaskRight}>
                    <Text style={styles.mobileTaskPrice}>{task.price}</Text>
                    <Image source={{ uri: task.avatar }} style={styles.mobileAvatar} />
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.mobileOpenButton}
                  onPress={() => handleOpenClick(task.id)}
                >
                  <Text style={styles.mobileOpenButtonText}>Open</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>


      </View>
    );
  }

  // Desktop web layout (new implementation based on reference image)
  return (
    <View style={styles.desktopContainer}>
      {/* Development Mode Banner */}
      <DevModeBanner 
        isVisible={FEATURE_FLAGS.showDevBanner} 
        message="🛠️ DEVELOPMENT MODE - Using Mock Data"
      />
      {/* Header */}
      <View style={styles.desktopHeader}>
        <View style={styles.desktopHeaderContent}>
          {/* Left: Logo */}
          <View style={styles.desktopLogoSection}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.desktopLogoImage}
              resizeMode="contain"
            />
            <Text style={styles.desktopLogoText}>Extrahand</Text>
          </View>
          
          {/* Center: Navigation Menu */}
          <View style={styles.desktopCenterMenu}>
            <TouchableOpacity style={styles.desktopMenuButton}>
              <Text style={styles.desktopMenuButtonText}>Post a Task</Text>
            </TouchableOpacity>
            <View ref={dropdownRef} style={styles.desktopDropdownContainer}>
              <TouchableOpacity 
                style={styles.desktopMenuLink}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text style={styles.desktopMenuLinkText}>Browse Tasks</Text>
              </TouchableOpacity>
              {showCategories && (
                <View style={styles.desktopCategoriesDropdown}>
                  <View style={styles.desktopDropdownContent}>
                    {Array.from({ length: 4 }).map((_, colIdx) => (
                      <View key={colIdx} style={styles.desktopDropdownColumn}>
                        {categories
                          .slice(
                            Math.floor((categories.length / 4) * colIdx),
                            Math.floor((categories.length / 4) * (colIdx + 1))
                          )
                          .map((cat) => (
                            <TouchableOpacity 
                              key={cat} 
                              style={styles.desktopDropdownItem} 
                              onPress={() => handleCategoryClick(cat)}
                            >
                              <Text style={styles.desktopDropdownItemText}>{cat}</Text>
                            </TouchableOpacity>
                          ))}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.desktopMenuLink}>
              <Text style={styles.desktopMenuLinkText}>My Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopMenuLink}>
              <Text style={styles.desktopMenuLinkText}>List my services</Text>
            </TouchableOpacity>
          </View>
          
          {/* Right: Profile Icon and Logout */}
          <View style={styles.desktopRightMenu}>
            <RoleToggle />
            <TouchableOpacity 
              style={styles.desktopMenuLink}
              onPress={() => navigation.navigate('Chat')}
            >
              <Text style={styles.desktopMenuLinkText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.desktopProfileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.desktopProfileIcon}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.desktopLogoutButton}
              onPress={async () => {
                try {
                  await logout();
                  // Navigation will be handled automatically by AuthContext
                } catch (error) {
                  console.error('Logout failed:', error);
                }
              }}
            >
              <Text style={styles.desktopLogoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.desktopFilterSection}>
        <View style={styles.desktopSearchContainer}>
          <Text style={styles.desktopSearchIcon}>🔍</Text>
          <TextInput 
            style={styles.desktopSearchInput} 
            placeholder="Search for a task" 
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <View style={styles.desktopFilterRow}>
          <TouchableOpacity style={styles.desktopFilterButton}>
            <Text style={styles.desktopFilterText}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopFilterButton}>
            <Text style={styles.desktopFilterText}>50km Adelaide SA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopFilterButton}>
            <Text style={styles.desktopFilterText}>Any price</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopFilterButton}>
            <Text style={styles.desktopFilterText}>Other filters (1)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopFilterButton}>
            <Text style={styles.desktopFilterText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.desktopFilterButton}
            onPress={() => fetchTasks()}
          >
            <Text style={styles.desktopFilterText}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Task List and Map */}
      <View style={styles.desktopMainContent}>
        {/* Left Side - Task List */}
        <View style={styles.desktopTaskListSection}>
          <View style={styles.desktopTaskListHeader}>
            <Text style={styles.desktopTaskListTitle}>Available Tasks</Text>
          </View>
          <ScrollView 
            style={styles.desktopTaskList} 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.desktopTaskListContent}
          >
            {loading ? (
              <ActivityIndicator size="large" color={PRIMARY_BLUE} style={{ marginTop: 50 }} />
            ) : error ? (
              <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>{error}</Text>
            ) : filteredTasks.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 50 }}>No tasks found matching your criteria.</Text>
            ) : (
              filteredTasks.map(task => (
                <TouchableOpacity 
                  key={task.id} 
                  style={[
                    styles.desktopTaskCard,
                    selectedTask?.id === task.id && styles.desktopTaskCardSelected
                  ]}
                  onPress={() => handleTaskClick(task.id)}
                >
                  <View style={styles.desktopTaskContent}>
                    <View style={styles.desktopTaskLeft}>
                      <Text style={styles.desktopTaskTitle}>{task.title}</Text>
                      <View style={styles.desktopTaskMetaRow}>
                        <Text style={styles.desktopTaskMeta}>📍 {task.location}</Text>
                        <Text style={styles.desktopTaskMeta}>📅 {task.date}</Text>
                        {task.time ? <Text style={styles.desktopTaskMeta}>⏰ {task.time}</Text> : null}
                      </View>
                      <Text style={styles.desktopTaskStatus}>{task.status}</Text>
                    </View>
                    <View style={styles.desktopTaskRight}>
                      <Text style={styles.desktopTaskPrice}>{task.price}</Text>
                      <Image source={{ uri: task.avatar }} style={styles.desktopAvatar} />
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.desktopOpenButton}
                    onPress={() => handleOpenClick(task.id)}
                  >
                    <Text style={styles.desktopOpenButtonText}>Open</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Right Side - Task Details */}
        <View style={styles.desktopTaskDetailsSection}>
          <View style={styles.desktopTaskDetailsHeader}>
            <Text style={styles.desktopTaskDetailsTitle}>Task Details</Text>
          </View>
          <ScrollView style={styles.desktopTaskDetailsScroll} showsVerticalScrollIndicator={true}>
            <View style={styles.desktopTaskDetailsContent}>
              
              {/* Status Badge */}
              <View style={styles.desktopTaskDetailsStatusContainer}>
                <View style={styles.desktopTaskDetailsStatusBadge}>
                  <Text style={styles.desktopTaskDetailsStatusText}>{selectedTask?.status}</Text>
                </View>
              </View>

              {/* Task Title */}
              <Text style={styles.desktopTaskDetailsTaskTitle}>{selectedTask?.title}</Text>

              {/* Price and Make Offer Section */}
              <View style={styles.desktopTaskDetailsPriceCard}>
                <Text style={styles.desktopTaskDetailsPriceLabel}>Task Budget</Text>
                <Text style={styles.desktopTaskDetailsPriceAmount}>{selectedTask?.budget}</Text>
                <TouchableOpacity style={styles.desktopTaskDetailsMakeOfferButton} onPress={handleMakeOffer}>
                  <Text style={styles.desktopTaskDetailsMakeOfferText}>Make an offer</Text>
                </TouchableOpacity>
              </View>

              {/* Task Information Card */}
              <View style={styles.desktopTaskDetailsInfoCard}>
                
                {/* Poster Information */}
                <View style={styles.desktopTaskDetailsInfoSection}>
                  <View style={styles.desktopTaskDetailsInfoRow}>
                    <View style={styles.desktopTaskDetailsInfoIcon}>
                      <View style={styles.desktopTaskDetailsPosterAvatar}>
                        <Text style={styles.desktopTaskDetailsPosterInitial}>{selectedTask?.poster?.charAt(0) || '?'}</Text>
                      </View>
                    </View>
                    <View style={styles.desktopTaskDetailsInfoContent}>
                      <Text style={styles.desktopTaskDetailsInfoLabel}>Posted by</Text>
                      <Text style={styles.desktopTaskDetailsInfoValue}>{selectedTask?.poster || 'Anonymous'}</Text>
                      <Text style={styles.desktopTaskDetailsInfoSubtext}>{selectedTask?.postedTime}</Text>
                    </View>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.desktopTaskDetailsInfoSection}>
                  <View style={styles.desktopTaskDetailsInfoRow}>
                    <View style={styles.desktopTaskDetailsInfoIcon}>
                      <Text style={styles.desktopTaskDetailsInfoIconText}>📍</Text>
                    </View>
                    <View style={styles.desktopTaskDetailsInfoContent}>
                      <Text style={styles.desktopTaskDetailsInfoLabel}>Location</Text>
                      <Text style={styles.desktopTaskDetailsInfoValue}>{selectedTask?.location}</Text>
                    </View>
                  </View>
                </View>

                {/* Due Date */}
                <View style={styles.desktopTaskDetailsInfoSection}>
                  <View style={styles.desktopTaskDetailsInfoRow}>
                    <View style={styles.desktopTaskDetailsInfoIcon}>
                      <Text style={styles.desktopTaskDetailsInfoIconText}>📅</Text>
                    </View>
                    <View style={styles.desktopTaskDetailsInfoContent}>
                      <Text style={styles.desktopTaskDetailsInfoLabel}>Due date</Text>
                      <Text style={styles.desktopTaskDetailsInfoValue}>{selectedTask?.dueDate}</Text>
                      <Text style={styles.desktopTaskDetailsInfoSubtext}>{selectedTask?.dueTime}</Text>
                    </View>
                  </View>
                </View>

              </View>

              {/* Task Description */}
              <View style={styles.desktopTaskDetailsDescriptionCard}>
                <Text style={styles.desktopTaskDetailsDescriptionTitle}>What you need to do</Text>
                <Text style={styles.desktopTaskDetailsDescriptionText}>{selectedTask?.description}</Text>
              </View>

              {/* Task Images */}
              {selectedTask?.images && selectedTask.images.length > 0 && (
                <View style={styles.desktopTaskDetailsImagesCard}>
                  <Text style={styles.desktopTaskDetailsImagesTitle}>Photos</Text>
                  <View style={styles.desktopTaskDetailsImageGrid}>
                    {selectedTask.images.map((image: string, index: number) => (
                      <View key={index} style={styles.desktopTaskDetailsImageContainer}>
                        <View style={styles.desktopTaskDetailsImagePlaceholder}>
                          <Text style={styles.desktopTaskDetailsImageText}>Photo {index + 1}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            </View>
          </ScrollView>
        </View>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  // Desktop web styles (new implementation)
  desktopContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  desktopHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
    zIndex: 2000,
  },
  desktopHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2000,
  },
  desktopLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopLogoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  desktopLogoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  desktopCenterMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  desktopMenuButton: {
    backgroundColor: '#ffcc30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  desktopMenuButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  desktopMenuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  desktopMenuLinkText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  desktopRightMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  desktopProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  desktopProfileIcon: {
    fontSize: 20,
    color: '#666',
  },
  desktopLogoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  desktopLogoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  desktopFilterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  desktopSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  desktopSearchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  desktopSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  desktopFilterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  desktopFilterButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  desktopFilterText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
  desktopMainContent: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  desktopTaskListSection: {
    width: '40%',
    backgroundColor: '#f9fafb',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    height: 600, // Fixed height to prevent scrolling with map
  },
  desktopTaskListHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  desktopTaskListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  desktopTaskList: {
    flex: 1,
    overflow: 'hidden',
  },
  desktopTaskListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  desktopTaskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  desktopTaskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  desktopTaskLeft: {
    flex: 1,
    marginRight: 12,
  },
  desktopTaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 18,
  },
  desktopTaskMetaRow: {
    marginBottom: 6,
  },
  desktopTaskMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  desktopTaskStatus: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  desktopTaskRight: {
    alignItems: 'center',
  },
  desktopTaskPrice: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  desktopAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  desktopOpenButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  desktopOpenButtonText: {
    color: PRIMARY_BLUE,
    fontSize: 16,
    fontWeight: '500',
  },
  desktopTaskCardSelected: {
    borderWidth: 2,
    borderColor: PRIMARY_BLUE,
    backgroundColor: '#f0f7ff',
  },
  desktopTaskDetailsSection: {
    flex: 1,
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    height: 600, // Fixed height to match task list
  },
  desktopTaskDetailsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  desktopTaskDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  desktopTaskDetailsScroll: {
    flex: 1,
  },
  desktopTaskDetailsContent: {
    padding: 20,
  },
  desktopTaskDetailsStatusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  desktopTaskDetailsStatusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  desktopTaskDetailsStatusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  desktopTaskDetailsTaskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  desktopTaskDetailsPriceCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  desktopTaskDetailsPriceLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  desktopTaskDetailsPriceAmount: {
    fontSize: 28,
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  desktopTaskDetailsMakeOfferButton: {
    backgroundColor: PRIMARY_YELLOW,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  desktopTaskDetailsMakeOfferText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  desktopTaskDetailsInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  desktopTaskDetailsInfoSection: {
    marginBottom: 15,
  },
  desktopTaskDetailsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopTaskDetailsInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  desktopTaskDetailsPosterAvatar: {
    backgroundColor: PRIMARY_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopTaskDetailsPosterInitial: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  desktopTaskDetailsInfoContent: {
    flex: 1,
  },
  desktopTaskDetailsInfoLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  desktopTaskDetailsInfoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  desktopTaskDetailsInfoSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  desktopTaskDetailsInfoIconText: {
    fontSize: 18,
  },
  desktopTaskDetailsDescriptionCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  desktopTaskDetailsDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  desktopTaskDetailsDescriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  desktopTaskDetailsImagesCard: {
    marginBottom: 20,
  },
  desktopTaskDetailsImagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  desktopTaskDetailsImageGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  desktopTaskDetailsImageContainer: {
    flex: 1,
  },
  desktopTaskDetailsImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopTaskDetailsImageText: {
    fontSize: 14,
    color: '#666',
  },
  desktopDropdownContainer: {
    position: 'relative',
  },
  desktopDropdownIcon: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  desktopCategoriesDropdown: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: -325,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    zIndex: 3000,
    padding: 24,
    minWidth: 650,
    maxHeight: 350,
    overflow: 'scroll',
  },
  desktopDropdownContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    padding: 0,
  },
  desktopDropdownColumn: {
    width: '24%',
    marginBottom: 0,
  },
  desktopDropdownItem: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 4,
  },
  desktopDropdownItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },

  // Mobile styles (existing)
  mobileContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mobileLocationContainer: {
    flex: 1,
  },
  mobileLocationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 2,
  },
  mobileLocationSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  mobileLogoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mobileLogoImage: {
    width: 32,
    height: 32,
  },
  mobileNavMenu: {
    flexDirection: 'column', // Changed to column for mobile
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mobileNavRow: { // New style for rows within the menu
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  mobileNavButton: {
    backgroundColor: '#ffcc30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mobileNavButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  mobileNavLink: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  mobileNavLinkText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  mobileDropdownContainer: {
    position: 'relative',
  },
  mobileCategoriesDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
    width: 300, // Fixed width for mobile
    maxHeight: 400, // Max height for mobile
  },
  mobileDropdownContent: {
    flexDirection: 'column', // Changed to column for mobile
    gap: 8,
  },
  mobileDropdownColumn: {
    width: '100%', // Full width for mobile
    gap: 8,
  },
  mobileDropdownItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mobileDropdownItemText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  mobileSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  mobileSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  mobileSearchIcon: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  mobileSearchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK,
  },
  mobileFilterBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mobileFilterText: {
    color: DARK,
    fontSize: 13,
  },
  mobileTaskList: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  mobileTaskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  mobileTaskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mobileTaskLeft: {
    flex: 1,
    marginRight: 12,
  },
  mobileTaskTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 8,
    lineHeight: 20,
  },
  mobileTaskMetaRow: {
    marginBottom: 8,
  },
  mobileTaskMeta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  mobileTaskStatus: {
    color: PRIMARY_YELLOW,
    fontSize: 13,
    fontWeight: 'bold',
  },
  mobileTaskRight: {
    alignItems: 'center',
  },
  mobileTaskPrice: {
    color: DARK,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  mobileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mobileOpenButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  mobileOpenButtonText: {
    color: PRIMARY_BLUE,
    fontSize: 14,
    fontWeight: '500',
  },
  mobileBottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  mobileNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  mobileNavActive: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  mobileNavIcon: {
    fontSize: 20,
    color: '#000',
    marginBottom: 2,
  },
  mobileNavIconActive: {
    color: '#000',
  },
  mobileNavLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  mobileNavLabelActive: {
    color: DARK,
    fontWeight: '500',
  },
  mobileFilterBtnActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  mobileFilterTextActive: {
    color: '#fff',
  },
  mobileFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  mobileClearFilterBtn: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mobileClearFilterText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PerformerHomeScreen; 