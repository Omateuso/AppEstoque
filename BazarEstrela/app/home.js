import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from "expo-router"; // Usar para navegação entre telas

export default function Home() {
  const router = useRouter();

  const logout = () => {
    // Função de logout, pode ser usada para limpar as credenciais do usuário
    alert('Você foi deslogado!');
    router.push("//index"); // Redireciona para a tela de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Gerenciador de Estoque</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/ViewStock")} // Navegar para a tela de visualização de estoque
      >
        <Text style={styles.buttonText}>Visualizar Estoque</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/nf")} // Navegar para a tela de visualização de estoque
      >
        <Text style={styles.buttonText}>Gerar Nota Fiscal</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.logoutButton]}
        onPress={logout} // Função de logout
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
});
