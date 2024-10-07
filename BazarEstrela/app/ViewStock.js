import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { styles } from '../src/styles/index';
import { useRouter } from 'expo-router';

export default function ViewStock() {
  const [stockItems, setStockItems] = useState([]); // Estado para armazenar os itens de estoque
  const router = useRouter();

  // Função para carregar os dados de estoque do AsyncStorage
  const loadStockItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('@stock_items');
      if (storedItems !== null) {
        setStockItems(JSON.parse(storedItems)); // Converte os dados salvos em um array
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os itens de estoque');
    }
  };

  // Função para diminuir a quantidade do item
  const decreaseQuantity = async (id) => {
    try {
      const updatedItems = stockItems.map(item => {
        if (item.id === id) {
          if (item.quantity > 0) {
            return { ...item, quantity: item.quantity - 1 }; // Diminui a quantidade
          } else {
            Alert.alert('Aviso', 'A quantidade não pode ser inferior a 0');
            return item; // Mantém a quantidade mínima de 1
          }
        }
        return item;
      });

      setStockItems(updatedItems); // Atualiza o estado com a nova quantidade

      // Atualiza o AsyncStorage com a lista modificada
      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedItems));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade');
    }
  };

  // Função para aumentar a quantidade do item
  const increaseQuantity = async (id) => {
    try {
      const updatedItems = stockItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 }; // Aumenta a quantidade
        }
        return item;
      });

      setStockItems(updatedItems); // Atualiza o estado com a nova quantidade

      // Atualiza o AsyncStorage com a lista modificada
      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedItems));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aumentar a quantidade');
    }
  };

  // Função para remover o item do estoque
  const removeItem = async (id) => {
    try {
      const updatedItems = stockItems.filter(item => item.id !== id); // Remove o item com o id correspondente
      setStockItems(updatedItems); // Atualiza o estado com a lista filtrada

      // Atualiza o AsyncStorage com a lista modificada
      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedItems));

      Alert.alert('Sucesso', 'Item removido com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o item');
    }
  };

  // Carrega os itens de estoque assim que o componente é montado
  useEffect(() => {
    loadStockItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Estoque Atual</Text>

      {/* FlatList para renderizar a lista de itens de estoque */}
      <FlatList
        data={stockItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>Quantidade: {item.quantity}</Text>

            <View style={{ flexDirection: 'row' }}>
              {/* Botão para diminuir a quantidade */}
              <Pressable 
                style={styles.altButton}
                onPress={() => decreaseQuantity(item.id)} // Função de diminuir quantidade
              >
                <Text style={styles.textButton}>-</Text>
              </Pressable>

              {/* Botão para aumentar a quantidade */}
              <Pressable 
                style={styles.altButton}
                onPress={() => increaseQuantity(item.id)} // Função de aumentar quantidade
              >
                <Text style={styles.textButton}>+</Text>
              </Pressable>

              {/* Botão para remover o item */}
              <Pressable 
                style={[styles.altButton, { backgroundColor: 'red' }]} // Muda a cor do botão para vermelho
                onPress={() => removeItem(item.id)} // Função para remover o item
              >
                <Image
                        source={require('../src/imagens/Lixeira.png')} 
                        style={styles.icone}>

                </Image>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Botão para voltar à página inicial */}
      <Pressable 
        style={styles.formButton}
        onPress={() => router.push("/home")} 
      >
        <Text style={styles.textButton}>Voltar</Text>
      </Pressable>
    </View>
  );
}
