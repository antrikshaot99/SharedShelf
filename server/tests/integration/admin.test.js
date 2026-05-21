const request = require('supertest');
const createApp = require('../../app');

let app;

beforeAll(async () => {
  app = await createApp();
});

describe('Admin Integration Tests', () => {

  test('Normal user should NOT access users query', async () => {

    const response = await request(app)
      .post('/graphql')
      .set('Authorization', 'Bearer user-test-token')
      .send({
        query: `
          query {
            users {
              id
              name
            }
          }
        `
      });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message)
      .toBe('Admin access required');

  });

  test('Admin SHOULD access users query', async () => {

    const response = await request(app)
      .post('/graphql')
      .set('Authorization', 'Bearer admin-test-token')
      .send({
        query: `
          query {
            users {
              id
              name
            }
          }
        `
      });

    expect(response.body.data.users).toBeDefined();

  });

});

const { sequelize } = require('../../models');

afterAll(async () => {
  await sequelize.close();
});