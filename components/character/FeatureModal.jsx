import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity';
import { ThemedView } from '@/components/ThemedView';

/**
 * Component for displaying feature details in a modal
 */
const FeatureModal = ({ visible, content, onClose, parseSpecialTags }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>{content?.title || 'Features'}</ThemedText>
          
          <ThemedScrollView style={styles.modalBody}>
            {content?.content && content.content.map((feature, index) => (
              <ThemedView style={styles.featureItem} key={index}>
                <ThemedText style={styles.featureTitle}>{feature.name}</ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {typeof feature.entries === 'string' ? parseSpecialTags(feature.entries) : 
                   Array.isArray(feature.entries) ? feature.entries.map(entry => {
                     if (typeof entry === 'string') return parseSpecialTags(entry);
                     if (entry && typeof entry === 'object') {
                       if (entry.type === 'list' && Array.isArray(entry.items)) {
                         return `• ${entry.items.map(item => typeof item === 'string' ? parseSpecialTags(item) : '').join('\n• ')}`;
                       } else if (entry.type === 'table') {
                         return `[Table: ${entry.caption || 'Data'}]`;
                       } else if (entry.type === 'entries' && entry.name) {
                         return `${entry.name}`;
                       } else if (entry.type === 'trait' && entry.name) {
                         return entry.name; // Just show the name for traits
                       }
                     }
                     return '';
                   }).join('\n') : 
                   'No description available'}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedScrollView>
          
          <ThemedTouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </ThemedTouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgb(11, 13, 15)',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBody: {
    maxHeight: 400,
  },
  featureItem: {
    padding: 15,
    borderBottomWidth: 3,
    borderColor: 'rgb(11, 13, 15)'
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FeatureModal;
