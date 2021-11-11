const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const md5 = require('md5');
const chaiSubset = require('chai-subset');
const chai = require('chai');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repository = 'jasmine-awesome-report';
let repo;

describe('GitHub Api GET methods', () => {
  it('Validating repos owner data', async () => {
    const name = 'Alejandro Perdomo';
    const company = 'Perficient Latam';
    const location = 'Colombia';

    const response = await agent.get(`${urlBase}/users/${githubUserName}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.name).equal(name);
    expect(response.body.company).equal(company);
    expect(response.body.location).equal(location);
  });

  it('Getting specific repo', async () => {
    const response = await agent.get(`${urlBase}/users/${githubUserName}`)
      .set('User-Agent', 'agent');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    const urlRepos = response.body.repos_url;
    // console.log(urlRepos);
    const reposListResponse = await agent.get(`${urlRepos}`)
      .set('User-Agent', 'agent');

    expect(reposListResponse.status).to.equal(statusCode.StatusCodes.OK);
    repo = reposListResponse.body.find((x) => x.name === repository);
  });

  it('Validating repo data', async () => {
    const fullName = 'aperdomob/jasmine-awesome-report';
    const isPrivate = false;
    const description = 'An awesome html report for Jasmine';
    expect(repo.full_name).equal(fullName);
    expect(repo.private).equal(isPrivate);
    expect(repo.description).equal(description);
  });

  it('Download repo and checksum', async () => {
    // url de descarga: https://github.com/aperdomob/jasmine-awesome-report/archive/refs/heads/master.zip
    const repoDownload = await agent.get(`${repo.svn_url}/archive/refs/heads/${repo.default_branch}.zip`)
      .set('User-Agent', 'agent');

    // md5 checksum del archivo: correr en la consola: md5sum /directorio/del/archivo/zip
    // conociendo su valor puedo compararlo con el obtenido de la descarga
    const zipChecksum = 'e19fa3d2166fd379d4d8ebc983e0a4cc';

    expect(repoDownload.status).to.equal(statusCode.StatusCodes.OK);
    // obtener checksum de la descarga y comparar con la conocida
    expect(md5(repoDownload.body)).equal(zipChecksum);
  });

  // download_url: 'https://raw.githubusercontent.com/aperdomob/jasmine-awesome-report/master/README.md',
  it('Find, download, checksum README.md', async () => {
    const repoReadme = await agent.get(`${repo.url}/contents`)
      .set('User-Agent', 'agent');
    expect(repoReadme.status).to.equal(statusCode.StatusCodes.OK);
    const readmeMeta = repoReadme.body.find((x) => x.name === 'README.md');

    expect(readmeMeta).containSubset({
      name: 'README.md',
      path: 'README.md',
      sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
    });

    const readmeUrl = readmeMeta.download_url;
    const readmeChecksum = '97ee7616a991aa6535f24053957596b1';

    const downloadReadme = await agent.get(`${readmeUrl}`)
      .set('User-Agent', 'agent');

    expect(md5(downloadReadme.text)).equal(readmeChecksum);
  });
});
