import React, { useState, useEffect, useCallback } from 'react';
import { Platform, BackHandler } from 'react-native';
import { useAuth } from './AuthContext';
import { sessionManager } from './SessionManager';

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
import LoadingScreen from './components/LoadingScreen';

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
  // Check if there's a session on initialization
  const hasSession = sessionManager.getSession().isAuthenticated;
  const initialRoute = hasSession ? 'Loading' : 'Landing';
  
  const [currentRoute, setCurrentRoute] = useState(initialRoute);
  const [routeHistory, setRouteHistory] = useState<string[]>([initialRoute]);
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
      // For Android/iOS, check if there's a session and start appropriately
      const hasSession = sessionManager.getSession().isAuthenticated;
      const initialRoute = hasSession ? 'Loading' : 'Landing';
      
      setRouteHistory([initialRoute]);
      setCurrentRoute(initialRoute);
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
      // Wait for session restoration to complete before determining initial route
      const initializeWebNavigation = () => {
        // Check for saved route from session
        const lastRoute = sessionManager.getLastRoute();
        const session = sessionManager.getSession();
        
        let initialPath = 'Landing';
        let initialParams = parseQueryParams(window.location.search);
        
        // If user is authenticated and has a saved route, use it
        if (session.isAuthenticated && lastRoute && lastRoute.route !== 'Landing') {
          initialPath = lastRoute.route;
          initialParams = lastRoute.params || {};
          console.log('🌐 Web initialization - Restoring saved route:', initialPath);
        } else {
          console.log('🌐 Web initialization - Starting with Landing page');
        }
        
        console.log('📍 Original URL:', window.location.pathname);
        
        // Don't set the route immediately if we're restoring a session
        // Let the getCorrectRoute function handle the routing after session restoration
        if (!session.isAuthenticated) {
          setCurrentRoute(initialPath);
          setParams(initialParams);
          
          // Initialize history starting with the determined route
          setRouteHistory([initialPath]);
          
          // Update URL to reflect the determined route
          if (window.location.pathname !== `/${initialPath}` && window.location.pathname !== '/') {
            console.log('🔄 Updating URL from', window.location.pathname, `to /${initialPath}`);
            window.history.replaceState({}, '', `/${initialPath}`);
          }
        } else {
          console.log('🌐 Web initialization - Session found, waiting for auth restoration');
          // Don't set any route - let the loading state handle it
          // The getCorrectRoute function will determine the correct route after session restoration
          // Just set the params but don't change the route
          setParams(initialParams);
        }
      };

      // Initialize immediately, but also set up a listener for session changes
      initializeWebNavigation();

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
    
    // Save route to session (except for auth and onboarding routes)
    const shouldSaveRoute = !['Landing', 'SignUp', 'Login', 'OTPVerification', 'ChooseLocationMethod', 'LocationInput', 'LocationConfirmation', 'SearchLocation', 'RoleSelection'].includes(route);
    if (shouldSaveRoute) {
      sessionManager.saveRoute(route, newParams);
    }
    
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
    if (!currentUser || !userData) {
      console.log('🔍 hasCompletedOnboarding: false - no currentUser or userData');
      return false;
    }
    
    // First, check if backend has onboarding status
    if (userData.onboardingStatus) {
      console.log('🔍 Using backend onboarding status:', userData.onboardingStatus);
      
      // If backend says it's complete, trust it
      if (userData.onboardingStatus.isCompleted) {
        console.log('✅ Backend says onboarding is complete');
        return true;
      }
      
      // If backend says it's not complete, check if we have all the required data anyway
      // This handles cases where the backend status might be out of sync
      console.log('⚠️ Backend says onboarding not complete, but checking actual data...');
    }
    
    // Fallback to frontend logic for backward compatibility
    // Check if user has location and roles set
    // Location can be an object with lat/lng/address or coordinates array
    const hasLocation = !!userData.location && (
      (typeof userData.location === 'object' && (
        // Check for lat/lng properties (frontend format)
        (userData.location.lat && userData.location.lng) ||
        // Check for coordinates array (backend format)
        (userData.location.coordinates && Array.isArray(userData.location.coordinates) && userData.location.coordinates.length === 2) ||
        // Check for address with coordinates (backend format)
        (userData.location.address && userData.location.coordinates && Array.isArray(userData.location.coordinates) && userData.location.coordinates.length === 2) ||
        // Check for just address (string format)
        (userData.location.address && typeof userData.location.address === 'string' && userData.location.address.length > 0)
      )) ||
      (typeof userData.location === 'string' && userData.location !== 'Not specified')
    );
    const hasRoles = userData.roles && userData.roles.length > 0 && 
                    userData.roles.some(role => role === 'tasker' || role === 'poster');
    
    console.log('🔍 Onboarding Check (fallback):', {
      hasLocation,
      hasRoles,
      location: userData.location,
      locationKeys: userData.location ? Object.keys(userData.location) : null,
      locationLat: userData.location?.lat,
      locationLng: userData.location?.lng,
      locationCoordinates: userData.location?.coordinates,
      roles: userData.roles,
      locationType: typeof userData.location,
      userDataKeys: Object.keys(userData || {}),
      userDataStringified: JSON.stringify(userData, null, 2)
    });
    
    // User must have both roles AND location to complete onboarding
    // This ensures users complete the full onboarding flow
    const result = hasRoles && hasLocation;
    console.log('🔍 hasCompletedOnboarding result (fallback):', result);
    
    // If we have the data but backend says incomplete, log a warning
    if (result && userData.onboardingStatus && !userData.onboardingStatus.isCompleted) {
      console.warn('⚠️ Frontend thinks onboarding is complete but backend disagrees. This might indicate a backend sync issue.');
    }
    
    return result;
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
    
    // Check data consistency between Firebase Auth and backend
    if (currentUser && userData) {
      const consistencyCheck = sessionManager.checkDataConsistency(userData, currentUser);
      if (!consistencyCheck.isConsistent) {
        console.warn('⚠️ Data consistency issues detected:', consistencyCheck.issues);
        console.warn('💡 Recommendations:', consistencyCheck.recommendations);
        
        // If there are critical consistency issues, redirect to appropriate fix
        if (consistencyCheck.issues.some(issue => issue.includes('UID mismatch'))) {
          console.error('🚨 Critical UID mismatch - redirecting to login');
          return 'Login';
        }
        
        if (consistencyCheck.issues.some(issue => issue.includes('No profile data'))) {
          console.log('🔄 Profile data missing - redirecting to onboarding');
          return 'ChooseLocationMethod';
        }
      }
    }
    
    // If still loading auth state, show loading state instead of landing
    // This prevents the "swinging" effect where users briefly see Landing page
    if (loading) {
      console.log('⏳ Auth still loading - showing loading state');
      return 'Loading'; // We'll handle this in renderScreen
    }
    
    // If we have a session but no user data yet, also show loading
    // This handles the case where session restoration is in progress
    const session = sessionManager.getSession();
    if (session.isAuthenticated && !currentUser && !userData) {
      console.log('⏳ Session restoration in progress - showing loading state');
      return 'Loading';
    }
    
    // If we're currently on Loading route, determine the correct route based on user state
    if (currentRoute === 'Loading') {
      console.log('🔍 Loading route check - determining correct route');
      
      // If user has completed onboarding, redirect to appropriate home screen
      if (currentUser && hasCompletedOnboarding()) {
        console.log('🔄 User on Loading route but has completed onboarding - redirecting to home');
        if (userData.roles && userData.roles.includes('tasker')) {
          console.log('✅ Redirecting to PerformerHome');
          return 'PerformerHome';
        } else if (userData.roles && userData.roles.includes('poster')) {
          console.log('✅ Redirecting to PosterHome');
          return 'PosterHome';
        }
      }
      
      // If user is authenticated but onboarding not complete, redirect to onboarding
      if (currentUser && !hasCompletedOnboarding()) {
        console.log('🔄 User on Loading route but onboarding not complete - redirecting to onboarding');
        return 'ChooseLocationMethod';
      }
      
      // If not authenticated, redirect to Landing
      if (!currentUser) {
        console.log('🔄 User on Loading route but not authenticated - redirecting to Landing');
        return 'Landing';
      }
      
      // If still loading, stay on Loading
      console.log('⏳ Still loading - staying on Loading route');
      return 'Loading';
    }
    
    // If role selection is in progress, don't redirect
    if (isRoleSelectionInProgress) {
      console.log('⏳ Role selection in progress - skipping redirects');
      return currentRoute;
    }
    
    // Check if user should continue onboarding from where they left off
    if (currentUser && sessionManager.shouldContinueOnboarding()) {
      const nextStep = sessionManager.getNextOnboardingStep();
      console.log('🔄 User should continue onboarding from step:', nextStep);
      
      // If user is on a different onboarding step, redirect to the correct one
      const onboardingRoutes = ['ChooseLocationMethod', 'LocationInput', 'LocationConfirmation', 'SearchLocation', 'RoleSelection'];
      if (onboardingRoutes.includes(currentRoute) && currentRoute !== nextStep) {
        console.log('🔄 Redirecting to correct onboarding step:', nextStep);
        return nextStep;
      }
      
      // If user is on a non-onboarding route but should continue onboarding
      if (!onboardingRoutes.includes(currentRoute)) {
        console.log('🔄 Redirecting to onboarding step:', nextStep);
        return nextStep;
      }
    }
    
    // If we're on Landing page, check if user should be redirected to home
    if (currentRoute === 'Landing') {
      console.log('🔍 Landing page check:', {
        hasCurrentUser: !!currentUser,
        hasCompletedOnboarding: hasCompletedOnboarding(),
        userData: userData,
        userRoles: userData?.roles
      });
      
      // If user is authenticated and has completed onboarding, redirect to appropriate home screen
      if (currentUser && hasCompletedOnboarding()) {
        console.log('🔄 User authenticated with completed onboarding - redirecting from Landing to home');
        // Determine which home screen to show based on user's role
        if (userData.roles && userData.roles.includes('tasker')) {
          console.log('✅ Redirecting to PerformerHome');
          return 'PerformerHome';
        } else if (userData.roles && userData.roles.includes('poster')) {
          console.log('✅ Redirecting to PosterHome');
          return 'PosterHome';
        }
      }
      
      // If user has roles but no location, redirect to location setup
      if (currentUser && userData && userData.roles && userData.roles.length > 0 && 
          (!userData.location || (typeof userData.location === 'object' && (!userData.location.lat || !userData.location.lng)))) {
        console.log('🔄 User has roles but no location - redirecting to ChooseLocationMethod');
        return 'ChooseLocationMethod';
      }
      
      // If not authenticated or onboarding not complete, allow Landing
      console.log('✅ On Landing page - allowing it (not authenticated or onboarding not complete)');
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
    
    // If we're on onboarding pages, check if user has completed onboarding
    const onboardingPages = ['ChooseLocationMethod', 'LocationInput', 'LocationConfirmation', 'SearchLocation', 'RoleSelection'];
    if (onboardingPages.includes(currentRoute)) {
      // If user has completed onboarding, redirect to appropriate home screen
      if (currentUser && hasCompletedOnboarding()) {
        console.log('🔄 User has completed onboarding but is on onboarding page - redirecting to home');
        if (userData.roles && userData.roles.includes('tasker')) {
          console.log('✅ Redirecting to PerformerHome');
          return 'PerformerHome';
        } else if (userData.roles && userData.roles.includes('poster')) {
          console.log('✅ Redirecting to PosterHome');
          return 'PosterHome';
        }
      }
      // If onboarding not complete, allow staying on onboarding page
      console.log('✅ On onboarding page - allowing it:', currentRoute);
      return currentRoute;
    }
    
    // If we're on home screens and user has completed onboarding, always allow them
    if ((currentRoute === 'PerformerHome' || currentRoute === 'PosterHome') && hasCompletedOnboarding()) {
      console.log('✅ On home screen with completed onboarding - allowing it');
      return currentRoute;
    }
    
    // If we're on home screens and user has roles but no location, redirect to location setup
    if ((currentRoute === 'PerformerHome' || currentRoute === 'PosterHome') && 
        userData && userData.roles && userData.roles.length > 0 && 
        userData.roles.some(role => role === 'tasker' || role === 'poster') &&
        (!userData.location || (typeof userData.location === 'object' && (!userData.location.lat || !userData.location.lng)))) {
      console.log('🔄 User on home screen with roles but no location - redirecting to ChooseLocationMethod');
      return 'ChooseLocationMethod';
    }
    
    // DEBUG: Log why we're redirecting from home screens
    if (currentRoute === 'PerformerHome' || currentRoute === 'PosterHome') {
      console.log('🔍 DEBUG: User on home screen but being redirected. Details:', {
        currentRoute,
        hasCompletedOnboarding: hasCompletedOnboarding(),
        hasRoles: userData?.roles && userData.roles.length > 0,
        hasLocation: !!userData?.location,
        locationDetails: userData?.location,
        onboardingStatus: userData?.onboardingStatus,
        userDataKeys: Object.keys(userData || {})
      });
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
    return currentRoute;
  };

  const correctRoute = getCorrectRoute();

  // Sync URL when correct route differs from current route
  useEffect(() => {
    if (correctRoute !== currentRoute) {
      console.log('🔄 Route redirect:', currentRoute, '→', correctRoute);
      
      // Don't redirect if we're showing loading state
      if (correctRoute === 'Loading') {
        console.log('⏳ Skipping redirect - showing loading state');
        return;
      }
      
      // Don't redirect if we're already on loading state, UNLESS user has completed onboarding
      if (currentRoute === 'Loading' && !hasCompletedOnboarding()) {
        console.log('⏳ Skipping redirect - already on loading state and onboarding not complete');
        return;
      }
      
      // Don't redirect if we're on Landing page and auth is still loading
      // UNLESS the user is authenticated and has completed onboarding
      if (currentRoute === 'Landing' && loading && (!currentUser || !hasCompletedOnboarding())) {
        console.log('⏳ Skipping redirect - on Landing and auth still loading');
        return;
      }
      
      // Don't redirect if we're in loading state and session restoration is in progress
      const session = sessionManager.getSession();
      if (currentRoute === 'Loading' && session.isAuthenticated && (!currentUser || !userData)) {
        console.log('⏳ Skipping redirect - session restoration in progress');
        return;
      }
      
      // Add a small delay to ensure web initialization completes first
      setTimeout(() => {
        syncUrlForRedirect(correctRoute);
      }, 100);
    }
  }, [correctRoute, currentRoute, syncUrlForRedirect, loading, currentUser, hasCompletedOnboarding, userData]);

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
    // Show loading screen while auth is loading
    if (correctRoute === 'Loading') {
      return <LoadingScreen />;
    }
    
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