import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { styles } from '../src/styles/index';
import { useRouter } from 'expo-router';

export default function ViewStock() {
  const [itemName, setItemName] = useState(''); // Estado para armazenar o nome do item
  const [quantity, setQuantity] = useState(''); // Estado para armazenar a quantidade do item
  const [stockItems, setStockItems] = useState([]); // Estado para armazenar os itens de estoque
  const [showForm, setShowForm] = useState(false); // Estado para controlar a exibição do formulário
  const router = useRouter();

  // Função para adicionar novos itens ao estoque
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
      setShowForm(false); // Esconde o formulário após adicionar o item
      setStockItems(updatedStockItems); // Atualiza a lista de itens no estado
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item');
    }
  };

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
      console.log(`Removendo item com id: ${id}`); // Log para depuração
      const updatedItems = stockItems.filter(item => item.id !== id); // Remove o item
      console.log(`Itens após remoção: ${JSON.stringify(updatedItems)}`); // Log para verificar os itens
  
      setStockItems(updatedItems); // Atualiza o estado
  
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

      {/* Botão para mostrar o formulário de adicionar item */}
      {!showForm && (
        <Pressable 
          style={styles.iconeButton}
          onPress={() => setShowForm(true)} // Mostra o formulário ao clicar
        >
          <Image
                  source={require('../src/imagens/AdicionarItem.png')} 
                  style={styles.icone}
                />
        </Pressable>
      )}

      {/* Formulário de adicionar item (exibido apenas quando showForm for true) */}
      {showForm && (
        <View style={{ marginBottom: 20 }}>
          {/* Botão "X" para fechar o formulário */}
          <Pressable 
            style={{ alignSelf: 'flex-end', padding: 5 }} // Alinha o "X" no canto
            onPress={() => setShowForm(false)} // Esconde o formulário ao clicar
          >
            <Text style={{ fontSize: 20, color: 'red' }}>X</Text>
          </Pressable>

          {/* Campo para inserir nome do item */}
          <TextInput
            style={styles.formInput}
            placeholder="Nome do Item"
            value={itemName}
            onChangeText={setItemName}
          />

          {/* Campo para inserir quantidade do item */}
          <TextInput
            style={styles.formInput}
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          {/* Botão para adicionar o item */}
          <Pressable 
            style={styles.iconeButton}
            onPress={handleAddItem} // Função para adicionar o item
          >
            <Image
                  source={require('../src/imagens/Salvar.png')} 
                  style={styles.icone}
                />
          </Pressable>
        </View>
      )}

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
                style={styles.iconeButton}
                onPress={() => decreaseQuantity(item.id)} // Função de diminuir quantidade
              >
                <Text style={styles.textButton}>-</Text>
              </Pressable>

              {/* Botão para aumentar a quantidade */}
              <Pressable 
                style={styles.iconeButton}
                onPress={() => increaseQuantity(item.id)} // Função de aumentar quantidade
              >
                <Text style={styles.textButton}>+</Text>
              </Pressable>

              {/* Botão para remover o item */}
              <Pressable 
                style={[styles.iconeButton, { backgroundColor: 'red' }]} // Muda a cor do botão para vermelho
                onPress={() => removeItem(item.id)} // Função para remover o item
              >
                <Image
                  source={require('../src/imagens/Lixeira.png')} 
                  style={styles.icone}
                />
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
