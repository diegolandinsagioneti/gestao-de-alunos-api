import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import fs from 'fs';
import app from '../src/app.js';

const dadosLoginInvalido = JSON.parse(
  fs.readFileSync('./test/data/loginInvalido.json', 'utf-8')
);

describe('POST /api/auth/login', () => {
  after(async () => {
    await mongoose.connection.close();
  });

  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@escola.com',
        senha: 'admin123'
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  dadosLoginInvalido.forEach((dados) => {

    it(dados.testTitle, async () => {
      const resposta = await request(app)
        .post('/api/auth/login')
        .send({
          email: dados.email,
          senha: dados.senha
        });

      expect(resposta.status).to.equal(401);
      expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
    });

  });
});