import React, { useState } from 'react'; 
import { View, TextInput, Text, Pressable, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const GenerateInvoice = () => {
  const [emitenteNome, setEmitenteNome] = useState('');
  const [emitenteEndereco, setEmitenteEndereco] = useState('');
  const [emitenteCNPJ, setEmitenteCNPJ] = useState('');
  const [destinatarioNome, setDestinatarioNome] = useState('');
  const [destinatarioEndereco, setDestinatarioEndereco] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (!itemName || !itemQuantity || !itemPrice) {
      Alert.alert('Erro', 'Preencha todos os campos do item');
      return;
    }

    const newItem = {
      name: itemName,
      quantity: parseInt(itemQuantity),
      price: parseFloat(itemPrice),
    };

    setItems([...items, newItem]);
    setItemName('');
    setItemQuantity('');
    setItemPrice('');
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const generatePDF = async () => {
    const totalPrice = calculateTotalPrice();
    const html = `
      <h1>Nota Fiscal</h1>
      <h2>Emitente</h2>
      <p>Nome: ${emitenteNome}</p>
      <p>Endereço: ${emitenteEndereco}</p>
      <h2>Destinatário</h2>
      <p>Nome: ${destinatarioNome}</p>
      <p>Endereço: ${destinatarioEndereco}</p>
      <h2>Itens</h2>
      <ul>
        ${items.map(item => `<li>${item.name} - ${item.quantity} - R$ ${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      <h2>Total</h2>
      <p>R$ ${totalPrice}</p>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      const downloadsDirectory = `${FileSystem.documentDirectory}downloads/`;
      const fileUri = `${downloadsDirectory}nota_fiscal.pdf`;

      await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      await Sharing.shareAsync(fileUri);
      
      Alert.alert('Sucesso', `PDF gerado e aberto: ${fileUri}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, padding: 20 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Nome do Emitente"
          value={emitenteNome}
          onChangeText={setEmitenteNome}
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />
        <TextInput
          placeholder="Endereço do Emitente"
          value={emitenteEndereco}
          onChangeText={setEmitenteEndereco}
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />

<TextInput
          placeholder="CNPJ"
          value={emitenteCNPJ}
          onChangeText={setEmitenteCNPJ}
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />

        <TextInput
          placeholder="Nome do Destinatário"
          value={destinatarioNome}
          onChangeText={setDestinatarioNome}
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />
        <TextInput
          placeholder="Endereço do Destinatário"
          value={destinatarioEndereco}
          onChangeText={setDestinatarioEndereco}
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />
        <TextInput
          placeholder="Nome do Item"
          value={itemName}
          onChangeText={setItemName}
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />
        <TextInput
          placeholder="Quantidade"
          value={itemQuantity}
          onChangeText={setItemQuantity}
          keyboardType="numeric"
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />
        <TextInput
          placeholder="Preço"
          value={itemPrice}
          onChangeText={setItemPrice}
          keyboardType="numeric"
          style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
        />
        
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text>{item.name} - {item.quantity} - R$ {item.price.toFixed(2)}</Text>
          )}
        />

        <Pressable onPress={addItem} style={{ marginBottom: 10, backgroundColor: '#FF8C00', padding: 10 }}>
          <Text style={{ color: '#fff' }}>Adicionar Item</Text>
        </Pressable>

        <Pressable onPress={generatePDF} style={{ marginTop: 0, backgroundColor: '#28A745', padding: 10 }}>
          <Text style={{ color: '#fff' }}>Gerar Nota Fiscal</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GenerateInvoice;
