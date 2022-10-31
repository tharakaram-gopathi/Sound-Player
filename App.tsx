
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Colors, } from 'react-native/Libraries/NewAppScreen';
import InitialScreen from './src/screens/InitialScreen';


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#4566e0', flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: '#4566e0' }}>
        <InitialScreen />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
