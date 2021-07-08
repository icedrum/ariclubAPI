
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
describe("ENTREGAS HERRAMIENTAS", () => {
    describe("/POST entregas_herramientas", () => {
        it('debe crear una entrega de herramienta', (done) => {
            let entrega_herramienta = {
                marca: "RT455"
            }
            chai.request(server)
                .post('/entregas_herramientas')
                .send(entrega_herramienta)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('entrega_herramienta_id');
                    res.body.should.like(entrega_herramienta);
                    createdEntrega = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id entregas_herramientas", () => {
        it('debe obtener la entrega de herramienta creada', (done) => {
            chai.request(server)
                .get('/entregas_herramientas/' + createdEntrega.entrega_herramienta_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdEntrega)
                    done();
                });
        });
    });
    describe("/GET entregas_herramientas", () => {
        it('debe obtener todos las categorias profesionales', (done) => {
            chai.request(server)
                .get('/entregas_herramientas')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT entregas_herramientas", () => {
        it('debe modificar la entrega de herramienta creada', (done) => {
            createdEntrega.marca = "KKJ789";
            chai.request(server)
                .put('/entregas_herramientas')
                .send(createdEntrega)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id grupos usuarios", () => {
        it('debe eliminar la entrega de herramienta creada', (done) => {
            chai.request(server)
                .delete('/entregas_herramientas/' + createdEntrega.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


