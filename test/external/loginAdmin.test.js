import { expect } from 'chai';
import { loginAdmin } from '../helpers/loginAdmin.js';

describe('Login do administrador', () => {

  it('Deve realizar o login do administrador e retornar um token', async () => {
    const token = await loginAdmin();

    expect(token).to.be.a('string');
    expect(token).to.not.be.empty;
  });

});