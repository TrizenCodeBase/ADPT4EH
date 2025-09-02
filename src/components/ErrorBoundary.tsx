import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to console for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // In production, you might want to send this to an error reporting service
    // reportErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    if (error && errorInfo) {
      const errorReport = `
Error: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo.componentStack}
      `.trim();
      
      // Copy to clipboard or show in alert
      Alert.alert(
        'Error Report',
        'Please copy this error information and report it to support:',
        [
          { text: 'Copy Error', onPress: () => console.log('Error copied:', errorReport) },
          { text: 'OK', style: 'default' }
        ]
      );
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </Text>
          
          {__DEV__ && this.state.error && (
            <View style={styles.devErrorContainer}>
              <Text style={styles.devErrorTitle}>Development Error Details:</Text>
              <Text style={styles.devErrorMessage}>{this.state.error.message}</Text>
              <Text style={styles.devErrorStack}>{this.state.error.stack}</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.reportButton} onPress={this.handleReportError}>
              <Text style={styles.buttonText}>Report Error</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24
  },
  devErrorContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%'
  },
  devErrorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8
  },
  devErrorMessage: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 8,
    fontFamily: 'monospace'
  },
  devErrorStack: {
    fontSize: 10,
    color: '#856404',
    fontFamily: 'monospace'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6
  },
  reportButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ErrorBoundary;
