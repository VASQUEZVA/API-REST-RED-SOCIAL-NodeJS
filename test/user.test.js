const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { register } = require('../controllers/user');

describe('Controlador de registro de usuario', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('debería registrar un usuario exitosamente', async () => {
    const req = {
      body: {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'password123',
        nick: 'juanito',
      },
    };
    const res = createMockRes();

    mockingoose(User).toReturn([], 'find');
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');
    mockingoose(User).toReturn({
      _id: '507f1f77bcf86cd799439011',
      name: 'Juan',
      email: 'juan@example.com',
      nick: 'juanito',
      password: 'hashedPassword123',
    }, 'save');

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      message: 'Usuario registrado correctamente',
      user: expect.objectContaining({
        name: 'Juan',
        email: 'juan@example.com',
        nick: 'juanito',
      }),
    }));
  });

  it('debería retornar error si faltan datos', async () => {
    const req = {
      body: {
        name: '',
        email: '',
        password: '',
        nick: '',
      },
    };
    const res = createMockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Faltan datos por enviar',
      status: 'error',
    }));
  });

  it('debería retornar error si el usuario ya existe', async () => {
    const req = {
      body: {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'password123',
        nick: 'juanito',
      },
    };
    const res = createMockRes();

    mockingoose(User).toReturn([
      {
        _id: '507f1f77bcf86cd799439011',
        email: 'juan@example.com',
        nick: 'juanito',
      },
    ], 'find');

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      message: 'El usuario ya existe',
    }));
  });
});
