
process.env.NODE_ENV = 'TEST';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../server_test');

chai.config.includeStack = false;

chai.use(chaiHttp);
after(() => {
    server.close();
})
describe("GET VERSION", () => {
    it('debe obtener la versión', (done) => {
        chai.request(server)
            .get('/version')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});


