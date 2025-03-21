import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import data loader
import { loadRaces, loadClasses, loadBackgrounds } from '../../utils/dataLoader';

// Import character utility functions
import {
  parseSpecialTags,
  processFeatureContent,
  getAbilityModifier,
  processCharacterForStorage
} from '../../utils/characterUtils';

// Import components
import RaceSelection from '../../components/character/RaceSelection';
import ClassSelection from '../../components/character/ClassSelection';
import BackgroundSelection from '../../components/character/BackgroundSelection';
import AbilityScores from '../../components/character/AbilityScores';
import CharacterSummary from '../../components/character/CharacterSummary';
import FeatureModal from '../../components/character/FeatureModal';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedTextInput } from '../../components/ThemedTextInput';

export default function NewCharacterScreen() {
  const router = useRouter();
  
  // State variables
  const [currentStep, setCurrentStep] = useState('name');
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    background: '',
    abilities: {},
    features: [],
    skills: []
  });
  
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  
  const [featureModalVisible, setFeatureModalVisible] = useState(false);
  const [featureModalContent, setFeatureModalContent] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  
  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const racesData = await loadRaces();
        const classesData = await loadClasses();
        const backgroundsData = await loadBackgrounds();
        
        setRaces(racesData);
        setClasses(classesData);
        setBackgrounds(backgroundsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Feature display functions
  const showRaceFeatures = (race) => {
    setSelectedRace(race);
    let features = [];
    
    if (race.features && Array.isArray(race.features)) {
      features = race.features.map(processFeatureContent);
    }
    
    setFeatureModalContent({
      title: race.name,
      content: features
    });
    setFeatureModalVisible(true);
  };
  
  const showClassFeatures = (charClass) => {
    setSelectedClass(charClass);
    let features = [];
    
    // Prioritize resolved features over references
    if (charClass.features && Array.isArray(charClass.features)) {
      features = charClass.features.map(processFeatureContent);
    } else if (charClass.fullClassFile && charClass.fullClassFile.classFeature) {
      // Try to get features from the full class file
      features = charClass.fullClassFile.classFeature
        .filter(feature => feature.className === charClass.name)
        .map(processFeatureContent);
    } else if (charClass.classFeatures && Array.isArray(charClass.classFeatures)) {
      // Last resort: use just the reference strings
      features = charClass.classFeatures.map(feature => {
        if (typeof feature === 'string') {
          const parts = feature.split('|');
          return { name: parts[2] || 'Feature', entries: [`Level ${parts[3] || '?'} feature`] };
        }
        return processFeatureContent(feature);
      });
    }
    
    setFeatureModalContent({
      title: charClass.name,
      content: features
    });
    setFeatureModalVisible(true);
  };
  
  const showBackgroundFeatures = (background) => {
    setSelectedBackground(background);
    let features = [];
    
    if (background.entries && Array.isArray(background.entries)) {
      features = background.entries
        .filter(entry => entry.name && entry.entries)
        .map(processFeatureContent);
    } else if (background.features && Array.isArray(background.features)) {
      features = background.features.map(processFeatureContent);
    }
    
    setFeatureModalContent({
      title: background.name,
      content: features
    });
    setFeatureModalVisible(true);
  };
  
  // Selection functions
  const selectRace = (race) => {
    // Extract ability bonuses
    const abilityBonuses = {};
    if (race.abilityScoreIncreases && race.abilityScoreIncreases.length > 0) {
      Object.entries(race.abilityScoreIncreases[0]).forEach(([ability, bonus]) => {
        abilityBonuses[ability.toLowerCase()] = bonus;
      });
    }
    
    // Update character with race information
    setCharacter({
      ...character,
      race: race.name,
      abilityBonuses: abilityBonuses,
      features: [...(character.features || []), ...(race.features || [])]
    });
    
    setCurrentStep('class');
  };
  
  const selectClass = (charClass) => {
    // Get saving throws from class
    const savingThrows = charClass.savingThrows || [];
    
    // Get spell slots if applicable
    const spellSlots = charClass.spellSlots || {};
    
    // Update character with class and its features
    setCharacter({
      ...character, 
      class: charClass.name,
      savingThrows,
      spellSlots,
      features: [...(character.features || []), ...(charClass.features?.filter(f => f.level === 1) || [])]
    });
    
    setCurrentStep('abilities');
  };
  
  const selectBackground = (background) => {
    // Extract skills from background
    let backgroundSkills = [];
    
    // Try to get skills from skillProficiencies first
    if (background.skillProficiencies) {
      if (Array.isArray(background.skillProficiencies)) {
        backgroundSkills = background.skillProficiencies.filter(s => typeof s === 'string');
      } else if (typeof background.skillProficiencies === 'object') {
        backgroundSkills = Object.keys(background.skillProficiencies)
          .filter(skill => background.skillProficiencies[skill] === true);
      }
    }
    // Fallback to skills array
    else if (Array.isArray(background.skills)) {
      backgroundSkills = background.skills.filter(s => typeof s === 'string');
    }
    
    // Update character with background information
    setCharacter({
      ...character,
      background: background.name,
      features: [...character.features, ...(background.features || [])],
      skills: [...character.skills, ...backgroundSkills]
    });
    
    setCurrentStep('summary');
  };
  
  // Save character to storage
  const saveCharacter = async () => {
    try {
      // Process character data for saving
      const processedCharacter = processCharacterForStorage(character);
      
      // Get existing characters
      const existingChars = await AsyncStorage.getItem('characters');
      const characters = existingChars ? JSON.parse(existingChars) : [];
      
      characters.push(processedCharacter);
      
      // Save back to storage
      await AsyncStorage.setItem('characters', JSON.stringify(characters));
      
      // Navigate to the character view page
      console.log('Character created successfully with ID:', processedCharacter.id);
      router.replace({pathname: '/character/view', params: { id: processedCharacter.id }});
    } catch (error) {
      console.error('Error saving character:', error);
      alert('Failed to save character: ' + error.message);
    }
  };
  
  // Render functions for each step
  const renderNameInput = () => (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.title}>Name Your Character</ThemedText>
      <ThemedTextInput
        style={styles.nameInput}
        placeholder="Enter character name"
        value={character.name}
        onChangeText={(text) => setCharacter({...character, name: text})}
      />
      <ThemedView style={styles.buttonContainer}>
        <ThemedView style={styles.spacer} />
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => setCurrentStep('race')}
        >
          <ThemedText style={styles.buttonText}>Next</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
  
  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'name':
        return renderNameInput();
      case 'race':
        return <RaceSelection 
                 races={races} 
                 selectRace={selectRace} 
                 showRaceFeatures={showRaceFeatures} 
               />;
      case 'class':
        return <ClassSelection 
                 classes={classes} 
                 selectClass={selectClass} 
                 showClassFeatures={showClassFeatures} 
               />;
      case 'abilities':
        return <AbilityScores 
                 character={character}
                 setCharacter={setCharacter}
                 goToNext={() => setCurrentStep('background')}
                 goBack={() => setCurrentStep('class')}
               />;
      case 'background':
        return <BackgroundSelection 
                 backgrounds={backgrounds}
                 selectBackground={selectBackground}
                 showBackgroundFeatures={showBackgroundFeatures}
               />;
      case 'summary':
        return <CharacterSummary 
                 character={character}
                 getAbilityModifier={getAbilityModifier}
                 saveCharacter={saveCharacter}
                 goBack={() => setCurrentStep('background')}
               />;
      default:
        return renderNameInput();
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {renderCurrentStep()}
      
      <FeatureModal
        visible={featureModalVisible}
        content={featureModalContent}
        onClose={() => setFeatureModalVisible(false)}
        parseSpecialTags={parseSpecialTags}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nameInput: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
    marginRight: 10,
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