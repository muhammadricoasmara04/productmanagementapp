import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FabButtonProps {
  icon: string;
  onPress: () => void;
}

const FabButton = ({ icon, onPress }: FabButtonProps) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Icon name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default FabButton;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#466BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
