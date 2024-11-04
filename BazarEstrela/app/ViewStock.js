import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles } from '../src/styles/index';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export default function ViewStock() {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [stockItems, setStockItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        loadStockItems(uid); 
        console.log('User ID carregado:', uid);
      } else {
        console.log('Usuário não está autenticado');
        setUserId(null);
      }
    });
  
    return () => unsubscribe();
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
  
      const newItem = { 
        id: Date.now().toString(), 
        name: itemName, 
        quantity: parseInt(quantity), 
        userId,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        purchaseDate: purchaseDate ? purchaseDate : null
      };
  
      if (existingItemIndex !== -1) {
        const updatedStockItems = [...stockItems];
        updatedStockItems[existingItemIndex].quantity += parseInt(quantity);
        await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedStockItems));
        Alert.alert('Sucesso', `Quantidade de ${itemName} aumentada em ${quantity}`);
        setStockItems(updatedStockItems);
      } else {
        const updatedStockItems = [...stockItems, newItem];
        await AsyncStorage.setItem('@stock_items', JSON.stringify(updatedStockItems));
        Alert.alert('Sucesso', `Item ${itemName} adicionado com quantidade de ${quantity}`);
        setStockItems(updatedStockItems);
      }
  
      // Recarrega os itens após a adição
      loadStockItems(userId); // Recarrega os itens para garantir que está exibindo os corretos
  
      // Limpa os campos e fecha o formulário
      setItemName('');
      setQuantity('');
      setPurchasePrice('');
      setSalePrice('');
      setPurchaseDate('');
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
        const userItems = allItems.filter(item => item.userId === userId); // Filtrando corretamente pelos itens do usuário
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

  const generateJsonFile = async () => {
    try {
      // Cria uma cópia dos itens, excluindo o ID e formatando preços
      const itemsWithoutId = stockItems.map(({ id, purchasePrice, salePrice, ...item }) => ({
        ...item,
        purchasePrice: purchasePrice !== null ? `R$ ${purchasePrice.toFixed(2)}` : null,
        salePrice: salePrice !== null ? `R$ ${salePrice.toFixed(2)}` : null,
      }));

      const jsonString = JSON.stringify(itemsWithoutId, null, 2);
      const fileUri = FileSystem.documentDirectory + 'stock_items.json';
      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o arquivo JSON');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Estoque Atual</Text>

      <Pressable 
        style={styles.formButton}
        onPress={() => router.push('/home')} // Navega para a página inicial
      >
        <Text style={styles.textButton}>Voltar à Página Inicial</Text>
      </Pressable>

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

          <TextInput
            style={styles.formInput}
            placeholder="Preço de Compra (R$)"
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.formInput}
            placeholder="Preço de Venda (R$)"
            value={salePrice}
            onChangeText={setSalePrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.formInput}
            placeholder="Data da Compra (opcional)"
            value={purchaseDate}
            onChangeText={setPurchaseDate}
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
            <Text>Preço de Compra: {item.purchasePrice ? item.purchasePrice : 'N/A'}</Text>
            <Text>Preço de Venda: {item.salePrice ? item.salePrice : 'N/A'}</Text>
            <Text>Data da Compra: {item.purchaseDate || 'N/A'}</Text>

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
        onPress={generateJsonFile}
      >
        <Text style={styles.textButton}>Gerar JSON</Text>
      </Pressable>
    </View>
  );
}