// auth.service.js
const UserService = require('../user/user.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class AuthService {
  static async login(credentials) {
    const { email, password } = credentials;

    // Buscar usuário pelo email
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');

    // Verificar a senha
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) throw new Error('Senha inválida');

    // Gerar token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1000h' });
    return token;
  }
}

module.exports = AuthService;
