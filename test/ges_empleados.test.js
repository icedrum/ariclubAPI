
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

let createdEmpleado = {};

after(() => {
    server.close();
})
describe("GES EMPLEADOS", () => {
    describe("/GET/:id ges_empleados", () => {
        it('debe obtener el empleado de gestión 15', (done) => {
            chai.request(server)
                .get('/ges_empleados/15')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('no debe encontrar el empleado de gestión 9999', (done) => {
            chai.request(server)
                .get('/ges_empleados/9999')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});


