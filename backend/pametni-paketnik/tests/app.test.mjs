import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // Preverite, da je prava pot do vašega app.js

const should = chai.should();
chai.use(chaiHttp);

describe('GET /', () => {
  it('it should GET the home page', (done) => {
    chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
  });
});
