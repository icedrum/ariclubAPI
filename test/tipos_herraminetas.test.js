
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
describe("TIPOS HERRAMIENTAS", () => {
    describe("/POST tipos_herramientas", () => {
        it('debe crear una tipo de herramienta', (done) => {
            let tipo_herramienta = {
                nombre: "LLave inglesa",
            }
            chai.request(server)
                .post('/tipos_herramientas')
                .send(tipo_herramienta)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tipo_herramienta_id');
                    res.body.should.like(tipo_herramienta);
                    createdTipoPrenda = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id tipos_herramientas", () => {
        it('debe obtener el tipo de herramienta creado', (done) => {
            chai.request(server)
                .get('/tipos_herramientas/' + createdTipoPrenda.tipo_herramienta_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdTipoPrenda)
                    done();
                });
        });
    });
    describe("/GET tipos_herramientas", () => {
        it('debe obtener todos los tipos de herramienta', (done) => {
            chai.request(server)
                .get('/tipos_herramientas')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT tipos_herramientas", () => {
        it('debe modificar el tipo de herramienta creado', (done) => {
            createdTipoPrenda.nombre = "Destornillador";
            chai.request(server)
                .put('/tipos_herramientas')
                .send(createdTipoPrenda)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id tipos_herramientas", () => {
        it('debe eliminar el tipo de herramienta creado', (done) => {
            chai.request(server)
                .delete('/tipos_herramientas/' + createdTipoPrenda.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


