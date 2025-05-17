import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import colors from './src/theme/colors';
import {MuteProvider} from './src/context/MuteContext';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <StatusBar barStyle="light-content" />
      <MuteProvider>
        <HomeScreen />
      </MuteProvider>
    </SafeAreaView>
  );
};

export default App;
