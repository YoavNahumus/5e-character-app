import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

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
    <View style={styles.section}>
      <Text style={styles.title}>Choose Your Class</Text>
      <Text style={styles.subtitle}>Your class determines your abilities and progression</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search classes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ScrollView style={styles.selectionContainer}>
        {filteredClasses.map((charClass, index) => (
          <View key={`${charClass.name}-${index}`} style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => selectClass(charClass)}
            >
              <View>
                <Text style={styles.optionName}>{charClass.name}</Text>
                <Text style={styles.optionDescription}>
                  Hit Die: d{charClass.hd && charClass.hd.faces}
                </Text>
                {charClass.proficiency && (
                  <Text style={styles.optionDescription}>
                    Proficient Saves: {Array.isArray(charClass.proficiency.saves) 
                      ? charClass.proficiency.saves.join(', ') 
                      : 'None'}
                  </Text>
                )}
              </View>
              
              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.viewFeaturesButton}
                  onPress={() => showClassFeatures(charClass)}
                >
                  <Text style={styles.viewFeaturesText}>View Features</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => selectClass(charClass)}
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
