import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

/**
 * Component for selecting a character background
 */
const BackgroundSelection = ({ backgrounds, selectBackground, showBackgroundFeatures }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter backgrounds based on search query
  const filteredBackgrounds = backgrounds.filter(background => 
    background.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Choose a Background</Text>
      <Text style={styles.subtitle}>Your background provides additional skills and equipment</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search backgrounds..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ScrollView style={styles.selectionContainer}>
        {filteredBackgrounds.map((background, index) => (
          <View key={`${background.name}-${index}`} style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => selectBackground(background)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.optionName}>{background.name}</Text>
                <Text style={styles.optionDescription}>
                  {typeof background.description === 'string' 
                    ? background.description.substring(0, 100) + '...'
                    : 'No description available'}
                </Text>
              </View>
              
              <View style={styles.skillsContainer}>
                <Text style={styles.skillsText}>
                  Skills: {(() => {
                    // Try to get skills from skillProficiencies first
                    if (background.skillProficiencies) {
                      if (Array.isArray(background.skillProficiencies)) {
                        return background.skillProficiencies
                          .filter(s => typeof s === 'string')
                          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                          .join(', ');
                      } else if (typeof background.skillProficiencies === 'object') {
                        return Object.keys(background.skillProficiencies)
                          .filter(skill => background.skillProficiencies[skill] === true)
                          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                          .join(', ');
                      }
                    }
                    
                    // Fallback to skills array
                    return Array.isArray(background.skills) 
                      ? background.skills
                          .filter(s => typeof s === 'string')
                          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                          .join(', ')
                      : 'None';
                  })()}
                </Text>
              </View>
              
              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.viewFeaturesButton}
                  onPress={() => showBackgroundFeatures(background)}
                >
                  <Text style={styles.viewFeaturesText}>View Features</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => selectBackground(background)}
                >
                  <Text style={styles.selectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
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
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectionContainer: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
  },
  optionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  skillsContainer: {
    backgroundColor: '#e0e0fa',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  skillsText: {
    color: '#4b4ba5',
    fontSize: 14,
  },
  cardFooter: {
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

export default BackgroundSelection;
