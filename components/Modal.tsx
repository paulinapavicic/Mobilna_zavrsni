import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const CustomModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  title?: string;
}> = ({ visible, onClose, children, title }) => (
  <Modal visible={visible} transparent>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 10 }}>
        {title && <Text style={{ fontWeight: 'bold' }}>{title}</Text>}
        {children}
        <TouchableOpacity onPress={onClose}><Text>Close</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default CustomModal;
