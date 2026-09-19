import request from 'supertest';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import fs from 'fs';

import { loginAdmin } from '../helpers/loginAdmin.js';
import { loginAluno } from '../helpers/loginAluno.js';

dotenv.config();

const dadosAlunos = JSON.parse(
  fs.readFileSync('./test/data/alunos.json', 'utf-8')
);

describe('Fluxo completo - Gestão de Alunos', () => {

  it('Deve cadastrar um aluno e registrar um trabalho', async () => {

    const dados = dadosAlunos[0];

    // Login do administrador
    const tokenAdmin = await loginAdmin();

    expect(tokenAdmin).to.be.a('string');
    expect(tokenAdmin).to.not.be.empty;

    // Dados do aluno
    const emailAluno = faker.internet.email();
    const matriculaAluno = faker.string.numeric(8);

    // Cadastro do aluno
    const responseAluno = await request(process.env.BASE_URL)
      .post('/admin/alunos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nome: dados.nome,
        email: emailAluno,
        matricula: matriculaAluno,
        senha: dados.senha
      });

    expect(responseAluno.status).to.equal(201);
    expect(responseAluno.body).to.have.property('id');

    const alunoId = responseAluno.body.id;

    // Matrícula do aluno na disciplina
    const responseMatricula = await request(process.env.BASE_URL)
      .post(`/admin/disciplinas/${dados.disciplinaId}/matriculas`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        alunoId: alunoId
      });

    expect(responseMatricula.status).to.equal(201);

    // Login do aluno
    const tokenAluno = await loginAluno(emailAluno, dados.senha);

    expect(tokenAluno).to.be.a('string');
    expect(tokenAluno).to.not.be.empty;

    // Cadastro do trabalho
    const responseTrabalho = await request(process.env.BASE_URL)
      .post(`/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send({
        disciplinaId: dados.disciplinaId,
        titulo: dados.tituloTrabalho,
        descricao: dados.descricaoTrabalho
      });

    expect(responseTrabalho.status).to.equal(201);
    expect(responseTrabalho.body).to.have.property('id');
    expect(responseTrabalho.body.titulo).to.equal(dados.tituloTrabalho);
    expect(responseTrabalho.body.disciplinaId).to.equal(dados.disciplinaId);

  });

});