import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (loading || disabled) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },

  primary: {
    backgroundColor: '#2563EB',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  danger: {
    backgroundColor: '#DC2626',
  },

  text: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryText: {
    color: '#FFF',
  },
  secondaryText: {
    color: '#111827',
  },
  dangerText: {
    color: '#FFF',
  },

  disabled: {
    opacity: 0.6,
  },
});
