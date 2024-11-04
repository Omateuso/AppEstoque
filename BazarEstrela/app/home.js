import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import {auth} from '../src/firebase/firebase.config';

export default function Home() {
  const router = useRouter();

  const logout = () => {
    alert('Você foi deslogado!');
    router.push("//index");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{auth.currentUser ? auth.currentUser.email : 'Usuário Desconhecido'}</Text>

      <Text style={styles.title}>Bem-vindo ao Gerenciador de Estoque</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/ViewStock")} 
      >
        <Text style={styles.buttonText}>Visualizar Estoque</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/nf")}
      >
        <Text style={styles.buttonText}>Gerar Nota Fiscal</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.logoutButton]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    position: 'absolute', 
    top: 20,
    right: 20,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
