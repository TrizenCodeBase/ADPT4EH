// Session Manager for persistent login and onboarding state
export interface OnboardingState {
  step: 'location' | 'roles' | 'complete';
  locationData?: {
    method: 'search' | 'input' | 'gps';
    location?: any;
  };
  roleData?: {
    selectedRoles: string[];
  };
  lastUpdated: number;
}

export interface SessionData {
  isAuthenticated: boolean;
  onboardingState: OnboardingState | null;
  lastRoute: string;
  lastRouteParams: any;
  lastActivity: number;
}

class SessionManager {
  private readonly SESSION_KEY = 'extrahand_session';
  private readonly ONBOARDING_KEY = 'extrahand_onboarding';
  private readonly ROUTE_KEY = 'extrahand_route';

  // Save session data
  saveSession(data: Partial<SessionData>): void {
    try {
      const existing = this.getSession();
      const sessionData: SessionData = {
        ...existing,
        ...data,
        lastActivity: Date.now()
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      console.log('💾 Session saved:', sessionData);
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  // Get session data
  getSession(): SessionData {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : this.getDefaultSession();
    } catch (error) {
      console.warn('Failed to get session:', error);
      return this.getDefaultSession();
    }
  }

  // Save onboarding state
  saveOnboardingState(state: OnboardingState): void {
    try {
      localStorage.setItem(this.ONBOARDING_KEY, JSON.stringify(state));
      console.log('💾 Onboarding state saved:', state);
    } catch (error) {
      console.warn('Failed to save onboarding state:', error);
    }
  }

  // Get onboarding state
  getOnboardingState(): OnboardingState | null {
    try {
      const data = localStorage.getItem(this.ONBOARDING_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get onboarding state:', error);
      return null;
    }
  }

  // Save current route
  saveRoute(route: string, params?: any): void {
    try {
      const routeData = { route, params, timestamp: Date.now() };
      localStorage.setItem(this.ROUTE_KEY, JSON.stringify(routeData));
      console.log('💾 Route saved:', routeData);
    } catch (error) {
      console.warn('Failed to save route:', error);
    }
  }

  // Get last route
  getLastRoute(): { route: string; params: any; timestamp: number } | null {
    try {
      const data = localStorage.getItem(this.ROUTE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get last route:', error);
      return null;
    }
  }

  // Clear session data
  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.ONBOARDING_KEY);
      localStorage.removeItem(this.ROUTE_KEY);
      console.log('🗑️ Session cleared');
    } catch (error) {
      console.warn('Failed to clear session:', error);
    }
  }

  // Check if session is still valid (within 30 days)
  isSessionValid(): boolean {
    const session = this.getSession();
    if (!session.isAuthenticated) return false;
    
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return session.lastActivity > thirtyDaysAgo;
  }

  // Get the next onboarding step
  getNextOnboardingStep(): string {
    const onboardingState = this.getOnboardingState();
    
    if (!onboardingState) {
      return 'ChooseLocationMethod';
    }

    switch (onboardingState.step) {
      case 'location':
        // If user has selected a location method, they should proceed to the next step
        if (onboardingState.locationData?.method) {
          // If user has both method AND location data, they've completed location step
          if (onboardingState.locationData.location) {
            return 'RoleSelection';
          }
          // If user has method but no location yet, they need to complete the location input
          if (onboardingState.locationData.method === 'input') {
            return 'LocationInput';
          } else if (onboardingState.locationData.method === 'search') {
            return 'SearchLocation';
          }
        }
        return 'ChooseLocationMethod';
      
      case 'roles':
        if (onboardingState.roleData?.selectedRoles && onboardingState.roleData.selectedRoles.length > 0) {
          return 'complete';
        }
        return 'RoleSelection';
      
      case 'complete':
        return 'complete';
      
      default:
        return 'ChooseLocationMethod';
    }
  }

  // Update onboarding step
  updateOnboardingStep(step: OnboardingState['step'], data?: any): void {
    const currentState = this.getOnboardingState() || {
      step: 'location',
      lastUpdated: Date.now()
    };

    const updatedState: OnboardingState = {
      ...currentState,
      step,
      lastUpdated: Date.now()
    };

    // Update specific data based on step
    if (step === 'location' && data) {
      updatedState.locationData = data;
    } else if (step === 'roles' && data) {
      updatedState.roleData = data;
    }

    this.saveOnboardingState(updatedState);
  }

  // Check if user should continue from onboarding
  shouldContinueOnboarding(): boolean {
    const session = this.getSession();
    const onboardingState = this.getOnboardingState();
    // Only continue onboarding if user is authenticated AND has incomplete onboarding
    return session.isAuthenticated && onboardingState !== null && onboardingState.step !== 'complete';
  }

  // Get default session
  private getDefaultSession(): SessionData {
    return {
      isAuthenticated: false,
      onboardingState: null,
      lastRoute: 'Landing',
      lastRouteParams: {},
      lastActivity: Date.now()
    };
  }
}

export const sessionManager = new SessionManager();
