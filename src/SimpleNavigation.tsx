import React, { useState, useEffect, useCallback } from 'react';
import { Platform, BackHandler } from 'react-native';
import { useAuth } from './AuthContext';

// Import all screens
import LandingScreen from './LandingScreen';
import WebLanding from './WebLanding';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import OTPVerificationScreen from './OTPVerificationScreen';
import ChooseLocationMethodScreen from './ChooseLocationMethodScreen';
import SearchLocationScreen from './SearchLocationScreen';
import LocationInputScreen from './LocationInputScreen';
import LocationConfirmationScreen from './LocationConfirmationScreen';
import RoleSelectionScreen from './RoleSelectionScreen';
import PerformerHomeScreen from './PerformerHomeScreen';
import PosterHomeScreen from './PosterHomeScreen';
import ProfileScreen from './ProfileScreen';
import TaskPostingForm from './TaskPostingForm';
import TaskDetailsScreen from './TaskDetailsScreen';
import TaskListingScreen from './TaskListingScreen';
import ChatScreen from './ChatScreen';
import MakeOfferDetailsScreen from './MakeOfferDetailsScreen';
import MapTest from './components/MapTest';

// Navigation context
interface NavigationContextType {
  currentRoute: string;
  navigate: (route: string, params?: any) => void;
  goBack: () => void;
  params: any;
  routeHistory: string[];
  syncUrlForRedirect: (targetRoute: string) => void; // Add this to the interface
  isRoleSelectionInProgress: boolean;
  setIsRoleSelectionInProgress: (value: boolean) => void;
}

const NavigationContext = React.createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

// Navigation provider component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('Landing');
  const [routeHistory, setRouteHistory] = useState<string[]>(['Landing']);
  const [params, setParams] = useState<any>({});
  const [isRoleSelectionInProgress, setIsRoleSelectionInProgress] = useState(false);

  // Helper to parse URL query parameters
  const parseQueryParams = (search: string) => {
    const parsedParams: { [key: string]: any } = {};
    if (search) {
      const queryParams = new URLSearchParams(search);
      for (const [key, value] of queryParams.entries()) {
        try {
          parsedParams[key] = JSON.parse(value); // Attempt to parse JSON
        } catch (e) {
          parsedParams[key] = value; // If not JSON, keep as string
        }
      }
    }
    return parsedParams;
  };

  // Initialize route history for Android
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // For Android/iOS, ensure we start with Landing in history
      setRouteHistory(['Landing']);
      setCurrentRoute('Landing');
    }
  }, []);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        console.log('Android back button pressed');
        console.log('Current route history:', routeHistory);
        console.log('History length:', routeHistory.length);
        
        if (routeHistory.length > 1) {
          const newHistory = routeHistory.slice(0, -1);
          const previousRoute = newHistory[newHistory.length - 1];
          console.log('Navigating back to:', previousRoute);
          setRouteHistory(newHistory);
          setCurrentRoute(previousRoute);
          setParams({}); // Clear params for simplicity on mobile goBack
          return true; // Prevent default back behavior
        }
        console.log('At root, allowing app to close');
        return false; // Allow default back behavior (close app) if we're at the root
      });

      return () => backHandler.remove();
    }
  }, [routeHistory]);

  // Handle browser back/forward for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Always start with Landing page, regardless of URL
      const initialPath = 'Landing';
      const initialParams = parseQueryParams(window.location.search);
      
      console.log('🌐 Web initialization - Starting with Landing page');
      console.log('📍 Original URL:', window.location.pathname);
      
      setCurrentRoute(initialPath);
      setParams(initialParams);
      
      // Initialize history starting with Landing
      setRouteHistory(['Landing']);
      
      // Update URL to reflect Landing page
      if (window.location.pathname !== '/Landing' && window.location.pathname !== '/') {
        console.log('🔄 Updating URL from', window.location.pathname, 'to /Landing');
        window.history.replaceState({}, '', '/Landing');
      }

      const handlePopState = () => {
        const path = window.location.pathname.slice(1) || 'Landing';
        const popParams = parseQueryParams(window.location.search);
        setCurrentRoute(path);
        setParams(popParams);
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const navigate = (route: string, newParams?: any) => {
    console.log('Navigating to:', route, 'with params:', newParams);
    console.log('Current route history before navigation:', routeHistory);
    
    // Update browser URL for web
    if (Platform.OS === 'web') {
      let url = `/${route}`;
      if (newParams) {
        const queryParams = new URLSearchParams();
        for (const key in newParams) {
          if (newParams.hasOwnProperty(key)) {
            // Stringify complex objects to store them in URL
            queryParams.append(key, JSON.stringify(newParams[key]));
          }
        }
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      window.history.pushState({}, '', url);
    }

    // Update route history
    const newHistory = [...routeHistory, route];
    console.log('New route history after navigation:', newHistory);
    setRouteHistory(newHistory);
    setCurrentRoute(route);
    setParams(newParams || {}); // Update params for current session
  };

  const goBack = () => {
    console.log('goBack called');
    console.log('Current route history:', routeHistory);
    
    if (Platform.OS === 'web') {
      window.history.back(); // Let browser handle popstate and URL change
    } else {
      if (routeHistory.length > 1) {
        const newHistory = routeHistory.slice(0, -1);
        const previousRoute = newHistory[newHistory.length - 1];
        console.log('Manual goBack - navigating to:', previousRoute);
        setRouteHistory(newHistory);
        setCurrentRoute(previousRoute);
        setParams({}); // Clear params for simplicity on mobile goBack, or retrieve from a more complex history stack
      } else {
        console.log('Cannot go back - at root');
      }
    }
  };

  // Handle URL synchronization for redirects
  const syncUrlForRedirect = (targetRoute: string) => {
    if (Platform.OS === 'web' && targetRoute !== currentRoute) {
      console.log('🔄 Syncing URL: redirecting from', currentRoute, 'to', targetRoute);
      
      // Update browser URL to match the target route
      const url = `/${targetRoute}`;
      window.history.replaceState({}, '', url);
      
      // Update the current route state to match
      setCurrentRoute(targetRoute);
    }
  };

  const value: NavigationContextType = {
    currentRoute,
    navigate,
    goBack,
    params,
    routeHistory,
    syncUrlForRedirect, // Add this to the context
    isRoleSelectionInProgress,
    setIsRoleSelectionInProgress,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Main navigation component
const SimpleNavigation: React.FC = () => {
  const { currentRoute, syncUrlForRedirect, isRoleSelectionInProgress } = useNavigation();
  const { currentUser, userData, loading } = useAuth();

  // Check if user has completed onboarding
  const hasCompletedOnboarding = useCallback(() => {
    if (!currentUser || !userData) return false;
    
    // Check if user has location and roles set
    // Location can be an object with lat/lng/address or a string
    const hasLocation = userData.location && (
      (typeof userData.location === 'object' && userData.location.lat && userData.location.lng) ||
      (typeof userData.location === 'string' && userData.location !== 'Not specified')
    );
    const hasRoles = userData.roles && userData.roles.length > 0 && 
                    userData.roles.some(role => role === 'tasker' || role === 'poster');
    
    console.log('🔍 Onboarding Check:', {
      hasLocation,
      hasRoles,
      location: userData.location,
      roles: userData.roles,
      locationType: typeof userData.location,
      userDataKeys: Object.keys(userData || {}),
      userDataStringified: JSON.stringify(userData, null, 2)
    });
    
    // For now, allow access if user has roles (location can be set later)
    // This allows users to complete role selection and access home screens
    return hasRoles;
  }, [currentUser, userData]);

  // Determine the correct route based on authentication and onboarding status
  const getCorrectRoute = () => {
    console.log('🔍 getCorrectRoute called with:', {
      currentRoute,
      loading,
      hasCurrentUser: !!currentUser,
      hasUserData: !!userData,
      userData: userData
    });
    
    // If still loading auth state, show landing
    if (loading) return 'Landing';
    
    // If role selection is in progress, don't redirect
    if (isRoleSelectionInProgress) {
      console.log('⏳ Role selection in progress - skipping redirects');
      return currentRoute;
    }
    
    // If we're on Landing page, always allow it (don't redirect away from Landing)
    if (currentRoute === 'Landing') {
      console.log('✅ On Landing page - allowing it');
      return 'Landing';
    }
    
    // If we're on SignUp page, always allow it (don't redirect away from SignUp)
    if (currentRoute === 'SignUp') {
      console.log('✅ On SignUp page - allowing it');
      return 'SignUp';
    }
    
    // If we're on Login page, always allow it (don't redirect away from Login)
    if (currentRoute === 'Login') {
      console.log('✅ On Login page - allowing it');
      return 'Login';
    }
    
    // If we're on OTPVerification page, always allow it (don't redirect away from OTPVerification)
    if (currentRoute === 'OTPVerification') {
      console.log('✅ On OTPVerification page - allowing it');
      return 'OTPVerification';
    }
    
    // If we're on RoleSelection page, always allow it (don't redirect away from RoleSelection)
    if (currentRoute === 'RoleSelection') {
      console.log('✅ On RoleSelection page - allowing it');
      return 'RoleSelection';
    }
    
    // If we're on ChooseLocationMethod page, always allow it (don't redirect away from ChooseLocationMethod)
    if (currentRoute === 'ChooseLocationMethod') {
      console.log('✅ On ChooseLocationMethod page - allowing it');
      return 'ChooseLocationMethod';
    }
    
    // If we're on other onboarding pages, always allow them (don't redirect away from onboarding)
    const onboardingPages = ['LocationInput', 'LocationConfirmation', 'SearchLocation'];
    if (onboardingPages.includes(currentRoute)) {
      console.log('✅ On onboarding page - allowing it:', currentRoute);
      return currentRoute;
    }
    
    // If we're on home screens and user has completed onboarding, always allow them
    if ((currentRoute === 'PerformerHome' || currentRoute === 'PosterHome') && hasCompletedOnboarding()) {
      console.log('✅ On home screen with completed onboarding - allowing it');
      return currentRoute;
    }
    
    // If we're on home screens and user has roles (even without location), allow them
    if ((currentRoute === 'PerformerHome' || currentRoute === 'PosterHome') && 
        userData && userData.roles && userData.roles.length > 0 && 
        userData.roles.some(role => role === 'tasker' || role === 'poster')) {
      console.log('✅ On home screen with roles - allowing it (location can be set later)');
      return currentRoute;
    }
    
    // If not authenticated, allow access to auth screens
    if (!currentUser) {
      console.log('🔍 User not authenticated - checking auth routes');
      const authRoutes = ['Landing', 'SignUp', 'Login', 'OTPVerification'];
      if (authRoutes.includes(currentRoute)) {
        console.log('✅ Auth route allowed:', currentRoute);
        return currentRoute;
      }
      console.log('🔄 Redirecting to Landing (not authenticated)');
      return 'Landing';
    }
    
    // If authenticated but userData is null (still loading or offline)
    if (!userData) {
      console.log('🔍 User authenticated but no userData - checking routes');
      // For authenticated users without userData, allow access to auth and onboarding routes
      const onboardingRoutes = ['ChooseLocationMethod', 'LocationInput', 'LocationConfirmation', 'RoleSelection', 'SearchLocation'];
      const authRoutes = ['Landing', 'SignUp', 'Login', 'OTPVerification'];
      
      console.log('🔍 Checking if currentRoute is allowed:', {
        currentRoute,
        isOnboardingRoute: onboardingRoutes.includes(currentRoute),
        isAuthRoute: authRoutes.includes(currentRoute)
      });
      
      // Allow access to onboarding routes and auth routes
      if (onboardingRoutes.includes(currentRoute) || authRoutes.includes(currentRoute)) {
        console.log('✅ Route allowed:', currentRoute);
        return currentRoute;
      }
      
      // If user is on a home screen, allow it (userData might be loading)
      const homeRoutes = ['PerformerHome', 'PosterHome'];
      if (homeRoutes.includes(currentRoute)) {
        console.log('✅ Home route allowed (userData might be loading):', currentRoute);
        return currentRoute;
      }
      
      // If user is on other protected routes, redirect to ChooseLocationMethod
      const protectedRoutes = ['Profile', 'TaskPostingForm', 'TaskDetails', 'TaskListing', 'Chat', 'MakeOfferDetails'];
      if (protectedRoutes.includes(currentRoute)) {
        return 'ChooseLocationMethod';
      }
      
      // For any other route, redirect to ChooseLocationMethod to continue onboarding
      return 'ChooseLocationMethod';
    }
    
    // If authenticated and userData is loaded, check onboarding completion
    if (!hasCompletedOnboarding()) {
      console.log('🔍 User authenticated with userData but onboarding not complete');
      const onboardingRoutes = [
        'ChooseLocationMethod', 
        'LocationInput', 
        'LocationConfirmation', 
        'RoleSelection',
        'SearchLocation'
      ];
      
      console.log('🔍 Checking onboarding routes:', {
        currentRoute,
        isOnboardingRoute: onboardingRoutes.includes(currentRoute)
      });
      
      // Allow access to onboarding routes
      if (onboardingRoutes.includes(currentRoute)) {
        console.log('✅ Onboarding route allowed:', currentRoute);
        return currentRoute;
      }
      
      // If user is on a home screen but hasn't completed onboarding, redirect to ChooseLocationMethod
      const homeRoutes = ['PerformerHome', 'PosterHome', 'Profile', 'TaskPostingForm', 'TaskDetails', 'TaskListing', 'Chat', 'MakeOfferDetails'];
      if (homeRoutes.includes(currentRoute)) {
        return 'ChooseLocationMethod';
      }
      
      // For any other route, redirect to ChooseLocationMethod to continue onboarding
      return 'ChooseLocationMethod';
    }
    
    // If onboarding is complete, allow access to all screens
    // But if user is on Landing and has completed onboarding, redirect to appropriate home screen
    if (currentRoute === 'Landing' && hasCompletedOnboarding()) {
      // Determine which home screen to show based on user's role
      if (userData.roles && userData.roles.includes('tasker')) {
        return 'PerformerHome';
      } else if (userData.roles && userData.roles.includes('poster')) {
        return 'PosterHome';
      }
    }
    
    return currentRoute;
  };

  const correctRoute = getCorrectRoute();

  // Sync URL when correct route differs from current route
  useEffect(() => {
    if (correctRoute !== currentRoute) {
      console.log('🔄 Route redirect:', currentRoute, '→', correctRoute);
      
      // Don't redirect if we're on Landing page and auth is still loading
      if (currentRoute === 'Landing' && loading) {
        console.log('⏳ Skipping redirect - on Landing and auth still loading');
        return;
      }
      
      // Add a small delay to ensure web initialization completes first
      setTimeout(() => {
        syncUrlForRedirect(correctRoute);
      }, 100);
    }
  }, [correctRoute, currentRoute, syncUrlForRedirect, loading]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Navigation Debug:', {
      currentRoute,
      correctRoute,
      platform: Platform.OS,
      isAuthenticated: !!currentUser,
      userData: userData ? {
        hasLocation: userData.location && (
          (typeof userData.location === 'object' && userData.location.lat && userData.location.lng) ||
          (typeof userData.location === 'string' && userData.location !== 'Not specified')
        ),
        hasRoles: userData.roles && userData.roles.length > 0 && 
                 userData.roles.some(role => role === 'tasker' || role === 'poster'),
        location: userData.location,
        roles: userData.roles
      } : null,
      hasCompletedOnboarding: hasCompletedOnboarding(),
      loading,
      userDataNull: !userData,
      currentUserExists: !!currentUser
    });
  }, [currentRoute, correctRoute, currentUser, userData, loading, hasCompletedOnboarding]);

  const renderScreen = () => {
    // For web platform, use WebLanding for the Landing route
    if (Platform.OS === 'web' && correctRoute === 'Landing') {
      return <WebLanding />;
    }

    switch (correctRoute) {
      case 'Landing':
        return <LandingScreen />;
      case 'SignUp':
        return <SignUpScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'OTPVerification':
        return <OTPVerificationScreen />;
      case 'ChooseLocationMethod':
        return <ChooseLocationMethodScreen />;
      case 'SearchLocation':
        return <SearchLocationScreen />;
      case 'LocationInput':
        return <LocationInputScreen />;
      case 'LocationConfirmation':
        return <LocationConfirmationScreen />;
      case 'RoleSelection':
        return <RoleSelectionScreen />;
      case 'PerformerHome':
        return <PerformerHomeScreen />;
      case 'PosterHome':
        return <PosterHomeScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'TaskPostingForm':
        return <TaskPostingForm />;
      case 'TaskDetails':
        return <TaskDetailsScreen />;
      case 'TaskListing':
        return <TaskListingScreen />;
      case 'Chat':
        return <ChatScreen />;
      case 'MakeOfferDetails':
        return <MakeOfferDetailsScreen />;
      case 'MapTest':
        return <MapTest />;
      default:
        return Platform.OS === 'web' ? <WebLanding /> : <LandingScreen />;
    }
  };

  return (
    <>
      {renderScreen()}
      {Platform.OS === 'web'}
      {/* {Platform.OS === 'web' && <DebugInfo />} */}
    </>
  );
};

export default SimpleNavigation; 