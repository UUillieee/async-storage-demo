import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StorageView() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [greeting, setGreeting] = React.useState('');
  const [name, setName] = React.useState('');
  const [greetingInfo, setGreetingInfo] = React.useState<{ greeting: string; name: string } | null>(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const values = await AsyncStorage.multiGet(['@counter', '@greeting']);
      values.forEach(([key, value]) => {
        if (key === '@counter') {
          const count = parseInt(value ?? '0');
          setCounter(isNaN(count) ? 0 : count);
        } else if (key === '@greeting') {
          if (value) {
            setGreetingInfo(JSON.parse(value));
          } else {
            setGreetingInfo(null);
          }
        }
      });
    } catch (e) {
      // handle error
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const incrementCounter = async () => {
    await AsyncStorage.setItem('@counter', (counter + 1).toString());
    setCounter(counter + 1);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const saveGreeting = async () => {
    const greetingToSave = {
      greeting: greeting,
      name: name,
    };

    await AsyncStorage.setItem('@greeting', JSON.stringify(greetingToSave));
    setGreetingInfo(greetingToSave);
  }

  return (
    <View style={styles.container}>
      <Text>Count: {counter}</Text>
      <Button title="Increment Count" onPress={incrementCounter} />
      <View style={styles.divider} />
      <Text>Greeting:</Text>
      <TextInput
        style={styles.input}
        placeholder="Greeting"
        value={greeting}
        onChangeText={setGreeting}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Save Greeting" onPress={saveGreeting} />
      <View style={styles.divider} />
      <Text>Saved Greeting:</Text>
      {greetingInfo ? (
        <Text>
          {greetingInfo.greeting} {greetingInfo.name}
        </Text>
      ) : (
        <Text>No greeting saved</Text>
      )}
      {/* <TextInput style={styles.input} onChangeText={setGreeting} placeholder="Greeting" value={greeting} />
      <TextInput style={styles.input} onChangeText={setName} placeholder="Name" value={name} />
      <Button title="Save Greeting" onPress={saveGreeting} /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  divider: {
    height: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    margin: 8,
    width: 200,
  },
});