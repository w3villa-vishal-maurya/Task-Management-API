const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../index"); // Replace with the actual path to your server file
const User = require('../model/User'); // Adjust the path based on your application structure

chai.use(chaiHttp);

describe('Task Test Suite', function () {
    it('Should show task for authenticated user', async function () {
        const response = await chai.request(server)
            .post('/user/login')
            .send({
                email: 'vishal@gmail.com',
                password: 'vishal@123'
            });

        const accessToken = response.body.data.accessToken;
        console.log(accessToken);

      
        const taskResponse = await chai.request(server)
            .get('/user/auth/showtask')
            .set('Authorization', `${accessToken}`);

        
        chai.expect(taskResponse.status).to.equal(200);

    });
});
