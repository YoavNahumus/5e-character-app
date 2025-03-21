import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity';

/**
 * Component for displaying character summary and saving
 */
const CharacterSummary = ({ character, getAbilityModifier, saveCharacter, goBack }) => {
  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.title}>Character Summary</ThemedText>
      
      <ThemedView style={styles.summaryContainer}>
        <ThemedText style={styles.summaryItem}>Name: {character.name || 'Unnamed'}</ThemedText>
        <ThemedText style={styles.summaryItem}>Race: {character.race}</ThemedText>
        <ThemedText style={styles.summaryItem}>Class: {character.class}</ThemedText>
        <ThemedText style={styles.summaryItem}>Background: {character.background}</ThemedText>
        
        <ThemedText style={styles.summaryHeader}>Ability Scores:</ThemedText>
        {character.abilities && Object.entries(character.abilities).map(([ability, score]) => {
          const modifier = getAbilityModifier(score);
          const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          return (
            <ThemedText key={ability} style={styles.summaryItem}>
              {ability.charAt(0).toUpperCase() + ability.slice(1)}: {score} ({modifierText})
            </ThemedText>
          );
        })}
        
        {character.skills && character.skills.length > 0 && (
          <>
            <ThemedText style={styles.summaryHeader}>Skills:</ThemedText>
            <ThemedText style={styles.summaryItem}>{character.skills.join(', ')}</ThemedText>
          </>
        )}
        
        {character.features && character.features.length > 0 && (
          <>
            <ThemedText style={styles.summaryHeader}>Features:</ThemedText>
            {character.features.map((feature, index) => (
              <ThemedText key={index} style={styles.summaryItem}>
                {typeof feature === 'string' ? feature : feature.name}
              </ThemedText>
            ))}
          </>
        )}
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <ThemedTouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <ThemedText style={styles.buttonText}>Back</ThemedText>
        </ThemedTouchableOpacity>
        
        <ThemedTouchableOpacity 
          style={styles.finishButton}
          onPress={saveCharacter}
        >
          <ThemedText style={styles.buttonText}>Save Character</ThemedText>
        </ThemedTouchableOpacity>
      </ThemedView>
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
    marginBottom: 20,
  },
  summaryContainer: {
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
    paddingBottom: 5,
  },
  summaryItem: {
    fontSize: 16,
    marginBottom: 8,
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
