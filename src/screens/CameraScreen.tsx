import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';

import * as Sharing from 'expo-sharing';
import { Camera, CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Produto = {
  id: string;
  nome: string;
  preco: string;
  descricao: string;
  imagem: string;
};

export default function CameraScreen() {
  const cameraRef = useRef<Camera>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const foto: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
      setFotoUri(foto.uri);
    }
  };

  const compartilhar = async () => {
    if (!fotoUri) return;

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Compartilhamento não disponível');
      return;
    }

    await Sharing.shareAsync(fotoUri);
  };

  const salvarProduto = async () => {
    if (!nome || !preco || !descricao || !fotoUri) {
      Alert.alert('Preencha todos os campos e tire uma foto.');
      return;
    }

    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome,
      preco,
      descricao,
      imagem: fotoUri,
    };

    try {
      const produtosSalvos = await AsyncStorage.getItem('produtosUser');
      const lista = produtosSalvos ? JSON.parse(produtosSalvos) : [];
      lista.push(novoProduto);
      await AsyncStorage.setItem('produtosUser', JSON.stringify(lista));
      Alert.alert('Sucesso', 'Produto salvo com sucesso!');
      setNome('');
      setPreco('');
      setDescricao('');
      setFotoUri(null);
    } catch (e) {
      Alert.alert('Erro ao salvar produto');
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Carregando permissões...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Permissão para usar a câmera negada.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.botao}>
          <Text style={styles.botaoTexto}>Permitir</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {!fotoUri ? (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.back}
          />
          <View style={styles.controls}>
            <TouchableOpacity onPress={tirarFoto} style={styles.botao}>
              <Text style={styles.botaoTexto}>Tirar Foto</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.previewContainer}>
          <Image source={{ uri: fotoUri }} style={styles.preview} />

          <View style={styles.inputs}>
            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (ex: R$ 99,90)"
              value={preco}
              onChangeText={setPreco}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição do produto"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={compartilhar} style={styles.botao}>
              <Text style={styles.botaoTexto}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={salvarProduto} style={styles.botao}>
              <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFotoUri(null)} style={styles.botao}>
              <Text style={styles.botaoTexto}>Tirar Outra</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
  },
  controls: {
    backgroundColor: '#111',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  botao: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  botaoTexto: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 40,
  },
  preview: {
    width: '90%',
    height: 240,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 24,
    backgroundColor: '#eee',
  },
  inputs: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
