import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Platform, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import Footer from './Footer';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';
const DARK = '#222';

const categories = [
  "Accountants", "Admin", "Alterations", "Appliances", "Assembly", "Auto Electricians", "Bakers", "Barbers", "Beauticians", "Bicycle Service", "Bricklaying", "Building & Construction", "Business", "Car Body Work", "Car Detailing", "Car Repair", "Car Service", "Carpentry", "Cat Care", "Catering", "Chef", "Cladding", "Cleaning", "Computers & IT", "Concreting", "Decking", "Delivery", "Design", "Dog Care", "Draftsman", "Driving", "Electricians", "Entertainment", "Events", "Fencing", "Flooring", "Florist", "Furniture Assembly", "Gardening", "Gate Installation", "Hairdressers", "Handyman", "Heating & Cooling", "Home", "Automation And Security", "Home Theatre", "Interior Designer", "Landscaping", "Laundry", "Lawn Care", "Lessons", "Locksmith", "Makeup Artist", "Marketing", "Mobile Mechanic", "Painting", "Paving", "Pet Care", "Photographers", "Plasterer", "Plumbing", "Pool Maintenance", "Removals", "Roofing", "Sharpening", "Staffing", "Tailors", "Tattoo Artists", "Tiling", "Tradesman", "Tutoring", "Wall Hanging & Mounting", "Wallpapering", "Waterproofing", "Web", "Wheel & Tyre Service", "Writing"
];

const dummyTasks = [
  {
    id: 1,
    title: 'Replace a kitchen tap',
    location: 'Hyderabad',
    date: 'Tomorrow',
    time: 'Anytime',
    price: 'RS 249',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    title: 'Plumber (leakage fix, pipe installation, bathroom fitting)',
    location: 'Hyderabad',
    date: 'Before 14 July',
    time: 'Anytime',
    price: 'RS 149',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    title: 'Home Deep Cleaning',
    location: 'Basheerbagh',
    date: 'Tomorrow',
    time: 'Anytime',
    price: 'RS 249',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    id: 4,
    title: 'Sofa & Carpet Cleaning',
    location: 'Hyderabad',
    date: 'Flexible',
    time: '',
    price: 'RS 560',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
  {
    id: 5,
    title: 'Flyer drop in Northgate area',
    location: 'Northgate SA',
    date: 'Before Mon, 4 Aug',
    time: 'Anytime',
    price: '$100',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: 6,
    title: 'I need to do gyprock fixing',
    location: 'Enfield SA',
    date: 'Today',
    time: 'Anytime',
    price: '$50',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
  {
    id: 7,
    title: 'Flyer drop',
    location: 'Northgate SA',
    date: 'Before Mon, 4 Aug',
    time: 'Anytime',
    price: '$100',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: 8,
    title: 'Social Media Assistant (Remote)',
    location: 'Adelaide SA',
    date: 'Flexible',
    time: 'Remote',
    price: '$200',
    status: 'Open',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
];

const PerformerHomeScreen = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef<any>(null);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    console.log(`Selected category: ${category}`);
    setShowCategories(false);
    // Prevent default navigation behavior
    return false;
  };

  // Handle task card click
  const handleTaskClick = (taskId: number) => {
    navigation.navigate('TaskDetails');
  };

  // Handle open button click
  const handleOpenClick = (taskId: number) => {
    navigation.navigate('TaskDetails');
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
        {/* Header */}
        <View style={styles.mobileHeader}>
          <View style={styles.mobileLocationContainer}>
            <Text style={styles.mobileLocationTitle}>Hyderabad Deccan Railway Station</Text>
            <Text style={styles.mobileLocationSubtitle}>Red Hills-Malakpet-Hyderabad...</Text>
          </View>
          <View style={styles.mobileLogoCircle}>
            <Image source={require('../assets/images/logo.png')} style={styles.mobileLogoImage} />
          </View>
        </View>

        {/* Mobile Navigation Menu */}
        <View style={styles.mobileNavMenu}>
          <View style={styles.mobileNavRow}>
            <TouchableOpacity style={styles.mobileNavButton}>
              <Text style={styles.mobileNavButtonText}>Post a Task</Text>
            </TouchableOpacity>
            <View ref={dropdownRef} style={styles.mobileDropdownContainer}>
              <TouchableOpacity 
                style={styles.mobileNavLink}
                onPress={() => setShowCategories(!showCategories)}
              >
                <Text style={styles.mobileNavLinkText}>Browse Tasks</Text>
              </TouchableOpacity>
              {showCategories && (
                <View style={styles.mobileCategoriesDropdown}>
                  <View style={styles.mobileDropdownContent}>
                    <View style={styles.mobileDropdownColumn}>
                      {categories.map((cat) => (
                        <View 
                          key={cat} 
                          style={styles.mobileDropdownItem} 
                          onTouchEnd={() => handleCategoryClick(cat)}
                        >
                          <Text style={styles.mobileDropdownItemText}>{cat}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.mobileNavRow}>
            <TouchableOpacity style={styles.mobileNavLink}>
              <Text style={styles.mobileNavLinkText}>How it works</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileNavLink}>
              <Text style={styles.mobileNavLinkText}>Benefits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileNavLink}>
              <Text style={styles.mobileNavLinkText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileNavLink}>
              <Text style={styles.mobileNavLinkText}>Signup</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mobileNavRow}>
            <TouchableOpacity style={styles.mobileNavButton}>
              <Text style={styles.mobileNavButtonText}>Become a Tasker</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.mobileSearchRow}>
          <View style={styles.mobileSearchContainer}>
            <Text style={styles.mobileSearchIcon}>🔍</Text>
            <TextInput style={styles.mobileSearchInput} placeholder="Search for a task" />
          </View>
          <TouchableOpacity style={styles.mobileFilterBtn}>
            <Text style={styles.mobileFilterText}>Category ▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileFilterBtn}>
            <Text style={styles.mobileFilterText}>100km + Hyderabad ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <ScrollView style={styles.mobileTaskList} contentContainerStyle={{ paddingBottom: 100 }}>
          {dummyTasks.map(task => (
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
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.mobileBottomNav}>
          <TouchableOpacity style={[styles.mobileNavItem, styles.mobileNavActive]}>
            <Text style={[styles.mobileNavIcon, styles.mobileNavIconActive]}>⌂</Text>
            <Text style={[styles.mobileNavLabel, styles.mobileNavLabelActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem}>
            <Text style={styles.mobileNavIcon}>☐</Text>
            <Text style={styles.mobileNavLabel}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem}>
            <Text style={styles.mobileNavIcon}>＋</Text>
            <Text style={styles.mobileNavLabel}>Post / Discover</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem}>
            <Text style={styles.mobileNavIcon}>○</Text>
            <Text style={styles.mobileNavLabel}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem}>
            <Text style={styles.mobileNavIcon}>⚪</Text>
            <Text style={styles.mobileNavLabel}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Desktop web layout (new implementation based on reference image)
  return (
    <View style={styles.desktopContainer}>
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
          
          {/* Right: Profile Icon */}
          <View style={styles.desktopRightMenu}>
            <TouchableOpacity style={styles.desktopProfileButton}>
              <Text style={styles.desktopProfileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.desktopFilterSection}>
        <View style={styles.desktopSearchContainer}>
          <Text style={styles.desktopSearchIcon}>🔍</Text>
          <TextInput style={styles.desktopSearchInput} placeholder="Search for a task" />
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
            {dummyTasks.map(task => (
              <TouchableOpacity 
                key={task.id} 
                style={styles.desktopTaskCard}
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
            ))}
          </ScrollView>
        </View>

        {/* Right Side - Map */}
        <View style={styles.desktopMapSection}>
          <View style={styles.desktopMapHeader}>
            <Text style={styles.desktopMapTitle}>Task Locations</Text>
          </View>
          <View style={styles.desktopMapContainer}>
            <Image source={require('../assets/mapweb.jpg')} style={styles.desktopMapImage} />
            <View style={styles.desktopMapControls}>
              <TouchableOpacity style={styles.desktopMapControl}>
                <Text style={styles.desktopMapControlIcon}>🎯</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.desktopMapControl}>
                <Text style={styles.desktopMapControlIcon}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.desktopMapControl}>
                <Text style={styles.desktopMapControlIcon}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.desktopMapControl}>
                <Text style={styles.desktopMapControlIcon}>↑</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  desktopMapSection: {
    flex: 1,
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    height: 600, // Fixed height to match task list
  },
  desktopMapHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  desktopMapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  desktopMapContainer: {
    flex: 1,
    position: 'relative',
  },
  desktopMapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  desktopMapControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  desktopMapControl: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  desktopMapControlIcon: {
    fontSize: 14,
    color: '#374151',
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
});

export default PerformerHomeScreen; 