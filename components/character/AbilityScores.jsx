import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity'

/**
 * Component for setting ability scores
 */
const AbilityScores = ({ character, setCharacter, goToNext, goBack }) => {
  const [availablePoints, setAvailablePoints] = useState(27);
  const [abilities, setAbilities] = useState({
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8
  });

  // Get ability modifier based on score
  const getAbilityModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  // Calculate cost of increasing ability score
  const getPointCost = (currentScore) => {
    if (currentScore >= 13) return 2;
    return 1;
  };

  // Update ability scores
  const updateAbility = (ability, change) => {
    const currentScore = abilities[ability];
    const newScore = currentScore + change;
    
    // Validate constraints
    if (newScore < 8 || newScore > 15) return;
    
    // Calculate point cost
    const pointCost = change > 0 ? getPointCost(currentScore) : getPointCost(currentScore - 1) * -1;
    
    // Check if enough points available
    if (availablePoints - pointCost < 0) return;
    
    // Update state
    setAbilities({
      ...abilities,
      [ability]: newScore
    });
    
    setAvailablePoints(availablePoints - pointCost);
  };

  // Apply racial ability bonuses if available
  const applyRacialBonuses = (baseAbilities) => {
    const raceBonuses = character.abilityBonuses || {};
    const result = { ...baseAbilities };
    
    Object.entries(raceBonuses).forEach(([ability, bonus]) => {
      if (result[ability]) {
        result[ability] += bonus;
      }
    });
    
    return result;
  };

  // Handle finalization of ability scores
  const finalizeAbilityScores = () => {
    // Apply racial bonuses to base scores
    const finalAbilities = applyRacialBonuses(abilities);
    
    // Update character with final ability scores
    setCharacter({
      ...character,
      abilities: finalAbilities
    });
    
    // Move to next step
    goToNext();
  };

  // Combine base score with racial bonus for display
  const getFinalScore = (ability) => {
    const baseScore = abilities[ability];
    const raceBonus = (character.abilityBonuses && character.abilityBonuses[ability]) || 0;
    return baseScore + raceBonus;
  };

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.title}>Set Ability Scores</ThemedText>
      <ThemedText style={styles.subtitle}>
        Points remaining: {availablePoints}
      </ThemedText>
      
      <ThemedView style={styles.abilityContainer}>
        {Object.entries(abilities).map(([ability, score]) => {
          const finalScore = getFinalScore(ability);
          const modifier = getAbilityModifier(finalScore);
          const modifierDisplay = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          const raceBonus = (character.abilityBonuses && character.abilityBonuses[ability]) || 0;
          
          return (
            <ThemedView key={ability} style={styles.abilityRow}>
              <ThemedText style={styles.abilityName}>
                {ability.charAt(0).toUpperCase() + ability.slice(1)}
              </ThemedText>
              
              <ThemedView style={styles.scoreControls}>
                <ThemedTouchableOpacity
                  style={[styles.controlButton, abilities[ability] <= 8 && styles.disabledButton]}
                  onPress={() => updateAbility(ability, -1)}
                  disabled={abilities[ability] <= 8}
                >
                  <ThemedText style={styles.controlButtonText}>-</ThemedText>
                </ThemedTouchableOpacity>
                
                <ThemedView style={styles.scoreDisplay}>
                  <ThemedText style={styles.baseScore}>{score}</ThemedText>
                  {raceBonus > 0 && (
                    <ThemedText style={styles.raceBonus}>+{raceBonus}</ThemedText>
                  )}
                  <ThemedText style={styles.finalScore}>{finalScore}</ThemedText>
                  <ThemedText style={styles.modifier}>{modifierDisplay}</ThemedText>
                </ThemedView>
                
                <ThemedTouchableOpacity
                  style={[styles.controlButton, (abilities[ability] >= 15 || availablePoints < getPointCost(abilities[ability])) && styles.disabledButton]}
                  onPress={() => updateAbility(ability, 1)}
                  disabled={abilities[ability] >= 15 || availablePoints < getPointCost(abilities[ability])}
                >
                  <ThemedText style={styles.controlButtonText}>+</ThemedText>
                </ThemedTouchableOpacity>
              </ThemedView>
            </ThemedView>
          );
        })}
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <ThemedTouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <ThemedText style={styles.buttonText}>Back</ThemedText>
        </ThemedTouchableOpacity>
        
        <ThemedTouchableOpacity 
          style={styles.nextButton}
          onPress={finalizeAbilityScores}
        >
          <ThemedText style={styles.buttonText}>Next</ThemedText>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  abilityContainer: {
    marginBottom: 20,
  },
  abilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  abilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 120,
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#6200ea',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  scoreDisplay: {
    minWidth: 80,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  baseScore: {
    fontSize: 16,
  },
  raceBonus: {
    fontSize: 14,
    color: 'green',
  },
  finalScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modifier: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#666',
    borderRadius: 5,
    padding: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  nextButton: {
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

export default AbilityScores;
