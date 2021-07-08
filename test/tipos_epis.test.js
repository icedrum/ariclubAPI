
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

let createdTipoEpi = {};

after(() => {
    server.close();
})
describe("TIPOS EPIS", () => {
    describe("/POST tipos_epis", () => {
        it('debe crear una tipo de epi', (done) => {
            let tipo_epi = {
                nombre: "Casco",
            }
            chai.request(server)
                .post('/tipos_epis')
                .send(tipo_epi)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tipo_epi_id');
                    res.body.should.like(tipo_epi);
                    createdTipoEpi = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id tipos_epis", () => {
        it('debe obtener el tipo de epi creado', (done) => {
            chai.request(server)
                .get('/tipos_epis/' + createdTipoEpi.tipo_epi_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdTipoEpi)
                    done();
                });
        });
    });
    describe("/GET tipos_epis", () => {
        it('debe obtener todos los tipos de epi', (done) => {
            chai.request(server)
                .get('/tipos_epis')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT tipos_epis", () => {
        it('debe modificar el tipo de epi creado', (done) => {
            createdTipoEpi.nombre = "Botas";
            chai.request(server)
                .put('/tipos_epis')
                .send(createdTipoEpi)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id tipos_epis", () => {
        it('debe eliminar el tipo de epi creado', (done) => {
            chai.request(server)
                .delete('/tipos_epis/' + createdTipoEpi.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


