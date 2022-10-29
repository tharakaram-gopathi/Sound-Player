import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface Props {
  title: string;
}

const Header: React.FC<Props> = ({title}) => {
  return (
    <View >
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color:"#FFFFFF"
  },
});

export default Header;