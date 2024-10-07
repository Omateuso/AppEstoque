import { StatusBar } from 'react-native-web';
import { useState, React } from 'react';
import { Pressable, Text, TextInput, View, Image } from 'react-native';
import {styles} from '../src/styles/index';
import {auth} from '../src/firebase/firebase.config';
import {signInWithEmailAndPassword} from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function App() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const router = useRouter();

  function replacePass() {
    router.replace('/replacePass');
  }

  function register() {
    router.replace('/register');
  }

  function userLogin() {
    signInWithEmailAndPassword(auth, userMail, userPass)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Senha ou E-mail inválidos'); 
      })
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../src/imagens/template.png')} 
        style={styles.image}
      />
      <Text style={styles.formTitle}>Faça Login:</Text>
      <Text style={styles.loginTitle}>Email:</Text>
      <TextInput style={styles.formInput}
      placeholder='email@exemplo.com'
      keyboardType='email-address'
      autoCapitalize='none'
      autoComplete='email'
      value={userMail}
      onChangeText={setUserMail}
      />
      <Text style={styles.loginTitle}>Senha:</Text>
      <TextInput style={styles.formInput}
      placeholder='********'
      autoCapitalize='none'
      secureTextEntry
      value={userPass}
      onChangeText={setUserPass}
      />
      <Pressable style={styles.formButton}
      onPress={userLogin}>
        <Text style={styles.textButton}>Logar</Text>
      </Pressable>
      <View style={styles.subContainer}>
        <Pressable style={styles.subButton}>
          <Text style={styles.subTextButton }
          onPress={replacePass}>Esqueci a senha</Text>
        </Pressable>
        <Pressable style={styles.subButton}>
          <Text style={styles.subTextButton}
          onPress={register}>Registrar</Text>
        </Pressable>
      </View>
      <StatusBar style="auto"/>
    </View>
  ) 
};