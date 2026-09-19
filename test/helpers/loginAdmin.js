import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

export async function loginAdmin() {
  const response = await request(process.env.BASE_URL)
    .post('/auth/login')
    .send({
      email: 'admin@escola.com',
      senha: 'admin123'
    });

  return response.body.token;
}