import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Header from '../../components/Header'
interface Props {
}

const InitialScreen: React.FC<Props> = ({}) => {
  return (
    <View style={styles.header}>
      {/* <Text style={styles.headerText}>{title}</Text> */}
      <Header title={"Audio Play"}/>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cfcfcf',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default InitialScreen;