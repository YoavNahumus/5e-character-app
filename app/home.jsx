import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../constants/Theme';
import { Colors } from '../constants/Colors';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem('characters').then((charactersString) => {
      setCharacters(charactersString ? JSON.parse(charactersString) : []);
    });
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>Your Characters</Text>
        {characters.map((char, index) => (
          <Link key={index} href={`/character/view?id=${char.id}`} asChild>
            <TouchableOpacity key={index} style={[styles.characterCard, { backgroundColor: Colors[theme].card }]}>
              <Text style={[styles.characterName, { color: Colors[theme].text }]}>{char.name}</Text>
              <Text style={[styles.characterInfo, { color: Colors[theme].text }]}>{char.race} - {char.class}</Text>
            </TouchableOpacity>
          </Link>
        ))}
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: Colors[theme].primary }]}
          onPress={() => {/* Handle create character */}}
        >
          <Text style={styles.buttonText}>Create New Character</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  characterCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterInfo: {
    fontSize: 14,
    marginTop: 5,
  },
  createButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
