
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

let createdParentesco = {};

after(() => {
    server.close();
})
describe("PARENTESCOS", () => {
    describe("/POST parentescos", () => {
        it('debe crear un parentesco', (done) => {
            let parentesco = {
                nombre: "Padre",
            }
            chai.request(server)
                .post('/parentescos')
                .send(parentesco)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('parentesco_id');
                    res.body.should.like(parentesco);
                    createdParentesco = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id parentescos", () => {
        it('debe obtener el parentesco creado', (done) => {
            chai.request(server)
                .get('/parentescos/' + createdParentesco.parentesco_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdParentesco)
                    done();
                });
        });
    });
    describe("/GET parentescos", () => {
        it('debe obtener todos los parentescos', (done) => {
            chai.request(server)
                .get('/parentescos')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT parentescos", () => {
        it('debe modificar el parentescos creado', (done) => {
            createdParentesco.nombre = "Madre";
            chai.request(server)
                .put('/parentescos')
                .send(createdParentesco)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id parentescos", () => {
        it('debe eliminar el parentesco creado', (done) => {
            chai.request(server)
                .delete('/parentescos/' + createdParentesco.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


