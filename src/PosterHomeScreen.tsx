import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useNavigation } from './SimpleNavigation';
import Footer from './Footer';



const categories = [
  "Accountants", "Admin", "Alterations", "Appliances", "Assembly", "Auto Electricians", "Bakers", "Barbers", "Beauticians", "Bicycle Service", "Bricklaying", "Building & Construction", "Business", "Car Body Work", "Car Detailing", "Car Repair", "Car Service", "Carpentry", "Cat Care", "Catering", "Chef", "Cladding", "Cleaning", "Computers & IT", "Concreting", "Decking", "Delivery", "Design", "Dog Care", "Draftsman", "Driving", "Electricians", "Entertainment", "Events", "Fencing", "Flooring", "Florist", "Furniture Assembly", "Gardening", "Gate Installation", "Hairdressers", "Handyman", "Heating & Cooling", "Home", "Automation And Security", "Home Theatre", "Interior Designer", "Landscaping", "Laundry", "Lawn Care", "Lessons", "Locksmith", "Makeup Artist", "Marketing", "Mobile Mechanic", "Painting", "Paving", "Pet Care", "Photographers", "Plasterer", "Plumbing", "Pool Maintenance", "Removals", "Roofing", "Sharpening", "Staffing", "Tailors", "Tattoo Artists", "Tiling", "Tradesman", "Tutoring", "Wall Hanging & Mounting", "Wallpapering", "Waterproofing", "Web", "Wheel & Tyre Service", "Writing"
];

const PosterHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
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

  const serviceCategories = [
    {
      id: 1,
      title: 'Home Services',
      image: require('../assets/images/home.png'),
      color: '#f4f4f4',
    },
    {
      id: 2,
      title: 'General Errands & Delivery',
      image: require('../assets/images/delivery.png'),
      color: '#f4f4f4',
    },
    {
      id: 3,
      title: 'Beauty & Personal Care',
      image: require('../assets/images/beauty.png'),
      color: '#f4f4f4',
    },
    {
      id: 4,
      title: 'Installation & Smart Solutions',
      image: require('../assets/images/smart.png'),
      color: '#f4f4f4',
    },
    {
      id: 5,
      title: 'Daily Help & Assistants',
      image: require('../assets/images/assist.png'),
      color: '#f4f4f4',
    },
    {
      id: 6,
      title: 'Tutoring & Education',
      image: require('../assets/images/tutor.png'),
      color: '#f4f4f4',
    },
    {
      id: 7,
      title: 'Creative & Technical Tasks',
      image: require('../assets/images/creative.png'),
      color: '#f4f4f4',
    },
    {
      id: 8,
      title: 'Administrative / Office Tasks',
      image: require('../assets/images/office.png'),
      color: '#f4f4f4',
    },
    {
      id: 9,
      title: 'Event Support',
      image: require('../assets/images/events.png'),
      color: '#f4f4f4',
    },
  ];

  const bannerImages = [
    require('../assets/images/banner1.png'),
    require('../assets/images/banner2.png'),
    require('../assets/images/banner3.png'),
    require('../assets/images/banner4.png'),
    require('../assets/images/banner5.png'),
    require('../assets/images/banner6.png'),
    require('../assets/images/banner7.png'),
  ];

  const mostBookedServices = [
    {
      id: 1,
      title: 'Parcel Pickup & Delivery',
      image: require('../assets/mosted-booked-services/delivery.png'),
      rating: '4.76',
      reviews: '98K',
      price: '₹199',
    },
    {
      id: 2,
      title: 'At-Home Haircut (Women)',
      image: require('../assets/mosted-booked-services/homefacial.png'),
      rating: '4.88',
      reviews: '132K',
      price: '₹699',
    },
    {
      id: 3,
      title: 'Home Deep Cleaning',
      image: require('../assets/mosted-booked-services/homeclean.png'),
      rating: '4.82',
      reviews: '45K',
      price: '₹399',
    },
    {
      id: 4,
      title: 'TV Mounting Service',
      image: require('../assets/mosted-booked-services/tv-mounting.png'),
      rating: '4.91',
      reviews: '67K',
      price: '₹299',
    },
    {
      id: 5,
      title: 'Online Tuition Classes',
      image: require('../assets/mosted-booked-services/online-tution.png'),
      rating: '4.85',
      reviews: '89K',
      price: '₹499',
    },
    {
      id: 6,
      title: 'Logo Design Service',
      image: require('../assets/mosted-booked-services/logo-design.png'),
      rating: '4.79',
      reviews: '34K',
      price: '₹899',
    },
  ];

  // Mobile layout (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.mobileContainer}>
        {/* Header */}
        <View style={styles.mobileHeader}>
          <View style={styles.mobileHeaderTop}>
            <View style={styles.mobileLocationContainer}>
              <Text style={styles.mobileLocationText}>Hyderabad Decan Railway Station</Text>
              <Text style={styles.mobileLocationSubtext}>Red Hills-Malakpet-Hyderaba...</Text>
              <Text style={styles.mobileLocationArrow}>▼</Text>
            </View>
            <TouchableOpacity style={styles.mobileCartButton}>
              <Text style={styles.mobileCartIcon}>🛒</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.mobileSearchContainer}>
            <Text style={styles.mobileSearchIcon}>🔍</Text>
            <TextInput
              style={styles.mobileSearchInput}
              placeholder="Search for"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
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

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.mobileScrollableContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mobileScrollContentContainer}
        >
          {/* Service Categories Grid */}
          <View style={styles.mobileCategoriesGrid}>
            {serviceCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.mobileCategoryCard}>
                <View style={[styles.mobileCategoryIcon, { backgroundColor: category.color }]}>
                  <Image source={category.image} style={styles.mobileCategoryImage} />
                </View>
                <Text style={styles.mobileCategoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Task Button */}
          <View style={styles.mobileCustomTaskContainer}>
            <TouchableOpacity style={styles.mobileCustomTaskButton}>
              <Text style={styles.mobileCustomTaskText}>Custom Task</Text>
              <Text style={styles.mobileCustomTaskIcon}>📅</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Scrollable Banners */}
          <View style={styles.mobileBannerSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mobileBannerScrollContainer}
            >
              {bannerImages.map((banner, index) => (
                <TouchableOpacity key={index} style={styles.mobileBannerCard}>
                  <Image source={banner} style={styles.mobileBannerImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Most Booked Services Section */}
          <View style={styles.mobileMostBookedSection}>
            <Text style={styles.mobileMostBookedTitle}>Most Booked Services</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mobileMostBookedScrollContainer}
            >
              {mostBookedServices.map((service) => (
                <TouchableOpacity key={service.id} style={styles.mobileServiceCard}>
                  <Image source={service.image} style={styles.mobileServiceImage} />
                  <View style={styles.mobileServiceContent}>
                    <Text style={styles.mobileServiceTitle}>Title: {service.title}</Text>
                    <View style={styles.mobileServiceRating}>
                      <Text style={styles.mobileStarIcon}>⭐</Text>
                      <Text style={styles.mobileRatingText}>{service.rating} ({service.reviews})</Text>
                    </View>
                    <Text style={styles.mobileServicePrice}>{service.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Refer Section */}
          <View style={styles.mobileReferSection}>
            <View style={styles.mobileReferCard}>
              <View style={styles.mobileReferContent}>
                <Text style={styles.mobileReferTitle}>Refer and get</Text>
                <Text style={styles.mobileReferSubtitle}>free services</Text>
                <Text style={styles.mobileReferDescription}>Invite and get ₹ 100*</Text>
                <TouchableOpacity style={styles.mobileReferButton}>
                  <Text style={styles.mobileReferButtonText}>Book now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.mobileReferImageContainer}>
                <Image source={require('../assets/images/refer.png')} style={styles.mobileReferImage} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.mobileBottomNav}>
          <TouchableOpacity style={[styles.mobileNavItem, styles.mobileNavItemActive]}>
            <Text style={styles.mobileNavIcon}>⌂</Text>
            <Text style={styles.mobileNavText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem}>
            <Text style={styles.mobileNavIcon}>☐</Text>
            <Text style={styles.mobileNavText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mobileNavItem}
            onPress={() => navigation.navigate('TaskPostingForm')}
          >
            <Text style={styles.mobileNavIcon}>＋</Text>
            <Text style={styles.mobileNavText}>Post / Discover</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileNavItem}>
            <Text style={styles.mobileNavIcon}>○</Text>
            <Text style={styles.mobileNavText} onPress={() => navigation.navigate('Chat')}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mobileNavItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.mobileNavIcon}>⚪</Text>
            <Text style={styles.mobileNavText}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Desktop web layout (new implementation based on Urban Company reference)
  return (
    <View style={styles.container}>
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
            <TouchableOpacity 
              style={styles.desktopMenuButton}
              onPress={() => navigation.navigate('TaskPostingForm')}
            >
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
              <Text style={styles.desktopMenuLinkText}>How it works</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopMenuLink}>
              <Text style={styles.desktopMenuLinkText}>Benefits</Text>
            </TouchableOpacity>
          </View>
          
          {/* Right: Profile Icon */}
          <View style={styles.desktopRightMenu}>
            <TouchableOpacity 
              style={styles.desktopProfileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.desktopProfileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

             {/* Main Content */}
       <View style={styles.desktopMainContent}>
                   {/* Left Side - Categories */}
          <View style={styles.desktopLeftSection}>
            <View style={styles.desktopHeroSection}>
              <Text style={styles.desktopHeroTitle}>Services at your fingertips</Text>
            </View>
            
            {/* Categories Card */}
            <View style={styles.desktopCategoriesCard}>
              <Text style={styles.desktopHeroSubtitle}>What are you looking for?</Text>
              
              <View style={styles.desktopCategoriesGrid}>
                {serviceCategories.map((category) => (
                  <TouchableOpacity key={category.id} style={styles.desktopCategoryCard}>
                    <View style={[styles.desktopCategoryIcon, { backgroundColor: category.color }]}>
                      <Image source={category.image} style={styles.desktopCategoryImage} />
                    </View>
                    <Text style={styles.desktopCategoryTitle}>{category.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Custom Task Button */}
            <View style={styles.desktopCustomTaskContainer}>
              <TouchableOpacity style={styles.desktopCustomTaskButton}>
                <Text style={styles.desktopCustomTaskText}>Custom Task</Text>
                <Text style={styles.desktopCustomTaskIcon}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Right Side - Single Image */}
          <View style={styles.desktopRightSection}>
            <View style={styles.desktopSingleImageCard}>
              <Image source={require('../assets/images/homeimg.png')} style={styles.desktopSingleImage} />
            </View>
          </View>
        </View>

       {/* Horizontal Scrollable Banners */}
       <View style={styles.desktopFullWidthBannerSection}>
         <ScrollView 
           horizontal 
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.desktopBannerScrollContainer}
         >
           {bannerImages.map((banner, index) => (
             <TouchableOpacity key={index} style={styles.desktopBannerCard}>
               <Image source={banner} style={styles.desktopBannerImage} />
             </TouchableOpacity>
           ))}
         </ScrollView>
       </View>

       {/* Most Booked Services Section */}
       <View style={styles.desktopFullWidthMostBookedSection}>
         <Text style={styles.desktopMostBookedTitle}>Most Booked Services</Text>
         <ScrollView 
           horizontal 
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.desktopMostBookedScrollContainer}
         >
           {mostBookedServices.map((service) => (
             <TouchableOpacity key={service.id} style={styles.desktopServiceCard}>
               <Image source={service.image} style={styles.desktopServiceCardImage} />
               <View style={styles.desktopServiceContent}>
                 <Text style={styles.desktopServiceTitle}>{service.title}</Text>
                 <View style={styles.desktopServiceRating}>
                   <Text style={styles.desktopStarIcon}>⭐</Text>
                   <Text style={styles.desktopRatingText}>{service.rating} ({service.reviews})</Text>
                 </View>
                 <Text style={styles.desktopServicePrice}>{service.price}</Text>
               </View>
             </TouchableOpacity>
           ))}
         </ScrollView>
       </View>

               {/* Refer Section */}
        <View style={styles.desktopFullWidthReferSection}>
          <View style={styles.desktopReferCard}>
            <View style={styles.desktopReferContent}>
              <Text style={styles.desktopReferTitle}>Refer and get</Text>
              <Text style={styles.desktopReferSubtitle}>free services</Text>
              <Text style={styles.desktopReferDescription}>Invite and get ₹ 100*</Text>
              <TouchableOpacity style={styles.desktopReferButton}>
                <Text style={styles.desktopReferButtonText}>Book now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.desktopReferImageContainer}>
              <Image source={require('../assets/images/refer.png')} style={styles.desktopReferImage} />
            </View>
          </View>
        </View>

        {/* Footer */}
        <Footer />
      </View>
    );
};

const styles = StyleSheet.create({
  // Desktop web styles (existing)
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  locationArrow: {
    fontSize: 12,
    color: '#666',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingTop: 20,
    paddingBottom: 80, // Space for bottom navigation
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  categoryCard: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  categoryTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  customTaskContainer: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  customTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  customTaskText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  customTaskIcon: {
    fontSize: 16,
  },
  mostBookedSection: {
    marginBottom: 20,
  },
  mostBookedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'left',
    paddingHorizontal: 12,
  },
  mostBookedScrollContainer: {
    paddingHorizontal: 12,
  },
  serviceCard: {
    width: 320,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bannerSection: {
    marginBottom: 20,
  },
  bannerScrollContainer: {
    paddingHorizontal: 12,
  },
  bannerCard: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerImage: {
    width: 320,
    height: 180,
    borderRadius: 12,
  },
  referSection: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  referCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  referContent: {
    flex: 1,
    marginRight: 20,
  },
  referTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  referSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  referDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  referButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  referButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  referImageContainer: {
    width: 140,
    height: 140,
  },
  referImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // Active state styling if needed
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#fff',
  },
  navText: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },

  // Mobile styles (new)
  mobileContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  mobileHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  mobileLocationContainer: {
    flex: 1,
  },
  mobileLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mobileLocationSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mobileLocationArrow: {
    fontSize: 12,
    color: '#666',
  },
  mobileCartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileCartIcon: {
    fontSize: 20,
    color: '#000',
  },
  mobileSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  mobileSearchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#000',
  },
  mobileSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  mobileScrollableContent: {
    flex: 1,
  },
  mobileScrollContentContainer: {
    paddingTop: 20,
    paddingBottom: 80, // Space for bottom navigation
  },
  mobileContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mobileCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  mobileCategoryCard: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 24,
  },
  mobileCategoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  mobileCategoryTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  mobileCustomTaskContainer: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  mobileCustomTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  mobileCustomTaskText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  mobileCustomTaskIcon: {
    fontSize: 16,
  },
  mobileMostBookedSection: {
    marginBottom: 20,
  },
  mobileMostBookedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'left',
    paddingHorizontal: 12,
  },
  mobileMostBookedScrollContainer: {
    paddingHorizontal: 12,
  },
  mobileServiceCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileServiceImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  mobileServiceContent: {
    padding: 16,
  },
  mobileServiceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  mobileServiceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mobileStarIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  mobileRatingText: {
    fontSize: 12,
    color: '#666',
  },
  mobileServicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mobileBannerSection: {
    marginBottom: 20,
  },
  mobileBannerScrollContainer: {
    paddingHorizontal: 12,
  },
  mobileBannerCard: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileBannerImage: {
    width: 280,
    height: 160,
    borderRadius: 12,
  },
  mobileReferSection: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  mobileReferCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mobileReferContent: {
    flex: 1,
    marginRight: 16,
  },
  mobileReferTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mobileReferSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  mobileReferDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  mobileReferButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mobileReferButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mobileReferImageContainer: {
    width: 120,
    height: 120,
  },
  mobileReferImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  mobileBottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  mobileNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  mobileNavItemActive: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  mobileNavIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#000',
  },
  mobileNavText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  mobileCategoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // New styles for desktop layout
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
  desktopDropdownContainer: {
    position: 'relative',
  },
  desktopDropdownIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  desktopCategoriesDropdown: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: -325, // half of minWidth 650 to visually center
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
  desktopRightMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  desktopAuthButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  desktopAuthButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  desktopTaskerButton: {
    backgroundColor: '#ffcc30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  desktopTaskerButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
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

  desktopMainContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  desktopLeftSection: {
    flex: 1,
    marginRight: 20,
  },
  desktopHeroSection: {
    marginBottom: 20,
  },
  desktopHeroTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  desktopHeroSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  desktopCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  desktopCategoryCard: {
    width: '31%', // 3 columns with better spacing
    alignItems: 'center',
    marginBottom: 16,
  },
  desktopCategoryIcon: {
    width: 90,
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  desktopCategoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  desktopCategoryTitle: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  desktopRightSection: {
    width: 700,
  },
  desktopSingleImageCard: {
    width: '100%',
    height: 700,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  desktopSingleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  desktopImageGrid: {
    marginBottom: 20,
  },
  desktopImageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  desktopImageCard: {
    width: '48%', // Adjust as needed for 2 columns
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  desktopServiceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  desktopImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  desktopImageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  desktopCustomTaskContainer: {
    marginBottom: 20,
    paddingHorizontal: 0,
    // marginTop:10
  },
  desktopCustomTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  desktopCustomTaskText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  desktopCustomTaskIcon: {
    fontSize: 16,
  },
  desktopBannerSection: {
    marginBottom: 20,
  },
  desktopBannerScrollContainer: {
    paddingHorizontal: 0,
  },
  desktopBannerCard: {
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  desktopBannerImage: {
    width: 500,
    height: 280,
    borderRadius: 12,
  },
  desktopMostBookedSection: {
    marginBottom: 20,
  },
  desktopMostBookedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  desktopMostBookedScrollContainer: {
    paddingHorizontal: 0,
  },
  desktopServiceCard: {
    width: 320,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  desktopServiceCardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  desktopServiceContent: {
    padding: 16,
  },
  desktopServiceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  desktopServiceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  desktopStarIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  desktopRatingText: {
    fontSize: 12,
    color: '#666',
  },
  desktopServicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  desktopReferSection: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  desktopReferCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  desktopReferContent: {
    flex: 1,
    marginRight: 20,
  },
  desktopReferTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  desktopReferSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  desktopReferDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  desktopReferButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  desktopReferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  desktopReferImageContainer: {
    width: 140,
    height: 140,
  },
  desktopReferImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  desktopFullWidthCustomTaskContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  desktopFullWidthBannerSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  desktopFullWidthMostBookedSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  desktopFullWidthReferSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  desktopCategoriesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  mobileNavMenu: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  mobileNavButton: {
    backgroundColor: '#ffcc30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mobileNavButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  mobileNavLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mobileNavLinkText: {
    color: '#6b7280',
    fontSize: 16,
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    width: '100%',
  },
  mobileDropdownContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
  },
  mobileDropdownColumn: {
    width: '100%', // Single column for mobile
    marginBottom: 12,
  },
  mobileDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  mobileDropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default PosterHomeScreen; 