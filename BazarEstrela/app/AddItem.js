import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { styles } from '../src/styles/index';
import { useRouter } from 'expo-router';

export default function AddItem() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const router = useRouter();

  const handleAddItem = async () => {
    if (!itemName || !quantity) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
      return;
    }

    try {
      const storedItems = await AsyncStorage.getItem('@stock_items');
      const stockItems = storedItems ? JSON.parse(storedItems) : [];

      const newItem = { id: Date.now().toString(), name: itemName, quantity: parseInt(quantity) };
      const updatedStockItems = [...stockItems, newItem];

      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedStockItems)); // Armazena o novo estoque

      Alert.alert('Sucesso', `Item ${itemName} adicionado com quantidade de ${quantity}`);
      setItemName('');
      setQuantity('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Adicionar Novo Item</Text>
      <TextInput
        style={styles.formInput}
        placeholder="Nome do Item"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Pressable 
        style={styles.formButton}
        onPress={handleAddItem}
      >
        <Text style={styles.textButton}>Adicionar Item</Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push("/home")}
      >
        <Text style={styles.subTextButton}>Voltar</Text>
      </Pressable>
    </View>
  );
}
