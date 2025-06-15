import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      const dados = await AsyncStorage.getItem('usuarioCadastrado');
      if (dados) {
        const { nome, email, telefone, foto } = JSON.parse(dados);
        setNome(nome);
        setEmail(email);
        setTelefone(telefone || '');
        setFoto(foto || null);
      }
    };
    carregarDados();
  }, []);

  const salvar = async () => {
    const usuarioAtualizado = { nome, email, telefone, foto };
    await AsyncStorage.setItem('usuarioCadastrado', JSON.stringify(usuarioAtualizado));
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const alterarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={alterarFoto}>
        <Image
          source={{ uri: foto || 'https://via.placeholder.com/100x100.png?text=Foto' }}
          style={styles.avatar}
        />
        <Text style={styles.trocarFoto}>Alterar Foto</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Telefone"
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity onPress={salvar} style={styles.botao}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  trocarFoto: {
    color: '#0066cc',
    marginVertical: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
