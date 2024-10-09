import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles } from '../src/styles/index';
import { useRouter } from 'expo-router';

export default function ViewStock() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stockItems, setStockItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('@user_id'); // Carrega o ID do usuário
      setUserId(id);
      loadStockItems(id); // Carrega os itens do estoque filtrados pelo usuário
    };
    
    loadUserId();
  }, []);

  const handleAddItem = async () => {
    if (!itemName || !quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos com valores válidos');
      return;
    }

    try {
      const storedItems = await AsyncStorage.getItem('@stock_items');
      const stockItems = storedItems ? JSON.parse(storedItems) : [];

      const existingItemIndex = stockItems.findIndex(item => 
        item.name.toLowerCase() === itemName.toLowerCase() && item.userId === userId
      );

      if (existingItemIndex !== -1) {
        // Item já existe, apenas aumenta a quantidade
        const updatedStockItems = [...stockItems];
        updatedStockItems[existingItemIndex].quantity += parseInt(quantity);
        await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedStockItems));

        Alert.alert('Sucesso', `Quantidade de ${itemName} aumentada em ${quantity}`);
        setStockItems(updatedStockItems);
      } else {
        // Item não existe, adiciona um novo
        const newItem = { id: Date.now().toString(), name: itemName, quantity: parseInt(quantity), userId };
        const updatedStockItems = [...stockItems, newItem];
        await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedStockItems));

        Alert.alert('Sucesso', `Item ${itemName} adicionado com quantidade de ${quantity}`);
        setStockItems(updatedStockItems);
      }

      // Limpa os campos e fecha o formulário
      setItemName('');
      setQuantity('');
      setShowForm(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o item');
    }
  };

  const loadStockItems = async (userId) => {
    try {
      const storedItems = await AsyncStorage.getItem('@stock_items');
      if (storedItems !== null) {
        const allItems = JSON.parse(storedItems);
        // Filtra os itens de estoque para mostrar apenas os do usuário logado
        const userItems = allItems.filter(item => item.userId === userId);
        setStockItems(userItems);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os itens de estoque');
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      const updatedItems = stockItems.map(item => {
        if (item.id === id) {
          if (item.quantity > 0) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            Alert.alert('Aviso', 'A quantidade não pode ser inferior a 0');
            return item;
          }
        }
        return item;
      });

      setStockItems(updatedItems);
      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedItems));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade');
    }
  };

  const increaseQuantity = async (id) => {
    try {
      const updatedItems = stockItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      setStockItems(updatedItems);
      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedItems));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aumentar a quantidade');
    }
  };

  const removeItem = async (id) => {
    try {
      const updatedItems = stockItems.filter(item => item.id !== id);
      setStockItems(updatedItems);
      await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedItems));
      Alert.alert('Sucesso', 'Item removido com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Estoque Atual</Text>

      {!showForm && (
        <Pressable 
          style={styles.iconeButton}
          onPress={() => setShowForm(true)}
        >
          <Image source={require('../src/imagens/AdicionarItem.png')} style={styles.icone} />
        </Pressable>
      )}

      {showForm && (
        <View style={{ marginBottom: 20 }}>
          <Pressable 
            style={{ alignSelf: 'flex-end', padding: 5 }}
            onPress={() => setShowForm(false)}
          >
            <Text style={{ fontSize: 20, color: 'red' }}>X</Text>
          </Pressable>

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
            style={styles.iconeButton}
            onPress={handleAddItem}
          >
            <Image source={require('../src/imagens/Salvar.png')} style={styles.icone} />
          </Pressable>
        </View>
      )}

      <FlatList
        data={stockItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>Quantidade: {item.quantity}</Text>

            <View style={{ flexDirection: 'row' }}>
              <Pressable 
                style={styles.iconeButton}
                onPress={() => decreaseQuantity(item.id)} 
                disabled={item.quantity <= 0} // Desabilita se a quantidade for zero
              >
                <Text style={styles.textButton}>-</Text>
              </Pressable>

              <Pressable 
                style={styles.iconeButton}
                onPress={() => increaseQuantity(item.id)}
              >
                <Text style={styles.textButton}>+</Text>
              </Pressable>

              <Pressable 
                style={[styles.iconeButton, { backgroundColor: 'red' }]}
                onPress={() => removeItem(item.id)}
              >
                <Image source={require('../src/imagens/Lixeira.png')} style={styles.icone} />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable 
        style={styles.formButton}
        onPress={() => router.push("/home")} 
      >
        <Text style={styles.textButton}>Voltar</Text>
      </Pressable>
    </View>
  );
}
