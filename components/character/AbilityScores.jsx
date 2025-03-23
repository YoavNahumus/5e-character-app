import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const baseAbilities = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8
};
const basePoints = 27;

/**
 * Component for setting ability scores
 */
const AbilityScores = ({ character, setCharacter, goToNext, goBack }) => {
  const [availablePoints, setAvailablePoints] = useState(basePoints);
  const [unlockPoints, setUnlockPoints] = useState(false);
  const [abilities, setAbilities] = useState(baseAbilities);

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
    if (!unlockPoints && (newScore < 8 || newScore > 15)) return;
    
    // Calculate point cost
    const pointCost = change > 0 ? getPointCost(currentScore) : getPointCost(currentScore - 1) * -1;
    
    // Check if enough points available
    if (!unlockPoints && availablePoints - pointCost < 0) return;
    
    // Update state
    setAbilities({
      ...abilities,
      [ability]: newScore
    });
    
    setAvailablePoints(availablePoints - pointCost);
  };

  const changePointLock = () => {
    if (unlockPoints) {
      setAbilities(baseAbilities);
      setAvailablePoints(basePoints);
    }
    setUnlockPoints(!unlockPoints);
  }

  // Handle finalization of ability scores
  const finalizeAbilityScores = () => {
    // Update character with final ability scores
    setCharacter({
      ...character,
      abilities: abilities
    });
    
    // Move to next step
    goToNext();
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Set Ability Scores</Text>
      <Text style={styles.subtitle}>
        Points remaining: {availablePoints}
      </Text>
      <TouchableOpacity
        style={{...styles.controlButton, width: 200}}
        onPress={() => {changePointLock()}}
      >
        <Text style={styles.controlButtonText}>
          {unlockPoints ? "Lock Points" : "Unlock Points"}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.abilityContainer}>
        {Object.entries(abilities).map(([ability, score]) => {
          const modifier = getAbilityModifier(score);
          const modifierDisplay = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          
          return (
            <View key={ability} style={styles.abilityRow}>
              <Text style={styles.abilityName}>
                {ability.charAt(0).toUpperCase() + ability.slice(1)}
              </Text>
              
              <View style={styles.scoreControls}>
                <TouchableOpacity
                  style={[styles.controlButton, !unlockPoints && abilities[ability] <= 8 && styles.disabledButton]}
                  onPress={() => updateAbility(ability, -1)}
                  disabled={!unlockPoints && abilities[ability] <= 8}
                >
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.scoreDisplay}>
                  <Text style={styles.baseScore}>{score}</Text>
                  <Text style={styles.modifier}>{modifierDisplay}</Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.controlButton, (!unlockPoints && (abilities[ability] >= 15 || availablePoints < getPointCost(abilities[ability]))) && styles.disabledButton]}
                  onPress={() => updateAbility(ability, 1)}
                  disabled={!unlockPoints && (abilities[ability] >= 15 || availablePoints < getPointCost(abilities[ability]))}
                >
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={finalizeAbilityScores}
        >
          <Text style={styles.buttonText}>Next</Text>
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
