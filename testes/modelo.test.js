const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de resposta', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual a capital da França?');
  const idResposta = modelo.cadastrar_resposta(idPergunta, 'Paris');

  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Paris');
  expect(respostas[0].id_resposta).toBe(idResposta);
});

test('Testando obter pergunta por ID', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual a cor do céu?');

  const pergunta = modelo.get_pergunta(idPergunta);
  expect(pergunta).toBeDefined();
  expect(pergunta.texto).toBe('Qual a cor do céu?');
  expect(pergunta.id_pergunta).toBe(idPergunta);
});

test('Testando obter respostas para uma pergunta', () => {
  const idPergunta = modelo.cadastrar_pergunta('Quanto é 2 + 2?');
  modelo.cadastrar_resposta(idPergunta, '4');
  modelo.cadastrar_resposta(idPergunta, 'Quatro');

  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('4');
  expect(respostas[1].texto).toBe('Quatro');
});