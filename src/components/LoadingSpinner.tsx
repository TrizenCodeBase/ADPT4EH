import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  type?: 'spinner' | 'skeleton' | 'dots';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  text,
  type = 'spinner',
}) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (type === 'spinner') {
      const spin = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spin.start();
      return () => spin.stop();
    }
  }, [spinValue, type]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 40;
      default: return 30;
    }
  };

  const renderSpinner = () => (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: getSize(),
          height: getSize(),
          borderColor: color,
          borderTopColor: 'transparent',
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: color,
              width: getSize() / 3,
              height: getSize() / 3,
              opacity: spinValue.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [0.3, 1, 0.3, 0.3],
              }),
            },
          ]}
        />
      ))}
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonLine, { height: getSize() / 2 }]} />
      <View style={[styles.skeletonLine, { height: getSize() / 3, width: '70%' }]} />
    </View>
  );

  const renderContent = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinner: {
    borderWidth: 2,
    borderRadius: 50,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 2,
  },
  skeletonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  skeletonLine: {
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginVertical: 4,
    width: '100%',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default LoadingSpinner;
