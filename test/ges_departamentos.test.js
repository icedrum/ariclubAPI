
process.env.NODE_ENV = 'TEST';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let like = require('chai-like');
let should = chai.should();
let server = require('../server_test');

chai.config.includeStack = false;
chai.use(chaiHttp);
chai.use(like);

let createdDepartamento = {};

after(() => {
    server.close();
})
describe("GES DEPARTAMENTOS", () => {
    describe("/GET/:id ges_departamentos", () => {
        it('debe obtener el departamento de gestión 10', (done) => {
            chai.request(server)
                .get('/ges_departamentos/10')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('no debe encontrar el departamento de gestión 11', (done) => {
            chai.request(server)
                .get('/ges_departamentos/11')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});


