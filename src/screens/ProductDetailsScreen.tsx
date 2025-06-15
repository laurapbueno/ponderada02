import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen({ route }: Props) {
  const { id, nome, preco, imagem } = route.params;

  const handleFavoritar = () => {
    Alert.alert('Favorito', `${nome} foi adicionado aos favoritos!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imagem }}
          style={styles.image}
        />
        <TouchableOpacity style={styles.heartIcon} onPress={handleFavoritar}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{nome}</Text>
      <Text style={styles.preco}>{preco}</Text>
      <Text style={styles.id}>ID do produto: {id}</Text>

      <Text style={styles.description}>
        Este é um produto de excelente qualidade, ideal para quem busca custo-benefício e praticidade. Aproveite agora e garanta o seu!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  heartIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  preco: {
    fontSize: 20,
    fontFamily: 'Inter',
    color: '#444',
    marginBottom: 4,
    textAlign: 'left',
  },
  id: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#888',
    marginBottom: 20,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
});
