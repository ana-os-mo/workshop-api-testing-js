const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const chaiSubset = require('chai-subset');

const { expect } = chai;

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';

const promiseContent = `const myPromise = new Promise((resolve, reject) => {
                          setTimeout(() => {
                            resolve('foo');
                          }, 300);
                        });
  
                        myPromise
                          .then(handleResolvedA, handleRejectedA)
                          .then(handleResolvedB, handleRejectedB)
                          .then(handleResolvedC, handleRejectedC);
                        `;

describe('GitHub Api DELETE method', () => {
  const gistParams = {
    description: 'Gist promise example',
    files: {
      'my_promise.js': {
        content: promiseContent
      }
    },
    public: true
  };

  let gist;
  let noExist;

  it('Creating gist and checking its existence', async () => {
    const response = await agent.post(`${urlBase}/gists`)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN)
      .send(gistParams);

    gist = response.body;
    expect(response.status).equals(statusCode.StatusCodes.CREATED);
    expect(gist).containSubset({
      description: gistParams.description,
      public: gistParams.public
    });
    expect(gist.files['my_promise.js']).containSubset({
      filename: 'my_promise.js',
      content: gistParams.files['my_promise.js'].content
    });
    const gistUrl = await agent.get(gist.url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(gistUrl.status).to.equal(statusCode.StatusCodes.OK);
  });

  it('Deleting gist', async () => {
    const responseDel = await agent.delete(`${gist.url}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    expect(responseDel.status).to.equal(statusCode.StatusCodes.NO_CONTENT);

    try {
      await agent.get(gist.url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    } catch (response) { noExist = response; }

    expect(noExist.status).to.equal(statusCode.StatusCodes.NOT_FOUND);
  });
});
