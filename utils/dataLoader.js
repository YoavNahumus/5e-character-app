import races from '../data/races.json';
import feats from '../data/feats.json';
import items from '../data/items.json';
import backgrounds from '../data/backgrounds.json';
import skillsData from '../data/skills.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to get race features
export const getRaceFeatures = (race) => {
  if (!race) return [];
  
  const features = [];
  
  if (race.entries) {
    features.push(...race.entries);
  }
  
  if (race.traitTags) {
    // Add trait names directly rather than as complex objects
    race.traitTags.forEach(trait => {
      features.push({
        name: trait,
        entries: [`${trait} trait`]
      });
    });
  }
  
  return features;
};

// Load races from the data file
export const loadRaces = () => {
  if (!races || !races.race) return [];
  
  return races.race
    .filter(race => 
      !race.hasOwnProperty('_copy') && 
      !race.hasOwnProperty('_version') &&
      race.name && 
      race.source
    )
    .map(race => ({
      ...race,
      displayName: race.name,
      features: getRaceFeatures(race),
      abilityScoreIncreases: race.ability ? race.ability.map(ability => {
        const increases = {};
        Object.entries(ability).forEach(([key, value]) => {
          if (key !== 'choose') increases[key] = value;
        });
        return increases;
      }) : [],
      size: Array.isArray(race.size) ? race.size[0] : race.size || 'M',
      speed: typeof race.speed === 'object' ? race.speed.walk : race.speed || 30,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
};

// Load feats with detailed information
export const loadFeats = () => {
  if (!feats) return [];
  
  return Object.values(feats)
    .filter(feat => !feat.hasOwnProperty('_copy'))
    .map(feat => ({
      ...feat,
      description: feat.entries ? feat.entries.join('\n') : '',
      prerequisites: feat.prerequisite ? feat.prerequisite.map(p => p.race || p.ability || p.spellcasting || p.other || '').join(', ') : ''
    }));
};

// Function to resolve class feature references and get actual feature content
export const resolveClassFeatures = (classFeatures, classFile) => {
  if (!classFeatures || !Array.isArray(classFeatures) || !classFile) return [];
  
  const resolvedFeatures = [];
  
  // Go through each feature reference
  classFeatures.forEach(featureRef => {
    if (typeof featureRef !== 'string') {
      // If it's not a reference string, just add it directly
      resolvedFeatures.push(featureRef);
      return;
    }
    
    // Parse the reference format: ClassName|ClassSource|Class Feature Name|Level
    const parts = featureRef.split('|');
    if (parts.length < 3) return;
    
    const featureName = parts[2];
    
    // Look for the feature in the classFeature array
    if (classFile.classFeature && Array.isArray(classFile.classFeature)) {
      const feature = classFile.classFeature.find(f => f.name === featureName);
      if (feature) {
        resolvedFeatures.push(feature);
      }
    }
  });
  
  return resolvedFeatures;
};

// Load class data with subclasses
export const loadClasses = async () => {
  try {
    // Try to load class index
    let classData = [];
    try {
      const classIndex = require('../data/class/index.json');
      
      // Load individual class files based on the index
      const classPromises = Object.entries(classIndex).map(async ([className, filePath]) => {
        try {
          // Ensure we have the correct file path format
          const fileName = filePath.endsWith('.json') ? filePath : `${filePath}.json`;
          
          // Use a safer approach to load class data without dynamic requires
          let classFile;
          
          // Handle each class file individually with static requires
          try {
            // Use conditional logic based on the filename
            if (fileName === 'class-fighter.json') {
              classFile = require('../data/class/class-fighter.json');
            } else if (fileName === 'class-wizard.json') {
              classFile = require('../data/class/class-wizard.json');
            } else if (fileName === 'class-bard.json') {
              classFile = require('../data/class/class-bard.json');
            } else if (fileName === 'class-cleric.json') {
              classFile = require('../data/class/class-cleric.json');
            } else if (fileName === 'class-druid.json') {
              classFile = require('../data/class/class-druid.json');
            } else if (fileName === 'class-monk.json') {
              classFile = require('../data/class/class-monk.json');
            } else if (fileName === 'class-paladin.json') {
              classFile = require('../data/class/class-paladin.json');
            } else if (fileName === 'class-ranger.json') {
              classFile = require('../data/class/class-ranger.json');
            } else if (fileName === 'class-rogue.json') {
              classFile = require('../data/class/class-rogue.json');
            } else if (fileName === 'class-sorcerer.json') {
              classFile = require('../data/class/class-sorcerer.json');
            } else if (fileName === 'class-warlock.json') {
              classFile = require('../data/class/class-warlock.json');
            } else if (fileName === 'class-barbarian.json') {
              classFile = require('../data/class/class-barbarian.json');
            } else if (fileName === 'class-artificer.json') {
              classFile = require('../data/class/class-artificer.json');
            } else {
              console.warn(`No static import available for ${fileName}`);
              return null;
            }
          } catch (importError) {
            console.warn(`Error importing class file ${fileName}:`, importError);
            return null;
          }
          
          // Make sure we have the actual class data from the structure
          if (classFile && classFile.class && classFile.class.length > 0) {
            const cls = classFile.class[0];
            if (!cls) {
              console.warn(`Class data structure invalid for ${className} in file ${fileName}`);
              return null;
            }
            
            // Resolve class features here
            const resolvedFeatures = resolveClassFeatures(cls.classFeatures, classFile);
            
            return {
              name: cls.name,
              source: cls.source || 'PHB',
              hd: cls.hd || { number: 1, faces: 8 },
              proficiency: cls.proficiency || [],
              spellcasting: cls.spellcasting,
              classFeatures: cls.classFeatures || [],
              features: resolvedFeatures, // Add the resolved features here
              fullClassFile: classFile, // Keep reference to entire class file for feature lookups
              subclasses: classFile.subclass || [],
              startingEquipment: cls.startingEquipment || {},
              multiclassing: cls.multiclassing || {}
            };
          }
          return null;
        } catch (error) {
          console.warn(`Could not load class file ${fileName}:`, error);
          return null;
        }
      });
      
      // Wait for all class data to be loaded
      const loadedClasses = await Promise.all(classPromises);
      classData = loadedClasses.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    } catch (e) {
      console.warn('Class index not found, trying individual class files:', e);
      // If no index, try to load individual class files directly
      try {
        const classFiles = [
          'class-fighter.json',
          'class-wizard.json',
          'class-cleric.json',
          'class-barbarian.json',
          'class-bard.json',
          'class-druid.json',
          'class-monk.json',
          'class-paladin.json',
          'class-ranger.json',
          'class-rogue.json',
          'class-sorcerer.json',
          'class-warlock.json'
        ];
        
        const classPromises = classFiles.map(async (fileName) => {
          try {
            let classFile;
            try {
              if (fileName === 'class-fighter.json') {
                classFile = require('../data/class/class-fighter.json');
              } else if (fileName === 'class-wizard.json') {
                classFile = require('../data/class/class-wizard.json');
              } else if (fileName === 'class-bard.json') {
                classFile = require('../data/class/class-bard.json');
              } else if (fileName === 'class-cleric.json') {
                classFile = require('../data/class/class-cleric.json');
              } else if (fileName === 'class-druid.json') {
                classFile = require('../data/class/class-druid.json');
              } else if (fileName === 'class-monk.json') {
                classFile = require('../data/class/class-monk.json');
              } else if (fileName === 'class-paladin.json') {
                classFile = require('../data/class/class-paladin.json');
              } else if (fileName === 'class-ranger.json') {
                classFile = require('../data/class/class-ranger.json');
              } else if (fileName === 'class-rogue.json') {
                classFile = require('../data/class/class-rogue.json');
              } else if (fileName === 'class-sorcerer.json') {
                classFile = require('../data/class/class-sorcerer.json');
              } else if (fileName === 'class-warlock.json') {
                classFile = require('../data/class/class-warlock.json');
              } else if (fileName === 'class-barbarian.json') {
                classFile = require('../data/class/class-barbarian.json');
              } else if (fileName === 'class-artificer.json') {
                classFile = require('../data/class/class-artificer.json');
              } else {
                console.warn(`No static import available for ${fileName}`);
                return null;
              }
            } catch (importError) {
              console.warn(`Error importing class file ${fileName}:`, importError);
              return null;
            }
            if (classFile && classFile.class && classFile.class.length > 0) {
              const cls = classFile.class[0];
              return {
                name: cls.name,
                source: cls.source || 'PHB',
                hd: cls.hd || { number: 1, faces: 8 },
                proficiency: cls.proficiency || [],
                spellcasting: cls.spellcasting,
                classFeatures: cls.classFeatures || [],
                subclasses: classFile.subclass || [],
                startingEquipment: cls.startingEquipment || {},
                multiclassing: cls.multiclassing || {}
              };
            }
            return null;
          } catch (error) {
            console.warn(`Could not load class file ${fileName}:`, error);
            return null;
          }
        });
        
        const loadedClasses = await Promise.all(classPromises);
        classData = loadedClasses.filter(Boolean);
      } catch (e2) {
        console.error('Failed to load class data:', e2);
      }
    }
    
    // Process class data
    return classData.map(cls => ({
      ...cls,
      features: cls.classFeatures || [],
      subclasses: cls.subclasses || [],
      spellcasting: cls.spellcasting,
      proficiencies: cls.proficiency || [],
      savingThrows: cls.proficiency ? 
        cls.proficiency.filter(p => p.save).map(p => p.save.toLowerCase()) : [],
      skillProficiencies: cls.proficiency && cls.proficiency.length > 0 ? 
        cls.proficiency.filter(p => p.skills).map(p => {
          return {
            choose: p.choose || 0,
            from: p.skills || []
          };
        }) : [],
      spellSlots: cls.spellcasting ? generateSpellSlots(cls.name) : null,
      sourceDisplay: cls.source && cls.source !== 'PHB' && cls.source !== 'XPHB' ? 
        `${cls.name} [${cls.source}]` : cls.name
    }));
  } catch (error) {
    console.error('Error loading classes:', error);
    return [];
  }
};

// Load spells with filtering capabilities
// Import spell data statically
import spellIndex from '../data/spells/index.json';
import phbSpells from '../data/spells/spells-phb.json';

export const loadSpells = async () => {
  try {
    let allSpells = [];
    
    // Try to use the statically imported spell index first
    try {
      allSpells = spellIndex;
    } catch (e) {
      console.warn('Spell index not found, trying individual spell files');
      // If no index, try to use the statically imported PHB spells
      try {
        if (phbSpells && phbSpells.spell) {
          allSpells = phbSpells.spell;
        }
      } catch (e2) {
        console.error('Failed to load spell data:', e2);
      }
    }
    
    return allSpells.map(spell => ({
      ...spell,
      description: spell.entries ? 
        (typeof spell.entries === 'string' ? spell.entries : spell.entries.join('\n')) : '',
      level: spell.level || 0,
      school: spell.school || '',
      castingTime: spell.time ? 
        `${spell.time[0].number} ${spell.time[0].unit}` : '1 action',
      range: spell.range ? 
        (spell.range.distance ? `${spell.range.distance.amount || ''} ${spell.range.distance.type || ''}` : spell.range) : '',
      components: spell.components ? 
        Object.keys(spell.components).join(', ') : '',
      duration: spell.duration ? 
        (spell.duration[0].concentration ? 'Concentration, ' : '') + 
        (spell.duration[0].type === 'timed' ? 
          `${spell.duration[0].duration.amount} ${spell.duration[0].duration.type}` : 
          spell.duration[0].type) : '',
    }));
  } catch (error) {
    console.error('Error loading spells:', error);
    return [];
  }
};

// Generate spell slots based on class
const generateSpellSlots = (className) => {
  // Standard spell slot progression for full casters
  const fullCasterSlots = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
  };
  
  // Half-caster progression (Paladin, Ranger)
  const halfCasterSlots = {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    20: [4, 3, 3, 3, 2, 0, 0, 0, 0]
  };
  
  // Third-caster progression (Eldritch Knight, Arcane Trickster)
  const thirdCasterSlots = {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    6: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    7: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    8: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    9: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    10: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    11: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    12: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    13: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    14: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    15: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    16: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    17: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    18: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    19: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    20: [4, 3, 3, 1, 0, 0, 0, 0, 0]
  };
  
  // Warlock progression
  const warlockSlots = {
    1: [1, 0, 0, 0, 0],
    2: [2, 0, 0, 0, 0],
    3: [0, 2, 0, 0, 0],
    4: [0, 2, 0, 0, 0],
    5: [0, 0, 2, 0, 0],
    6: [0, 0, 2, 0, 0],
    7: [0, 0, 0, 2, 0],
    8: [0, 0, 0, 2, 0],
    9: [0, 0, 0, 0, 2],
    10: [0, 0, 0, 0, 2],
    11: [0, 0, 0, 0, 3],
    12: [0, 0, 0, 0, 3],
    13: [0, 0, 0, 0, 3],
    14: [0, 0, 0, 0, 3],
    15: [0, 0, 0, 0, 3],
    16: [0, 0, 0, 0, 3],
    17: [0, 0, 0, 0, 4],
    18: [0, 0, 0, 0, 4],
    19: [0, 0, 0, 0, 4],
    20: [0, 0, 0, 0, 4]
  };
  
  const fullCasters = ['wizard', 'sorcerer', 'cleric', 'druid', 'bard'];
  const halfCasters = ['paladin', 'ranger', 'artificer'];
  const thirdCasters = ['eldritch knight', 'arcane trickster'];
  
  const normalizedClassName = className.toLowerCase();
  
  if (normalizedClassName === 'warlock') {
    return warlockSlots;
  } else if (fullCasters.some(c => normalizedClassName.includes(c))) {
    return fullCasterSlots;
  } else if (halfCasters.some(c => normalizedClassName.includes(c))) {
    return halfCasterSlots;
  } else if (thirdCasters.some(c => normalizedClassName.includes(c))) {
    return thirdCasterSlots;
  }
  
  // Default to no spell slots
  return {};
};

// Parse starting equipment from class/background
const parseStartingEquipment = (equipmentData) => {
  if (!equipmentData) return [];
  
  let equipment = [];
  
  // Process default items
  if (equipmentData.default) {
    equipment = equipmentData.default.map(item => {
      // Try to find the item in the items database
      const itemDetails = items.item?.find(i => 
        i.name && item && i.name.toLowerCase() === item.toLowerCase());
      
      return {
        name: item,
        quantity: 1,
        equipped: false,
        ...itemDetails
      };
    }).filter(Boolean);
  }
  
  return equipment;
};

// Load backgrounds
export const loadBackgrounds = () => {
  if (!backgrounds || !backgrounds.background) return [];
  
  return backgrounds.background
    .filter(bg => !bg.hasOwnProperty('_copy') && bg.name)
    .map(bg => ({
      ...bg,
      skills: bg.skillProficiencies ? bg.skillProficiencies.map(s => typeof s === 'string' ? s.toLowerCase() : s) : [],
      features: bg.entries ? bg.entries.filter(entry => entry.name) : [],
      equipment: bg.startingEquipment ? parseStartingEquipment(bg.startingEquipment) : [],
      description: bg.entries ? bg.entries.join('\n') : '',
      skillProficiencies: bg.skillProficiencies || [],
      toolProficiencies: bg.toolProficiencies || [],
      languages: bg.languageProficiencies || [],
      sourceDisplay: bg.source && bg.source !== 'PHB' && bg.source !== 'XPHB' ? 
        `${bg.name} [${bg.source}]` : bg.name
    }));
};

// Calculate ability score modifier
export const getAbilityModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

// Point buy system costs for D&D 5e
export const POINT_BUY_COSTS = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9
};

// Skills and equipment functions below

// Load D&D 5e skills
export const loadSkills = () => {
  if (!skillsData || !skillsData.skill) return [];
  
  // Get unique skills (preferring PHB over other sources)
  const uniqueSkills = {};
  
  skillsData.skill.forEach(skill => {
    const skillName = skill.name.toLowerCase();
    // If we don't have this skill yet or the current one is from PHB, use it
    if (!uniqueSkills[skillName] || skill.source === 'PHB') {
      uniqueSkills[skillName] = {
        name: skill.name,
        ability: skill.ability,
        description: skill.entries?.join('\n') || '',
        source: skill.source,
        sourceDisplay: skill.source && skill.source !== 'PHB' && skill.source !== 'XPHB' ? 
          `${skill.name} [${skill.source}]` : skill.name
      };
    }
  });
  
  return Object.values(uniqueSkills);
};

// Load starting equipment for a class
export const loadStartingEquipment = (className) => {
  if (!className) return [];
  
  try {
    // Use static imports based on class name
    let classFile;
    const lowerClassName = className.toLowerCase();
    
    try {
      if (lowerClassName === 'fighter') {
        classFile = require('../data/class/class-fighter.json');
      } else if (lowerClassName === 'wizard') {
        classFile = require('../data/class/class-wizard.json');
      } else if (lowerClassName === 'bard') {
        classFile = require('../data/class/class-bard.json');
      } else if (lowerClassName === 'cleric') {
        classFile = require('../data/class/class-cleric.json');
      } else if (lowerClassName === 'druid') {
        classFile = require('../data/class/class-druid.json');
      } else if (lowerClassName === 'monk') {
        classFile = require('../data/class/class-monk.json');
      } else if (lowerClassName === 'paladin') {
        classFile = require('../data/class/class-paladin.json');
      } else if (lowerClassName === 'ranger') {
        classFile = require('../data/class/class-ranger.json');
      } else if (lowerClassName === 'rogue') {
        classFile = require('../data/class/class-rogue.json');
      } else if (lowerClassName === 'sorcerer') {
        classFile = require('../data/class/class-sorcerer.json');
      } else if (lowerClassName === 'warlock') {
        classFile = require('../data/class/class-warlock.json');
      } else if (lowerClassName === 'barbarian') {
        classFile = require('../data/class/class-barbarian.json');
      } else if (lowerClassName === 'artificer') {
        classFile = require('../data/class/class-artificer.json');
      } else {
        console.warn(`No static import available for class ${lowerClassName}`);
        return [];
      }
    } catch (importError) {
      console.warn(`Error importing class file for ${lowerClassName}:`, importError);
      return [];
    }
    
    if (classFile && classFile.class && classFile.class.length > 0) {
      const cls = classFile.class[0];
      if (cls.startingEquipment) {
        return parseStartingEquipment(cls.startingEquipment);
      }
    }
    return [];
  } catch (error) {
    console.warn(`Could not load starting equipment for class ${className}:`, error);
    return [];
  }
};

// Character Storage Functions
const STORAGE_KEY_CHARACTERS = 'dnd5e_characters';

// Save a character to device storage
export const saveCharacter = async (character) => {
  try {
    // Get existing characters
    const existingCharactersJSON = await AsyncStorage.getItem(STORAGE_KEY_CHARACTERS);
    const existingCharacters = existingCharactersJSON ? JSON.parse(existingCharactersJSON) : [];
    
    // Check if this character already exists (by ID)
    const characterIndex = existingCharacters.findIndex(c => c.id === character.id);
    
    if (characterIndex >= 0) {
      // Update existing character
      existingCharacters[characterIndex] = character;
    } else {
      // Add new character with a unique ID if not provided
      if (!character.id) {
        character.id = Date.now().toString();
      }
      existingCharacters.push(character);
    }
    
    // Save updated characters list
    await AsyncStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(existingCharacters));
    return true;
  } catch (error) {
    console.error('Error saving character:', error);
    return false;
  }
};

// Load all characters from device storage
export const loadCharacters = async () => {
  try {
    const charactersJSON = await AsyncStorage.getItem(STORAGE_KEY_CHARACTERS);
    return charactersJSON ? JSON.parse(charactersJSON) : [];
  } catch (error) {
    console.error('Error loading characters:', error);
    return [];
  }
};

// Load a specific character by ID
export const loadCharacter = async (characterId) => {
  try {
    const characters = await loadCharacters();
    return characters.find(c => c.id === characterId) || null;
  } catch (error) {
    console.error('Error loading character:', error);
    return null;
  }
};

// Delete a character by ID
export const deleteCharacter = async (characterId) => {
  try {
    const characters = await loadCharacters();
    const updatedCharacters = characters.filter(c => c.id !== characterId);
    await AsyncStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(updatedCharacters));
    return true;
  } catch (error) {
    console.error('Error deleting character:', error);
    return false;
  }
};

// Update character order
export const updateCharacterOrder = async (characterIds) => {
  try {
    const characters = await loadCharacters();
    
    // Create a new ordered array based on the provided IDs
    const orderedCharacters = characterIds.map(id => 
      characters.find(c => c.id === id)
    ).filter(Boolean);
    
    // Add any characters that might not be in the ordered list
    characters.forEach(char => {
      if (!characterIds.includes(char.id)) {
        orderedCharacters.push(char);
      }
    });
    
    await AsyncStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(orderedCharacters));
    return true;
  } catch (error) {
    console.error('Error updating character order:', error);
    return false;
  }
};

// Total points available in standard point buy
export const STANDARD_POINT_BUY_TOTAL = 27;

// Calculate the current point buy total
export const calculatePointBuyTotal = (abilities) => {
  return Object.values(abilities).reduce((total, score) => {
    // Only count scores within the point buy range
    if (score >= 8 && score <= 15) {
      return total + (POINT_BUY_COSTS[score] || 0);
    }
    return total;
  }, 0);
};

// Calculate points remaining in point buy
export const calculatePointBuyRemaining = (abilities) => {
  const used = calculatePointBuyTotal(abilities);
  return STANDARD_POINT_BUY_TOTAL - used;
};

// Calculate Armor Class based on abilities and equipment
export const calculateArmorClass = (character) => {
  if (!character || !character.abilities) return 10;
  
  // Base AC calculation
  const dexMod = getAbilityModifier(character.abilities.dexterity || 10);
  
  // Start with unarmored AC (10 + DEX modifier)
  let ac = 10 + dexMod;
  
  // Check for armor from equipment
  if (character.equipment && character.equipment.length > 0) {
    const armor = character.equipment.find(item => 
      item.type === 'armor' && item.equipped);
    
    if (armor) {
      // Light armor: base + DEX
      if (armor.armorType === 'light') {
        ac = armor.ac + dexMod;
      }
      // Medium armor: base + DEX (max 2)
      else if (armor.armorType === 'medium') {
        ac = armor.ac + Math.min(dexMod, 2);
      }
      // Heavy armor: fixed value
      else if (armor.armorType === 'heavy') {
        ac = armor.ac;
      }
    }
    
    // Check for shield
    const shield = character.equipment.find(item => 
      item.type === 'shield' && item.equipped);
    if (shield) {
      ac += shield.ac || 2; // Default shield bonus is +2
    }
  }
  
  // Apply AC bonuses from features
  if (character.features) {
    const acFeatures = character.features.filter(feature => 
      feature.armorClassBonus && feature.active);
    
    acFeatures.forEach(feature => {
      if (typeof feature.armorClassBonus === 'number') {
        ac += feature.armorClassBonus;
      } else if (typeof feature.armorClassBonus === 'function') {
        ac += feature.armorClassBonus(character);
      }
    });
  }
  
  return ac;
};

// Calculate proficiency bonus based on level
export const getProficiencyBonus = (level) => {
  return Math.floor((level - 1) / 4) + 2;
};

// Calculate character level features
export const getClassFeaturesForLevel = (characterClass, level) => {
  if (!characterClass || !characterClass.features) return [];
  
  return characterClass.features.filter(feature => 
    feature.level <= level
  );
};

// Get available subclasses for a class
export const getSubclassesForClass = (characterClass) => {
  if (!characterClass || !characterClass.subclasses) return [];
  
  return characterClass.subclasses;
};

// Get subclass features for a level
export const getSubclassFeaturesForLevel = (subclass, level) => {
  if (!subclass || !subclass.subclassFeatures) return [];
  
  return subclass.subclassFeatures.filter(feature => 
    feature.level <= level
  );
};

// Calculate spell save DC
export const getSpellSaveDC = (character) => {
  if (!character.class || !character.class.spellcasting) return 0;
  
  const spellcastingAbility = character.class.spellcasting.ability;
  const abilityModifier = getAbilityModifier(character.abilities[spellcastingAbility]);
  const proficiencyBonus = getProficiencyBonus(character.level);
  
  return 8 + abilityModifier + proficiencyBonus;
};

// Calculate spell attack bonus
export const getSpellAttackBonus = (character) => {
  if (!character.class || !character.class.spellcasting) return 0;
  
  const spellcastingAbility = character.class.spellcasting.ability;
  const abilityModifier = getAbilityModifier(character.abilities[spellcastingAbility]);
  const proficiencyBonus = getProficiencyBonus(character.level);
  
  return abilityModifier + proficiencyBonus;
};
