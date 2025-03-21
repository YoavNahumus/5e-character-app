import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText} from '@/components/ThemedText';
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedScrollView } from '@/components/ThemedScrollView';

/**
 * Component for selecting a character race
 */
const RaceSelection = ({ races, selectRace, showRaceFeatures }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter races based on search query
  const filteredRaces = races.filter(race => 
    race.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.title}>Choose Your Race</ThemedText>
      <ThemedText style={styles.subtitle}>Your race determines various traits and abilities</ThemedText>
      
      <ThemedTextInput
        style={styles.searchInput}
        placeholder="Search races..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <ThemedScrollView style={styles.selectionContainer}>
        {filteredRaces.map((race, index) => (
          <ThemedView key={`${race.name}-${index}`} style={styles.cardContainer}>
            <ThemedTouchableOpacity 
              style={styles.card}
              onPress={() => selectRace(race)}
            >
              <ThemedView style={styles.option}>
                <ThemedText style={styles.optionName}>{race.name}</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Size: {race.size}, Speed: {race.speed} ft.
                </ThemedText>
                <ThemedView style={styles.abilityBonuses}>
                  {race.abilityScoreIncreases && race.abilityScoreIncreases.length > 0 && race.abilityScoreIncreases[0] && 
                    Object.entries(race.abilityScoreIncreases[0]).map(([ability, bonus]) => (
                      <ThemedView key={ability} style={styles.abilityBonus}>
                        <ThemedText style={styles.abilityBonusText}>
                          {ability.substring(0, 3).toUpperCase()} +{bonus}
                        </ThemedText>
                      </ThemedView>
                    ))
                  }
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={styles.cardFooter}>
                <ThemedTouchableOpacity 
                  style={styles.viewFeaturesButton}
                  onPress={() => showRaceFeatures(race)}
                >
                  <ThemedText style={styles.viewFeaturesText}>View Features</ThemedText>
                </ThemedTouchableOpacity>
                
                <ThemedTouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => selectRace(race)}
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
    marginBottom: 10,
  },
  abilityBonuses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  abilityBonus: {
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
