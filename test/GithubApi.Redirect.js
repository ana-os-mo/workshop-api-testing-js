const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');

const { expect } = chai;

const urlBase = 'https://github.com';
const githubUserName = 'aperdomob';

describe('GitHub Api HEAD method', () => {
  let check;
  it('Checking page code status', async () => {
    try {
      await agent.head(`${urlBase}/${githubUserName}/redirect-test`);
    } catch (response) {
      check = response;
    }

    expect(check.status).to.equal(statusCode.StatusCodes.MOVED_PERMANENTLY);
    expect(check.response.headers.location).to.equal(`${urlBase}/${githubUserName}/new-redirect-test`);
  });

  it('Redirecting requests', async () => {
    const response = await agent.get(`${urlBase}/${githubUserName}/redirect-test`)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
  });
});
