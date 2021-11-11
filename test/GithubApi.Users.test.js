const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');

const { expect } = chai;

const urlBase = 'https://api.github.com';

describe('With query parameters', () => {
  it('List default users', async () => {
    const response = await agent.get(`${urlBase}/users`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    const users = Object.entries(response.body).length;
    expect(users).equals(30);
  });

  it('List 10 users', async () => {
    const numUsrs = 10;
    const query = { per_page: numUsrs };

    const response = await agent.get(`${urlBase}/users`)
      .set('User-Agent', 'agent')
      .query(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    const users = Object.entries(response.body).length;
    expect(users).equals(numUsrs);
  });

  it('List 50 users', async () => {
    const numUsrs = 50;
    const query = { per_page: numUsrs };

    const response = await agent.get(`${urlBase}/users`)
      .set('User-Agent', 'agent')
      .query(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    const users = Object.entries(response.body).length;
    expect(users).equals(numUsrs);
  });
});
