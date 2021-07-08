
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

let createdEntrega = {};

after(() => {
    server.close();
})
describe("ENTREGAS EPIS", () => {
    describe("/POST entregas_epis", () => {
        it('debe crear una entrega de epi', (done) => {
            let entrega_epi = {
                marca: "Reben"
            }
            chai.request(server)
                .post('/entregas_epis')
                .send(entrega_epi)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('entrega_epi_id');
                    res.body.should.like(entrega_epi);
                    createdEntrega = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id entregas_epis", () => {
        it('debe obtener la entrega de epi creada', (done) => {
            chai.request(server)
                .get('/entregas_epis/' + createdEntrega.entrega_epi_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdEntrega)
                    done();
                });
        });
    });
    describe("/GET entregas_epis", () => {
        it('debe obtener todos las categorias profesionales', (done) => {
            chai.request(server)
                .get('/entregas_epis')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT entregas_epis", () => {
        it('debe modificar la entrega de epi creada', (done) => {
            createdEntrega.marca = "Hemmer";
            chai.request(server)
                .put('/entregas_epis')
                .send(createdEntrega)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id grupos usuarios", () => {
        it('debe eliminar la entrega de epi creada', (done) => {
            chai.request(server)
                .delete('/entregas_epis/' + createdEntrega.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


