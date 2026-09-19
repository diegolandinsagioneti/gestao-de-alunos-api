import { expect } from 'chai';
import { loginAluno } from '../helpers/loginAluno.js';

describe('Login do aluno', () => {

  it('Deve realizar o login do aluno e retornar um token', async () => {
    const token = await loginAluno(
      'julius@email.com',
      '123456'
    );

    expect(token).to.be.a('string');
    expect(token).to.not.be.empty;
  });

});