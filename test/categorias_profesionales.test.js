
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

let createdCategoria = {};

after(() => {
    server.close();
})
describe("CATEGORIAS PROFESIONALES", () => {
    describe("/POST categorias_profesionales", () => {
        it('debe crear una categoria profesional', (done) => {
            let categoria_profesional = {
                nombre: "Trabajadores",
            }
            chai.request(server)
                .post('/categorias_profesionales')
                .send(categoria_profesional)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('categoria_profesional_id');
                    res.body.should.like(categoria_profesional);
                    createdCategoria = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id categorias_profesionales", () => {
        it('debe obtener la categoria profesional creada', (done) => {
            chai.request(server)
                .get('/categorias_profesionales/' + createdCategoria.categoria_profesional_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdCategoria)
                    done();
                });
        });
    });
    describe("/GET categorias_profesionales", () => {
        it('debe obtener todos las categorias profesionales', (done) => {
            chai.request(server)
                .get('/categorias_profesionales')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT categorias_profesionales", () => {
        it('debe modificar la categoria profesional creada', (done) => {
            createdCategoria.nombre = "Externos";
            chai.request(server)
                .put('/categorias_profesionales')
                .send(createdCategoria)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id grupos usuarios", () => {
        it('debe eliminar la categoria profesional creada', (done) => {
            chai.request(server)
                .delete('/categorias_profesionales/' + createdCategoria.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


