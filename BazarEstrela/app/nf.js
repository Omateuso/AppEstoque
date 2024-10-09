import React, { useState } from 'react'; 
import { View, TextInput, Text, Pressable, Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { styles } from "../src/styles";
import { useRouter } from "expo-router";

const GenerateInvoice = () => {
  const router = useRouter();
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
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
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

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
            <Pressable onPress={addItem} style={{ backgroundColor: '#FF8C00', padding: 10, width: '80%' }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Adicionar Item</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
              <Pressable onPress={generatePDF} style={{ backgroundColor: '#28A745', padding: 10, width: '80%', alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>Gerar Nota Fiscal</Text>
              </Pressable>
            </View>

        </View>

        <Pressable 
                    onPress={() => router.push("/home")}
                >
                    <Text style={styles.subTextButton}>Voltar</Text>
                </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GenerateInvoice;
