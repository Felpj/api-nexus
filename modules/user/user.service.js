// user.service.js
const User = require('./user.model');
const bcrypt = require('bcrypt');

class UserService {
  // Criar novo usuário
  static async createUser(data) {
    const { name, email, password } = data;

    // Verificar se o email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('Email já está em uso');

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  // Obter usuário por ID
  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  // Atualizar usuário
  static async updateUser(id, data) {
    await User.update(data, { where: { id } });
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    return updatedUser;
  }

  // Obter usuário por email
  static async getUserByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}

module.exports = UserService;
