const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    // respuestas esperadas como tester
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };
    // deberia fallar porque espero la url con Medellin pero es otra
    // const url = "https://httpbin.org/get?name=John&age=31&city=Medellin";

    const response = await agent.get('https://httpbin.org/get').query(query);
    // console.log(response.body);
    // to.equal(respuesta esperada)
    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.args).to.eql(query);
    // expect(response.body.url, 'url incorrecta').to.equal(url);
    // falla porque el body no tiene la propiedad goku
    // expect(response.body, 'propiedad no existe').to.have.property('goku');
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/headers');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body).to.not.have.property('args');
    // expect(response.body).to.be.empty;
  });

  it('Consume PATCH Service with query parameters', async () => {
    const query = {
      name: 'Josefa',
      age: '45',
      city: 'Medellin'
    };

    const response = await agent.patch('https://httpbin.org/patch').send(query);
    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body).to.have.property('json');
    expect(response.body.json).to.eql(query);
  });

  it('Consume PUT Service', async () => {
    const response = await agent.put('https://httpbin.org/put');

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    // expect(response.body.json).to.be.null;
  });

  it('Consume PUT Service with query parameters', async () => {
    const query = {
      name: 'Josefa',
      age: '45',
      city: 'Medellin'
    };

    const response = await agent.put('https://httpbin.org/put').send(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.json).to.eql(query);
  });

  it('Consume DELETE Service', async () => {
    const query = {
      name: 'Josefa',
      age: '45',
      city: 'Medellin'
    };

    const response = await agent.delete('https://httpbin.org/delete').send(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.json).to.eql(query);
  });
});
