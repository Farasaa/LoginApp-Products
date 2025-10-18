 
import { View, StyleSheet } from 'react-native';
import { useAutoLock } from '../../hooks/useAutoLock';

 
interface ActivityDetectorProps {
  children: React.ReactNode;
}

const ActivityDetector: React.FC<ActivityDetectorProps> = ({ children }) => {
  const { resetInactivityTimer } = useAutoLock();

 
  const handleInteraction = () => {
    resetInactivityTimer();
  };

  return (
    <View 
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleInteraction}
      onResponderMove={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ActivityDetector;

