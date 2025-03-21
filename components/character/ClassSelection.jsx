import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity';
import { ThemedView } from '@/components/ThemedView';

/**
 * Component for selecting a character class
 */
const ClassSelection = ({ classes, selectClass, showClassFeatures }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter classes based on search query
  const filteredClasses = classes.filter(charClass => 
    charClass.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.title}>Choose Your Class</ThemedText>
      <ThemedText style={styles.subtitle}>Your class determines your abilities and progression</ThemedText>
      
      <ThemedTextInput
        style={styles.searchInput}
        placeholder="Search classes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ThemedScrollView style={styles.selectionContainer}>
        {filteredClasses.map((charClass, index) => (
          <ThemedView key={`${charClass.name}-${index}`} style={styles.cardContainer}>
            <ThemedTouchableOpacity 
              style={styles.card}
              onPress={() => selectClass(charClass)}
            >
              <ThemedView style={styles.option}>
                <ThemedText style={styles.optionName}>{charClass.name}</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Hit Die: d{charClass.hd && charClass.hd.faces}
                </ThemedText>
                {charClass.proficiency && (
                  <ThemedText style={styles.optionDescription}>
                    Proficient Saves: {Array.isArray(charClass.proficiency.saves) 
                      ? charClass.proficiency.saves.join(', ') 
                      : 'None'}
                  </ThemedText>
                )}
              </ThemedView>
              
              <ThemedView style={styles.cardFooter}>
                <ThemedTouchableOpacity 
                  style={styles.viewFeaturesButton}
                  onPress={() => showClassFeatures(charClass)}
                >
                  <ThemedText style={styles.viewFeaturesText}>View Features</ThemedText>
                </ThemedTouchableOpacity>
                
                <ThemedTouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => selectClass(charClass)}
                >
                  <ThemedText style={styles.selectButtonText}>Select</ThemedText>
                </ThemedTouchableOpacity>
              </ThemedView>
            </ThemedTouchableOpacity>
          </ThemedView>
        ))}
      </ThemedScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  selectionContainer: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  option: {
    padding: 10,
    borderRadius: 5,
  },
  optionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewFeaturesButton: {
    backgroundColor: '#e0e0fa',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  viewFeaturesText: {
    color: '#4b4ba5',
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#6200ea',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ClassSelection;
