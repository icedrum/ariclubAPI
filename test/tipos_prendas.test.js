
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

let createdTipoPrenda = {};

after(() => {
    server.close();
})
describe("TIPOS PRENDAS", () => {
    describe("/POST tipos_prendas", () => {
        it('debe crear una tipo de prenda', (done) => {
            let tipo_prenda = {
                nombre: "Chaleco",
            }
            chai.request(server)
                .post('/tipos_prendas')
                .send(tipo_prenda)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tipo_prenda_id');
                    res.body.should.like(tipo_prenda);
                    createdTipoPrenda = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id tipos_prendas", () => {
        it('debe obtener el tipo de prenda creado', (done) => {
            chai.request(server)
                .get('/tipos_prendas/' + createdTipoPrenda.tipo_prenda_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdTipoPrenda)
                    done();
                });
        });
    });
    describe("/GET tipos_prendas", () => {
        it('debe obtener todos los tipos de prenda', (done) => {
            chai.request(server)
                .get('/tipos_prendas')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT tipos_prendas", () => {
        it('debe modificar el tipo de prenda creado', (done) => {
            createdTipoPrenda.nombre = "Botas";
            chai.request(server)
                .put('/tipos_prendas')
                .send(createdTipoPrenda)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id tipos_prendas", () => {
        it('debe eliminar el tipo de prenda creado', (done) => {
            chai.request(server)
                .delete('/tipos_prendas/' + createdTipoPrenda.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


