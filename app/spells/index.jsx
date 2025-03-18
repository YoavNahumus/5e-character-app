import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { loadSpells } from '../../utils/dataLoader';

export default function SpellList() {
  const [spells, setSpells] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    loadSpells().then(spellData => {
      setSpells(spellData);
      setFilteredSpells(spellData);
    });
  }, []);

  useEffect(() => {
    let filtered = spells;
    if (searchQuery) {
      filtered = filtered.filter(spell => 
        spell.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedLevel !== null) {
      filtered = filtered.filter(spell => spell.level === selectedLevel);
    }
    setFilteredSpells(filtered);
  }, [searchQuery, selectedLevel, spells]);

  const SpellCard = ({ spell }) => (
    <TouchableOpacity style={styles.spellCard}>
      <View style={styles.spellHeader}>
        <Text style={styles.spellName}>{spell.name}</Text>
        <Text style={styles.spellLevel}>Level {spell.level}</Text>
      </View>
      <Text style={styles.spellSchool}>{spell.school}</Text>
      <Text style={styles.spellDetails}>
        Casting Time: {spell.time[0].number} {spell.time[0].unit}
      </Text>
      <Text style={styles.spellDetails}>Range: {spell.range.distance.amount} {spell.range.distance.type}</Text>
      <Text style={styles.spellDescription}>{spell.entries[0]}</Text>
    </TouchableOpacity>
  );

  const LevelFilter = () => (
    <View style={styles.levelFilter}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
        <TouchableOpacity
          key={level}
          style={[
            styles.levelButton,
            selectedLevel === level && styles.selectedLevel
          ]}
          onPress={() => setSelectedLevel(selectedLevel === level ? null : level)}
        >
          <Text style={[
            styles.levelButtonText,
            selectedLevel === level && styles.selectedLevelText
          ]}>
            {level === 0 ? 'Cantrip' : level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search spells..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <LevelFilter />
      <FlatList
        data={filteredSpells}
        renderItem={({ item }) => <SpellCard spell={item} />}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={styles.spellList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  levelFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    minWidth: 40,
    alignItems: 'center',
  },
  selectedLevel: {
    backgroundColor: '#2196F3',
  },
  levelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedLevelText: {
    color: 'white',
  },
  spellList: {
    gap: 12,
  },
  spellCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spellName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spellLevel: {
    fontSize: 14,
    color: '#666',
  },
  spellSchool: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  spellDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  spellDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});
