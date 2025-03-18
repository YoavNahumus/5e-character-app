import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Component for displaying character summary and saving
 */
const CharacterSummary = ({ character, getAbilityModifier, saveCharacter, goBack }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Character Summary</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryItem}>Name: {character.name || 'Unnamed'}</Text>
        <Text style={styles.summaryItem}>Race: {character.race}</Text>
        <Text style={styles.summaryItem}>Class: {character.class}</Text>
        <Text style={styles.summaryItem}>Background: {character.background}</Text>
        
        <Text style={styles.summaryHeader}>Ability Scores:</Text>
        {character.abilities && Object.entries(character.abilities).map(([ability, score]) => {
          const modifier = getAbilityModifier(score);
          const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          return (
            <Text key={ability} style={styles.summaryItem}>
              {ability.charAt(0).toUpperCase() + ability.slice(1)}: {score} ({modifierText})
            </Text>
          );
        })}
        
        {character.skills && character.skills.length > 0 && (
          <>
            <Text style={styles.summaryHeader}>Skills:</Text>
            <Text style={styles.summaryItem}>{character.skills.join(', ')}</Text>
          </>
        )}
        
        {character.features && character.features.length > 0 && (
          <>
            <Text style={styles.summaryHeader}>Features:</Text>
            {character.features.map((feature, index) => (
              <Text key={index} style={styles.summaryItem}>
                {typeof feature === 'string' ? feature : feature.name}
              </Text>
            ))}
          </>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.finishButton}
          onPress={saveCharacter}
        >
          <Text style={styles.buttonText}>Save Character</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  summaryItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#666',
    borderRadius: 5,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#6200ea',
    borderRadius: 5,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CharacterSummary;
