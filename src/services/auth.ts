import AsyncStorage from '@react-native-async-storage/async-storage';

type Usuario = {
  nome: string;
  email: string;
  senha: string;
};

export const mockLogin = async (
  email: string,
  senha: string
): Promise<{ sucesso: boolean; usuario?: Usuario; mensagem?: string }> => {
  const usuarioSalvo = await AsyncStorage.getItem('usuarioCadastrado');

  if (!usuarioSalvo) {
    return { sucesso: false, mensagem: 'Nenhum usuário cadastrado' };
  }

  const usuario: Usuario = JSON.parse(usuarioSalvo);

  if (usuario.email === email.trim() && usuario.senha === senha.trim()) {
    return { sucesso: true, usuario };
  }

  return { sucesso: false, mensagem: 'Credenciais inválidas' };
};
