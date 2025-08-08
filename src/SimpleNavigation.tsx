import React, { useState, useEffect } from 'react';
import { Platform, BackHandler } from 'react-native';

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
import MakeOfferDetailsScreen from './MakeOfferDetailsScreen';

// Navigation context
interface NavigationContextType {
  currentRoute: string;
  navigate: (route: string, params?: any) => void;
  goBack: () => void;
  params: any;
  routeHistory: string[];
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
      const initialPath = window.location.pathname.slice(1) || 'Landing';
      const initialParams = parseQueryParams(window.location.search);
      
      setCurrentRoute(initialPath);
      setParams(initialParams);
      
      // Initialize history based on the current URL
      // If it's not Landing, we can't reconstruct the full history, so we start fresh
      if (initialPath === 'Landing') {
        setRouteHistory(['Landing']);
      } else {
        // For direct access to other routes, we can't reconstruct history
        // So we start with the current route and let navigation build it up
        setRouteHistory([initialPath]);
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

  const value: NavigationContextType = {
    currentRoute,
    navigate,
    goBack,
    params,
    routeHistory,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Main navigation component
const SimpleNavigation: React.FC = () => {
  const { currentRoute, routeHistory } = useNavigation();
  const [showDebug, setShowDebug] = useState(true);

  // Debug component for testing (remove in production)
  const DebugInfo = () => {
    if (Platform.OS === 'web' && showDebug) {
      return (
        <div style={{
          position: 'fixed',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          fontSize: 12,
          zIndex: 9999,
          maxWidth: 300
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span>Debug Info</span>
            <button 
              onClick={() => setShowDebug(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: 16,
                padding: 0,
                margin: 0
              }}
            >
              ×
            </button>
          </div>
          <div>Current: {currentRoute}</div>
          <div>History: {routeHistory.join(' → ')}</div>
          <div>Length: {routeHistory.length}</div>
        </div>
      );
    }
    return null;
  };

  const renderScreen = () => {
    // For web platform, use WebLanding for the Landing route
    if (Platform.OS === 'web' && currentRoute === 'Landing') {
      return <WebLanding />;
    }

    switch (currentRoute) {
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
      case 'MakeOfferDetails':
        return <MakeOfferDetailsScreen />;
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