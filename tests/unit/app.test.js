const request = require('supertest');
const app = require('../../src/app');

beforeEach(() => {
  app.resetTasks();
});

describe('API de Tarefas', () => {
  test('GET /api/tasks retorna lista vazia inicialmente', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/tasks cria uma nova tarefa', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Estudar pipeline de CI/CD' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ title: 'Estudar pipeline de CI/CD', done: false });
    expect(res.body.id).toBeDefined();
  });

  test('POST /api/tasks sem título retorna erro 400', async () => {
    const res = await request(app).post('/api/tasks').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/tasks com título vazio retorna erro 400', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });

    expect(res.statusCode).toBe(400);
  });

  test('PATCH /api/tasks/:id marca tarefa como concluída', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa X' });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ done: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  test('PATCH /api/tasks/:id com id inexistente retorna 404', async () => {
    const res = await request(app).patch('/api/tasks/9999').send({ done: true });

    expect(res.statusCode).toBe(404);
  });

  test('DELETE /api/tasks/:id remove uma tarefa', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'Tarefa Y' });

    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.statusCode).toBe(204);

    const list = await request(app).get('/api/tasks');
    expect(list.body).toEqual([]);
  });

  test('DELETE /api/tasks/:id com id inexistente retorna 404', async () => {
    const res = await request(app).delete('/api/tasks/9999');

    expect(res.statusCode).toBe(404);
  });
});