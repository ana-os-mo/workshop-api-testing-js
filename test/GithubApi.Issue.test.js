const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const repository = 'protractor-workshop-2021';
const githubUserName = 'ana-os-mo';
let issue;

describe('GitHub Api POST-PATCH methods', () => {
  const title = 'My issue';
  const content = 'Body of my issue';

  it('Checking for public repos', async () => {
    const response = await agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(response.status).equal(statusCode.StatusCodes.OK);
    expect(response.body.public_repos).to.be.above(0);
  });

  it('Selecting repo', async () => {
    const reposList = await agent.get(`${urlBase}/users/${githubUserName}/repos`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(reposList.status).to.equal(statusCode.StatusCodes.OK);
    const repo = reposList.body.find((x) => x.name === repository);
    expect(repo).to.not.equal(undefined);
  });

  it('Creating issue', async () => {
    issue = await agent.post(`${urlBase}/repos/${githubUserName}/${repository}/issues`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send({ title });

    expect(issue.status).equal(statusCode.StatusCodes.CREATED);
    expect(issue.body.title).equal(title);
    expect(issue.body.body).to.equal(null);
  });

  it('Modifying issue', async () => {
    const issueNum = issue.body.number;

    const issueEdited = await agent.patch(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNum}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send({ body: content });

    expect(issueEdited.status).equal(statusCode.StatusCodes.OK);
    expect(issueEdited.body.title).equal(title);
    expect(issueEdited.body.body).equal(content);
  });
});
