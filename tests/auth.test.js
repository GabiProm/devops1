jest.setTimeout(10000);

const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');

const testUser = {
  name: `Henry Test ${Date.now()}`,
  email: `henry${Date.now()}@example.com`,
  password: '12345678'
};

let token = '';

describe.only('Auth API', () => {
  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('token');
  });

  it('debería loguear al usuario registrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('token');

    token = res.body.token; // guardar token para la siguiente prueba
  });

  it('debería acceder a la ruta protegida /api/profile con token válido', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario.email).toBe(testUser.email);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
