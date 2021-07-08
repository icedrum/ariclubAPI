
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

let createdNomina = {};

after(() => {
    server.close();
})
describe("NOMINAS", () => {
    describe("/POST nominas", () => {
        it('debe crear una nomina', (done) => {
            let nomina = {
                importe_bruto: 5000,
            }
            chai.request(server)
                .post('/nominas')
                .send(nomina)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('nomina_id');
                    res.body.should.like(nomina);
                    createdNomina = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id nominas", () => {
        it('debe obtener la nomina creada', (done) => {
            chai.request(server)
                .get('/nominas/' + createdNomina.nomina_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdNomina)
                    done();
                });
        });
    });
    describe("/GET nominas", () => {
        it('debe obtener todas las nominas', (done) => {
            chai.request(server)
                .get('/nominas')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT nominas", () => {
        it('debe modificar la nomina creada', (done) => {
            createdNomina.importe_bruto = 6000;
            chai.request(server)
                .put('/nominas')
                .send(createdNomina)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id nominas", () => {
        it('debe eliminar la nomina creada', (done) => {
            chai.request(server)
                .delete('/nominas/' + createdNomina.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


