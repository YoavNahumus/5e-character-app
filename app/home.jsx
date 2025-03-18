import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('characters').then((charactersString) => {
      setCharacters(charactersString ? JSON.parse(charactersString) : []);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>D&D 5E Character Manager</Text>
      <ScrollView style={styles.content}>
        {characters.map((char, index) => (
          <Link key={index} href={`/character/view?id=${char.id}`} asChild>
            <TouchableOpacity key={index} style={styles.characterCard}>
              <Text style={styles.characterName}>{char.name}</Text>
              <Text style={styles.characterInfo}>{char.race} - {char.class}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
      <Link href="/character/new" asChild>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.buttonText}>Create New Character</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'white',
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
    color: '#666',
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
