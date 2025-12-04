// app/settings.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useUser } from '../src/api/UserContext';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#e50914', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 10, marginBottom: 15 },
  label: { color: '#bbb', marginBottom: 5, fontWeight: '600' },
  button: { padding: 12, borderRadius: 10, backgroundColor: '#e50914', alignItems: 'center', marginVertical: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  toggleButton: { padding: 12, borderRadius: 10, backgroundColor: '#555', alignItems: 'center', marginVertical: 10 },
});

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { user, setUser, toggleTheme, logout, theme } = useUser();
  const [name, setName] = useState(user.name);

  const saveName = async () => {
    if (!name.trim()) {
      Alert.alert('Nombre inválido', 'El nombre no puede estar vacío.');
      return;
    }
    await setUser({ name });
    Alert.alert('Guardado', 'Tu nombre se ha actualizado.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      {/* Nombre */}
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={saveName}>
        <Text style={styles.buttonText}>Guardar nombre</Text>
      </TouchableOpacity>

      {/* Cambiar tema */}
      <Text style={styles.label}>Tema actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={async () => await toggleTheme()}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
        </Text>
      </TouchableOpacity>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.button} onPress={async () => { await logout(); router.push('/login'); }}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;
