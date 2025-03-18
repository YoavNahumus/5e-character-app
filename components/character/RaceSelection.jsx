import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

/**
 * Component for selecting a character race
 */
const RaceSelection = ({ races, selectRace, showRaceFeatures }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter races based on search query
  const filteredRaces = races.filter(race => 
    race.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Choose Your Race</Text>
      <Text style={styles.subtitle}>Your race determines various traits and abilities</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search races..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ScrollView style={styles.selectionContainer}>
        {filteredRaces.map((race, index) => (
          <View key={`${race.name}-${index}`} style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => selectRace(race)}
            >
              <View>
                <Text style={styles.optionName}>{race.name}</Text>
                <Text style={styles.optionDescription}>
                  Size: {race.size}, Speed: {race.speed} ft.
                </Text>
                <View style={styles.abilityBonuses}>
                  {race.abilityScoreIncreases && race.abilityScoreIncreases.length > 0 && race.abilityScoreIncreases[0] && 
                    Object.entries(race.abilityScoreIncreases[0]).map(([ability, bonus]) => (
                      <View key={ability} style={styles.abilityBonus}>
                        <Text style={styles.abilityBonusText}>
                          {ability.substring(0, 3).toUpperCase()} +{bonus}
                        </Text>
                      </View>
                    ))
                  }
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.viewFeaturesButton}
                  onPress={() => showRaceFeatures(race)}
                >
                  <Text style={styles.viewFeaturesText}>View Features</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => selectRace(race)}
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
    marginBottom: 10,
  },
  abilityBonuses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  abilityBonus: {
    backgroundColor: '#e0e0fa',
    borderRadius: 4,
    padding: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  abilityBonusText: {
    fontSize: 12,
    color: '#4b4ba5',
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

export default RaceSelection;
