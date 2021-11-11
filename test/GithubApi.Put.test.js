const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('GitHub Api PUT methods', () => {
  it('Follow gitHub user', async () => {
    const response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(statusCode.StatusCodes.NO_CONTENT);
    expect(response.body).is.empty; // eslint-disable-line no-unused-expressions
  });

  it('Verify user following', async () => {
    const response = await agent.get(`${urlBase}/user/following`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    const user = response.body.find((x) => x.login === githubUserName);
    // console.log(user); // si el usuario no existe -> undefined
    expect(user).to.not.equal(undefined);
  });

  it('Check idempotency', async () => {
    const response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(statusCode.StatusCodes.NO_CONTENT);
    expect(response.body).is.empty; // eslint-disable-line no-unused-expressions

    const responseIdem = await agent.get(`${urlBase}/user/following`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(responseIdem.status).to.equal(statusCode.StatusCodes.OK);
    const user = responseIdem.body.find((x) => x.login === githubUserName);
    expect(user).to.not.equal(undefined);
  });
});
