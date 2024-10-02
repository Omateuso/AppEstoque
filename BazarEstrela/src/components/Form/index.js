import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function Form() {
    const [email, setEmail] = useState(''); // Adicionando estado para o e-mail
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log('E-mail:', email);
        console.log('Senha:', password);
    };

    return (
        <View style={styles.container}>
            <Text>E-mail</Text>
            <TextInput
                style={styles.input} // Adicionei o estilo para o campo de e-mail
                placeholder="Exemplo@gmail.com"
                keyboardType="email-address"
                value={email} // Valor controlado
                onChangeText={setEmail} // Captura o texto do e-mail
            />
            <Text>Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="**********"
                value={password}
                onChangeText={setPassword} // Corrigido de onChange para onChangeText
                secureTextEntry={true}
                keyboardType="default"
            />
            <Button title="Enviar" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});
