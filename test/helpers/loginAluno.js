import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

export async function loginAluno(email, senha) {
  const response = await request(process.env.BASE_URL)
    .post('/auth/login')
    .send({
      email: email,
      senha: senha
    });

  return response.body.token;
}