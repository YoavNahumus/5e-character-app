/**
 * Utility functions for character creation and management
 */

// Helper function to parse special tags in text
export const parseSpecialTags = (text) => {
  if (typeof text !== 'string') return '';
  
  // Replace damage tags: {@damage 2d6} → 2d6
  let parsed = text.replace(/\{@damage ([^}]+)\}/g, '$1');
  
  // Replace item tags: {@item Smith's tools|phb} → Smith's tools
  parsed = parsed.replace(/\{@item ([^|}]+)\|?[^}]*\}/g, '$1');
  
  // Replace spell tags: {@spell Fireball|phb} → Fireball
  parsed = parsed.replace(/\{@spell ([^|}]+)\|?[^}]*\}/g, '$1');
  
  // Replace dice tags: {@dice 1d6} → 1d6
  parsed = parsed.replace(/\{@dice ([^}]+)\}/g, '$1');
  
  // Replace variant rule tags
  parsed = parsed.replace(/\{@variantrule ([^|}]+)\|?[^}]*\}/g, '$1');
  
  // Replace feat tags
  parsed = parsed.replace(/\{@feat ([^|}]+)\|?[^}]*\}/g, '$1');
  
  // Replace action tags
  parsed = parsed.replace(/\{@action ([^|}]+)\|?[^}]*\}/g, '$1');
  
  // Replace 5etools tags
  parsed = parsed.replace(/\{@5etools ([^|}]+)\|?[^}]*\}/g, '$1');
  
  // Replace other potentially problematic tags
  parsed = parsed.replace(/\{@[a-z]+ ([^|}]+)\|?[^}]*\}/g, '$1');
  
  return parsed;
};

// Function to process feature content for display
export const processFeatureContent = (feature) => {
  // Default values
  let name = 'Feature';
  let entries = 'No description available';
  
  if (!feature) return { name, entries };
  
  // Extract name
  if (typeof feature.name === 'string') {
    name = feature.name;
  } else if (feature.title) {
    name = feature.title;
  }
  
  // Extract entries/content
  if (typeof feature.entries === 'string') {
    entries = parseSpecialTags(feature.entries);
  }
  // Handle entries as array
  else if (Array.isArray(feature.entries)) {
    entries = feature.entries.map(entry => {
      if (typeof entry === 'string') {
        return parseSpecialTags(entry);
      } else if (entry && typeof entry === 'object') {
        // Handle complex entries like tables or lists
        if (entry.type === 'list' && Array.isArray(entry.items)) {
          return entry.items.map((item, i) => 
            `${i+1}. ${parseSpecialTags(typeof item === 'string' ? item : JSON.stringify(item))}`
          ).join('\n');
        } else if (entry.type === 'table' && Array.isArray(entry.rows)) {
          // Simplify tables to text
          return 'Table: ' + (entry.caption || '') + '\n' + 
            entry.rows.map(row => Array.isArray(row) ? row.join(' | ') : '').join('\n');
        } else if (entry.type === 'entries' && entry.name) {
          return `${entry.name}`;
        } else if (entry.type === 'trait' && entry.name) {
          return entry.name; // Just return the name for traits
        } else {
          // Try to extract text content from other complex objects
          return parseSpecialTags(JSON.stringify(entry));
        }
      }
      return '';
    }).filter(Boolean).join('\n');
  }
  
  return { name, entries };
};

// Calculate ability modifier from score
export const getAbilityModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

// Generate a UUID for character IDs
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Process character data for storage
export const processCharacterForStorage = (character) => {
  // Create a clean version for storage
  const processedFeatures = character.features?.map(feature => {
    if (typeof feature === 'string') {
      return feature;
    }
    return {
      name: feature.name || 'Feature',
      description: typeof feature.entries === 'string' ? feature.entries : 
                  Array.isArray(feature.entries) ? feature.entries.join('\n') : 
                  'No description available'
    };
  }) || [];
  
  return {
    id: character.id || generateUUID(),
    name: character.name || 'Unnamed Character',
    race: character.race || '',
    class: character.class || '',
    background: character.background || '',
    abilities: character.abilities || {},
    skills: character.skills || [],
    features: processedFeatures,
    savingThrows: character.savingThrows || [],
    spellSlots: character.spellSlots || {},
    createdAt: new Date().toISOString()
  };
};
