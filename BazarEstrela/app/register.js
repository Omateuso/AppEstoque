import { Text, View, TextInput, Pressable } from "react-native";
import { styles } from "../src/styles";
import { useState } from 'react';
import { useRouter } from "expo-router";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from "../src/firebase/firebase.config";

export default function Registro() {

    const [userMail, setUserMail] = useState('');
    const [userPass, setUserPass] = useState('');
    const [userRePass, setUserRePass] = useState('');
    const router = useRouter();

    function register() {
        if (userMail === '' || userPass === '' || userRePass === ''){
            alert('Todos os campos devem ser preenchidos !');
            return;
    }
        if (userPass !== userRePass){
            alert('As senhas não coincidem !');
            return;
    }  else{
        createUserWithEmailAndPassword(auth, userMail, userPass)
        .then((UserCredencial) => {
            const user = UserCredencial.user;
            alert('O usuário '+ userMail + ' foi criado com sucesso ! Faça o Login');
            router.replace('/');
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
            router.replace('/');
        });
    }
    }

    return(
    <View style={styles.container}>
        <Text style={styles.formTitle}>Novo Usuário</Text>
        <TextInput 
            style={styles.formInput}
            placeholder='E-mail de usuário'
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
            value={userMail}
            onChangeText={setUserMail}
        />
        
        <TextInput
            style={styles.formInput}
            placeholder='Digite a senha'
            autoCapitalize='none'
            secureTextEntry
            value={userPass}
            onChangeText={setUserPass}
        />

        <TextInput
            style={styles.formInput}
            placeholder='Repita a senha'
            autoCapitalize='none'
            secureTextEntry
            value={userRePass}
            onChangeText={setUserRePass}
        />
        <Pressable 
            style={styles.formButton}
            onPress={register}
        >
            <Text style={styles.textButton}>
                Registrar
            </Text>
        </Pressable>
        
        <Pressable 
                    onPress={() => router.push("/")}
                >
                    <Text style={styles.subTextButton}>Voltar</Text>
                </Pressable>
    </View>
    
    );
}