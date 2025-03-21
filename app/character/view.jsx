import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAbilityModifier } from '../../utils/dataLoader';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedTouchableOpacity } from '../../components/ThemedTouchableOpacity';
import { ThemedScrollView } from '../../components/ThemedScrollView';

export default function ViewCharacter() {
  const params = useLocalSearchParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const charId = params.id;
        if (!charId) {
          console.error('No character ID provided');
          setLoading(false);
          return;
        }

        const storedChars = await AsyncStorage.getItem('characters');
        if (!storedChars) {
          console.error('No characters found in storage');
          setLoading(false);
          return;
        }

        const characters = JSON.parse(storedChars);
        const foundChar = characters.find(c => c.id === charId);
        
        if (foundChar) {
          setCharacter(foundChar);
        } else {
          console.error(`Character with ID ${charId} not found`);
        }
      } catch (error) {
        console.error('Error loading character:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [params.id]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Loading character...</ThemedText>
      </ThemedView>
    );
  }

  if (!character) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Character not found</ThemedText>
        <ThemedTouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <ThemedText style={styles.buttonText}>Return to Home</ThemedText>
        </ThemedTouchableOpacity>
      </ThemedView>
    );
  }

  // Calculate ability modifiers
  const abilityModifiers = {};
  if (character.abilities) {
    Object.entries(character.abilities).forEach(([ability, score]) => {
      abilityModifiers[ability] = getAbilityModifier(score);
    });
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedScrollView style={styles.ThemedScrollView}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={styles.characterName}>{character.name}</ThemedText>
          <ThemedView style={styles.subheader}>
            <ThemedText style={styles.detail}>{character.race} {character.class}</ThemedText>
            <ThemedText style={styles.detail}>Level {character.level}</ThemedText>
            <ThemedText style={styles.detail}>Background: {character.background}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ability Scores</ThemedText>
          <ThemedView style={styles.abilityScoresContainer}>
            {character.abilities && Object.entries(character.abilities).map(([ability, score]) => (
              <ThemedView key={ability} style={styles.abilityScore}>
                <ThemedText style={styles.abilityName}>{ability.slice(0, 3).toUpperCase()}</ThemedText>
                <ThemedText style={styles.abilityValue}>{score}</ThemedText>
                <ThemedText style={styles.abilityModifier}>
                  {abilityModifiers[ability] >= 0 ? `+${abilityModifiers[ability]}` : abilityModifiers[ability]}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Proficiency Bonus</ThemedText>
          <ThemedText style={styles.proficiencyBonus}>+{character.proficiencyBonus}</ThemedText>
        </ThemedView>

        {character.skills && character.skills.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Skills</ThemedText>
            <ThemedView style={styles.skillsContainer}>
              {character.skills.map((skill, index) => (
                <ThemedText key={index} style={styles.skill}>
                  {typeof skill === 'string' 
                    ? skill.charAt(0).toUpperCase() + skill.slice(1)
                    : ''}
                </ThemedText>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {character.features && character.features.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Features</ThemedText>
            {character.features.map((feature, index) => (
              <ThemedView key={index} style={styles.featureItem}>
                <ThemedText style={styles.featureName}>
                  {feature.name || 'Feature'}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {feature.description || feature.entries || ''}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        <ThemedTouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <ThemedText style={styles.buttonText}>Return to Home</ThemedText>
        </ThemedTouchableOpacity>
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  ThemedScrollView: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  abilityScoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  abilityScore: {
    width: '30%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  abilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  abilityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  abilityModifier: {
    fontSize: 16,
    color: '#666',
  },
  proficiencyBonus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
    color: '#006064',
  },
  featureItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  featureName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1976D2',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
