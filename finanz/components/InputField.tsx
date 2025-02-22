// components/InputField.js
import { colors } from '@/app/(tabs)/Colors';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry,
  ...props 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#666"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: colors.dark.inputBackground,
    color: colors.dark.text,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
});