import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faker } from '@faker-js/faker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Produto = {
  id: string;
  nome: string;
  preco: string;
  descricao?: string;
  imagem: string;
};

const TOTAL_ITEMS = 10000;
const PAGE_SIZE = 20;

const gerarProduto = (): Produto => ({
  id: faker.string.uuid(),
  nome: faker.commerce.productName(),
  preco: `R$ ${faker.commerce.price({ min: 10, max: 1000, dec: 2, symbol: '' }).replace('.', ',')}`,
  descricao: faker.commerce.productDescription(),
  imagem: faker.image.urlPicsumPhotos(),
});

const gerarProdutos = (quantidade: number): Produto[] => {
  return Array.from({ length: quantidade }, gerarProduto);
};

const produtosMockados = gerarProdutos(TOTAL_ITEMS);

export default function ProductListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [mostrarAdicionados, setMostrarAdicionados] = useState(false);
  const [adicionados, setAdicionados] = useState<Produto[]>([]);

  const carregarMais = () => {
    if (carregando || mostrarFavoritos || mostrarAdicionados) return;

    setCarregando(true);
    setTimeout(() => {
      const inicio = (pagina - 1) * PAGE_SIZE;
      const fim = inicio + PAGE_SIZE;
      const novos = produtosMockados.slice(inicio, fim);

      setProdutos((prev) => [...prev, ...novos]);
      setPagina((prev) => prev + 1);
      setCarregando(false);
    }, 500);
  };

  const carregarAdicionados = async () => {
    const data = await AsyncStorage.getItem('produtosUser');
    if (data) {
      try {
        const json: Produto[] = JSON.parse(data);
        setAdicionados(json.reverse());
      } catch (e) {
        console.error('Erro ao carregar produtos adicionados');
      }
    } else {
      setAdicionados([]);
    }
  };

  useEffect(() => {
    carregarMais();
    carregarAdicionados();
  }, []);

  useEffect(() => {
    if (mostrarAdicionados) {
      carregarAdicionados();
    }
  }, [mostrarAdicionados]);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const novoSet = new Set(prev);
      novoSet.has(id) ? novoSet.delete(id) : novoSet.add(id);
      return novoSet;
    });
  };

  let produtosFiltrados = produtos;

  if (mostrarFavoritos) {
    produtosFiltrados = produtos.filter((p) => favoritos.has(p.id));
  } else if (mostrarAdicionados) {
    produtosFiltrados = adicionados;
  }

  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.content}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            imagem: item.imagem,
          })
        }
      >
        <Image source={{ uri: item.imagem }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.preco}>{item.preco}</Text>
          {item.descricao && (
            <Text style={styles.descricao} numberOfLines={2}>
              {item.descricao}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
        <Ionicons
          name={favoritos.has(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color={favoritos.has(item.id) ? 'red' : '#999'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtroContainer}>
        <TouchableOpacity
          style={[styles.filtroBotao, !mostrarFavoritos && !mostrarAdicionados && styles.filtroBotaoAtivo]}
          onPress={() => {
            setMostrarFavoritos(false);
            setMostrarAdicionados(false);
          }}
        >
          <Text style={[styles.filtroTexto, !mostrarFavoritos && !mostrarAdicionados && styles.filtroTextoAtivo]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroBotao, mostrarFavoritos && styles.filtroBotaoAtivo]}
          onPress={() => {
            setMostrarFavoritos(true);
            setMostrarAdicionados(false);
          }}
        >
          <Text style={[styles.filtroTexto, mostrarFavoritos && styles.filtroTextoAtivo]}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroBotao, mostrarAdicionados && styles.filtroBotaoAtivo]}
          onPress={() => {
            setMostrarAdicionados(true);
            setMostrarFavoritos(false);
          }}
        >
          <Text style={[styles.filtroTexto, mostrarAdicionados && styles.filtroTextoAtivo]}>Adicionados</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListFooterComponent={
          !mostrarFavoritos && !mostrarAdicionados && carregando ? (
            <ActivityIndicator size="large" color="black" />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
  },
  filtroBotao: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  filtroBotaoAtivo: {
    backgroundColor: 'black',
  },
  filtroTexto: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: 'black',
  },
  filtroTextoAtivo: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#f2f2f2',
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#111',
    marginBottom: 4,
  },
  preco: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 2,
  },
  descricao: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Inter',
  },
});
