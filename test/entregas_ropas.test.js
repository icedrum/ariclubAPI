
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
describe("ENTREGAS ROPAS", () => {
    describe("/POST entregas_ropas", () => {
        it('debe crear una entrega de ropa', (done) => {
            let entrega_ropa = {
                marca: "Nike"
            }
            chai.request(server)
                .post('/entregas_ropas')
                .send(entrega_ropa)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('entrega_ropa_id');
                    res.body.should.like(entrega_ropa);
                    createdEntrega = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id entregas_ropas", () => {
        it('debe obtener la entrega de ropa creada', (done) => {
            chai.request(server)
                .get('/entregas_ropas/' + createdEntrega.entrega_ropa_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdEntrega)
                    done();
                });
        });
    });
    describe("/GET entregas_ropas", () => {
        it('debe obtener todos las categorias profesionales', (done) => {
            chai.request(server)
                .get('/entregas_ropas')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT entregas_ropas", () => {
        it('debe modificar la entrega de ropa creada', (done) => {
            createdEntrega.marca = "Adidas";
            chai.request(server)
                .put('/entregas_ropas')
                .send(createdEntrega)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id grupos usuarios", () => {
        it('debe eliminar la entrega de ropa creada', (done) => {
            chai.request(server)
                .delete('/entregas_ropas/' + createdEntrega.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


