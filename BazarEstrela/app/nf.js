import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'; // Para compartilhar o arquivo, se necessário

const GenerateInvoice = () => {
  const [clientName, setClientName] = useState('');
  const [clientCNPJ, setClientCNPJ] = useState('');
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

  const generatePDF = async () => {
    const html = `
      <h1>Nota Fiscal</h1>
      <p>Cliente: ${clientName}</p>
      <p>CNPJ: ${clientCNPJ}</p>
      <h2>Itens</h2>
      <ul>
        ${items.map(item => `<li>${item.name} - ${item.quantity} - R$ ${item.price.toFixed(2)}</li>`).join('')}
      </ul>
    `;

    try {
      // Gerar o PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Definir o caminho para a pasta Downloads
      const downloadsDir = `${FileSystem.documentDirectory}Downloads/`;
      const fileUri = `${downloadsDir}nota_fiscal.pdf`;

      // Criar a pasta Downloads se não existir
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });

      // Mover o PDF para a pasta Downloads
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      Alert.alert('Sucesso', `PDF gerado: ${fileUri}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF');
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome do Cliente"
        value={clientName}
        onChangeText={setClientName}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="CNPJ do Cliente"
        value={clientCNPJ}
        onChangeText={setClientCNPJ}
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
      <Pressable onPress={addItem} style={{ marginBottom: 10, backgroundColor: '#FF8C00', padding: 10 }}>
        <Text style={{ color: '#fff' }}>Adicionar Item</Text>
      </Pressable>

      <Pressable onPress={generatePDF} style={{ marginTop: 20, backgroundColor: '#28A745', padding: 10 }}>
        <Text style={{ color: '#fff' }}>Gerar Nota Fiscal</Text>
      </Pressable>
    </View>
  );
};

export default GenerateInvoice;
