
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

let createdTipoContrato = {};

after(() => {
    server.close();
})
describe("TIPOS CONTRATOS", () => {
    describe("/POST tipos_contratos", () => {
        it('debe crear una tipo de contrato', (done) => {
            let tipo_contrato = {
                nombre: "Temporal",
            }
            chai.request(server)
                .post('/tipos_contratos')
                .send(tipo_contrato)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tipo_contrato_id');
                    res.body.should.like(tipo_contrato);
                    createdTipoContrato = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id tipos_contratos", () => {
        it('debe obtener el tipo de contrato creado', (done) => {
            chai.request(server)
                .get('/tipos_contratos/' + createdTipoContrato.tipo_contrato_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdTipoContrato)
                    done();
                });
        });
    });
    describe("/GET tipos_contratos", () => {
        it('debe obtener todos los tipos de contrato', (done) => {
            chai.request(server)
                .get('/tipos_contratos')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT tipos_contratos", () => {
        it('debe modificar el tipo de contrato creado', (done) => {
            createdTipoContrato.nombre = "Indefinido";
            chai.request(server)
                .put('/tipos_contratos')
                .send(createdTipoContrato)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id tipos_contratos", () => {
        it('debe eliminar el tipo de contrato creado', (done) => {
            chai.request(server)
                .delete('/tipos_contratos/' + createdTipoContrato.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


