
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

let createdUser = {};

after(() => {
    server.close();
})
describe("USERS", () => {
    describe("/POST usuario", () => {
        it('debe crear un usuario', (done) => {
            let usuario = {
                nombre: "Ana",
                email: "ana@gmail12.com",
                password: "x234",
                grupo_usuario_id: null
            }
            chai.request(server)
                .post('/usuarios')
                .send(usuario)
                .end((err, res) => {
                    delete usuario.password;
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('usuario_id');
                    res.body.should.like(usuario);
                    createdUser = res.body;
                    done();
                });
        });
        it('no debe crear un un usuario con el mismo correo', (done) => {
            let usuario = {
                nombre: "Ana",
                email: "ana@gmail12.com",
                password: "x234"
            }
            chai.request(server)
                .post('/usuarios')
                .send(usuario)
                .end((err, res) => {
                    delete usuario.hash;
                    res.should.have.status(409);
                    done();
                });
        });
    });
    describe("/GET/:id usuario", () => {
        it('debe obtener el usuario creado', (done) => {
            let comparedUser = createdUser;
            delete comparedUser.hash
            chai.request(server)
                .get('/usuarios/' + createdUser.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal(createdUser)
                    done();
                });
        });
    });
    describe("/GET usuario", () => {
        it('debe obtener todos los usuarios', (done) => {
            chai.request(server)
                .get('/usuarios')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT usuario", () => {
        it('debe modificar el usuario creado', (done) => {
            createdUser.password = "melinishj";
            chai.request(server)
                .put('/usuarios')
                .send(createdUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/login  POST", () => {
        it('debe permitir login de un usuario correcto', (done) => {
            let usuLog = {
                email: "ana@gmail12.com",
                password: "melinishj"
            }
            chai.request(server)
                .post('/usuarios/login')
                .send(usuLog)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
        it('no debe permitir el login de un usuario con la contraseña incorrecta', (done) => {
            let usuLog = {
                email: "ana@gmail12.com",
                password: "----"
            }
            chai.request(server)
                .post('/usuarios/login')
                .send(usuLog)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
    describe("/DELETE/:id usuario", () => {
        it('debe eliminar el usuario creado', (done) => {
            chai.request(server)
                .delete('/usuarios/' + createdUser.usuario_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


