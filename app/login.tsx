import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../src/api/UserContext';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    await login(name, email);
    router.push('/peliculas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} placeholderTextColor="#888"/>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#888"/>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'#0d0d0d' },
  title: { fontSize:26, fontWeight:'bold', color:'#e50914', marginBottom:20 },
  input: { width:'100%', backgroundColor:'#1a1a1a', padding:10, borderRadius:10, marginBottom:15, color:'#fff' },
  button: { backgroundColor:'#e50914', padding:12, borderRadius:10, width:'100%', alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'bold', fontSize:16 }
});

export default LoginScreen;
