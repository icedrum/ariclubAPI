
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

let createdGrupo = {};

after(() => {
    server.close();
})
describe("GRUPOS USUARIOS", () => {
    describe("/POST grupos_usuarios", () => {
        it('debe crear un grupo de usuarios', (done) => {
            let grupo_usuario = {
                nombre: "Adminsitrador",
            }
            chai.request(server)
                .post('/grupos_usuarios')
                .send(grupo_usuario)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('grupo_usuario_id');
                    res.body.should.like(grupo_usuario);
                    createdGrupo = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id grupos_usuarios", () => {
        it('debe obtener el grupo de usuario creado', (done) => {
            chai.request(server)
                .get('/grupos_usuarios/' + createdGrupo.grupo_usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdGrupo)
                    done();
                });
        });
    });
    describe("/GET grupos_usuarios", () => {
        it('debe obtener todos los grupos de usuarios', (done) => {
            chai.request(server)
                .get('/grupos_usuarios')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT grupos_usuarios", () => {
        it('debe modificar el grupo de usuarios creado', (done) => {
            createdGrupo.nombre = "Admin9";
            chai.request(server)
                .put('/grupos_usuarios')
                .send(createdGrupo)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id grupos usuarios", () => {
        it('debe eliminar el grupo de usuarios creado', (done) => {
            chai.request(server)
                .delete('/grupos_usuarios/' + createdGrupo.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


