import { StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { ThemedTouchableOpacity } from '../components/ThemedTouchableOpacity';
import { ThemedScrollView } from '../components/ThemedScrollView';

export default function Home() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('characters').then((charactersString) => {
      setCharacters(charactersString ? JSON.parse(charactersString) : []);
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>D&D 5E Character Manager</ThemedText>
      <ThemedScrollView style={styles.content}>
        {characters.map((char, index) => (
          <Link key={index} href={`/character/view?id=${char.id}`} asChild>
            <ThemedTouchableOpacity key={index} style={styles.characterCard}>
              <ThemedText style={styles.characterName}>{char.name}</ThemedText>
              <ThemedText style={styles.characterInfo}>{char.race} - {char.class}</ThemedText>
            </ThemedTouchableOpacity>
          </Link>
        ))}
      </ThemedScrollView>
      <Link href="/character/new" asChild>
        <TouchableOpacity style={styles.createButton}>
          <ThemedText style={styles.buttonText}>Create New Character</ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  characterCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
