
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

let createdEmpleado = {};

after(() => {
    server.close();
})
describe("EMPLEADOS", () => {
    describe("/POST empleados", () => {
        it('debe crear un empleado', (done) => {
            let empleado = {
                codigo_empleado: 2,
                nombre: "Juan",
                apellido1: "Perez"
            }
            chai.request(server)
                .post('/empleados')
                .send(empleado)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('empleado_id');
                    res.body.should.like(empleado);
                    createdEmpleado = res.body;
                    done();
                });
        });
    });
    describe("/GET/:id empleados", () => {
        it('debe obtener el empleado creado', (done) => {
            chai.request(server)
                .get('/empleados/' + createdEmpleado.empleado_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.like(createdEmpleado)
                    done();
                });
        });
    });
    describe("/GET empleados", () => {
        it('debe obtener todos los empleados', (done) => {
            chai.request(server)
                .get('/empleados')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.gt(0);
                    done();
                });
        });
    });
    describe("/PUT empleados", () => {
        it('debe modificar el empleados creado', (done) => {
            createdEmpleado.nombre = "Maria";
            chai.request(server)
                .put('/empleados')
                .send(createdEmpleado)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe("/DELETE/:id empleados", () => {
        it('debe eliminar el empleado creado', (done) => {
            chai.request(server)
                .delete('/empleados/' + createdEmpleado.empleado_id)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});


