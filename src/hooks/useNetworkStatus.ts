import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

 
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
     
    const unsubscribe = NetInfo.addEventListener((state) => {
  
      setIsConnected(state.isConnected ?? false);
      setIsOnline(state.isInternetReachable ?? false);
    });

     
    NetInfo.fetch().then((state) => {
 
      setIsConnected(state.isConnected ?? false);
      setIsOnline(state.isInternetReachable ?? false);
    });

     
    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline, isConnected };
};

