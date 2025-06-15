import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    navigation.replace('Login');
  };

  useEffect(() => {
    const solicitarPermissao = async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Você não receberá notificações.');
        }
      } else {
        Alert.alert('Erro', 'Notificações funcionam apenas em dispositivos físicos.');
      }
    };

    solicitarPermissao();
  }, []);

  const enviarNotificacao = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🛍️ Novo produto disponível!',
        body: 'Confira os itens na lista agora mesmo!',
      },
      trigger: null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Home!</Text>

      <View style={styles.buttonsGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductList')}>
          <Text style={styles.buttonText}>Ver Produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.buttonText}>Abrir Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={enviarNotificacao}>
          <Text style={styles.buttonText}>Testar Notificação</Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileText}>Perfil</Text>
        </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginBottom: 80,
    textAlign: 'center',
    color: 'black',
  },
  buttonsGroup: {
    width: '100%',
    gap: 14,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
  },
  logoutButton: {
    marginTop: 80,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: '#d11a2a',
    alignItems: 'center',
    minWidth: 140,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
  },
  profileButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 16,
  },
  profileText: {
    color: '#000',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
  },

});