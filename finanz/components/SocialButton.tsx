// components/SocialButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const SocialButton = ({ title, onPress, iconName }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={20} color="#000" style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});