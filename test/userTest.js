const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const server = require("../index");


const chaiHttp = require('chai-http');
const { response } = require('express');

chai.use(chaiHttp);


describe('User API', function () {
    this.timeout(5000);

    const userRegData = {
        "name": "Example",
        "email": "example@gmail.com",
        "password": "example@123",
        "phoneNumber": "1234567890"
    }

    const userLoginData = {
        email: "vishal@gmail.com",
        password: "vishal@123"
    }


    it('Register GET User', function (done) {
        chai.request(server)
            .get("/register")
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                done();
            });
    });

    it('Register User', function (done) {
        chai.request(server)
            .post("/register")
            .send(userRegData)
            .end((err, response) => {
                if (err) {
                    console.log("Counting error!");
                    done(err);
                    return;
                }

                expect(response.status).to.be.equal(200);
                done();
            });

    });

    it('Login User', function (done) {
        chai.request(server)
            .post("/user/login")
            .send(userLoginData)
            .end((err, response) => {
                if (err) {
                    console.log("Counting error!");
                    done(err);
                    return;
                }

                expect(response.status).to.be.equal(200);
                done();
            });

    });

});


// Task API Testing ##########################################


describe('Task API', function () {
    this.timeout(5000);

    const createTaskData = {
        description : "Set my new goals.",
        completed: false
    }


    it('Show Task', function (done) {
        chai.request(server)
            .get("/user/auth/showtask")
            .end((err, response) => {
                expect(response.status).to.be.equal(400);
                done();
            });
    });

    it('Create Task', function (done) {
        chai.request(server)
            .post("/user/auth/createtask")
            .send(createTaskData)
            .end((err, response) => {
                if (err) {
                    console.log("Counting error!");
                    done(err);
                    return;
                }

                expect(response.status).to.be.equal(200);
                done();
            });

    });

});


