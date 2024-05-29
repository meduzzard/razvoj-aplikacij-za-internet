const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js'); // Use require instead of import

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
