import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAbilityModifier } from '../../utils/dataLoader';

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
      <View style={styles.container}>
        <Text style={styles.title}>Loading character...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Character not found</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.characterName}>{character.name}</Text>
          <View style={styles.subheader}>
            <Text style={styles.detail}>{character.race} {character.class}</Text>
            <Text style={styles.detail}>Level {character.level}</Text>
            <Text style={styles.detail}>Background: {character.background}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ability Scores</Text>
          <View style={styles.abilityScoresContainer}>
            {character.abilities && Object.entries(character.abilities).map(([ability, score]) => (
              <View key={ability} style={styles.abilityScore}>
                <Text style={styles.abilityName}>{ability.slice(0, 3).toUpperCase()}</Text>
                <Text style={styles.abilityValue}>{score}</Text>
                <Text style={styles.abilityModifier}>
                  {abilityModifiers[ability] >= 0 ? `+${abilityModifiers[ability]}` : abilityModifiers[ability]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proficiency Bonus</Text>
          <Text style={styles.proficiencyBonus}>+{character.proficiencyBonus}</Text>
        </View>

        {character.skills && character.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {character.skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {typeof skill === 'string' 
                    ? skill.charAt(0).toUpperCase() + skill.slice(1)
                    : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {character.features && character.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {character.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureName}>
                  {feature.name || 'Feature'}
                </Text>
                <Text style={styles.featureDescription}>
                  {feature.description || feature.entries || ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subheader: {
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
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
    color: '#222',
  },
  abilityScoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  abilityScore: {
    width: '30%',
    padding: 12,
    backgroundColor: '#eee',
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
    backgroundColor: '#e0f2f1',
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
    backgroundColor: '#fff',
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
    color: '#555',
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
