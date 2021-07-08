
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
describe("DEPARTAMENTOS", () => {
    describe("/POST departamentos", () => {
        it('debe crear un departamento', (done) => {
            let departamento = {
                codigo_departamento: 2,
                nombre: "Finanzas",
            }
            chai.request(server)
                .post('/departamentos')
                .send(departamento)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('departamento_id');
                    res.body.should.like(departamento);
                    createdDepartamento = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id departamentos", () => {
        it('debe obtener el departamento creado', (done) => {
            chai.request(server)
                .get('/departamentos/' + createdDepartamento.departamento_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdDepartamento)
                    done();
                });
        });
    });
    describe("/GET departamentos", () => {
        it('debe obtener todos los departamentos', (done) => {
            chai.request(server)
                .get('/departamentos')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT departamentos", () => {
        it('debe modificar el departamentos creado', (done) => {
            createdDepartamento.nombre = "Comercial";
            chai.request(server)
                .put('/departamentos')
                .send(createdDepartamento)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id departamentos", () => {
        it('debe eliminar el departamento creado', (done) => {
            chai.request(server)
                .delete('/departamentos/' + createdDepartamento.departamento_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


