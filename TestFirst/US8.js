// var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
// var request = require('mocha');
chai.use(chaiHttp);

// var app = "http://localhost:1337";
var app = require("../app.js");
var user = require('../models/User.model');

describe('Log ind',function () {
    it("post('/company') test", function () {
        return request(app)
            .post('/')
            .send({
                'email': 'test@test.dk',
                'password': '123'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(function (res) {
                res.body.message.should.be.equal('Company saved!');
                return controller.getCompanies();
            })
            .then(res => {
            res.length.should.be.equal(3);
        res[2].name.should.be.equal('EAAA');

    });
    });
    // it('Log ind ok',function () {
    //     user.find({"email":"test@test.dk","password":"123"}).exec().then(function (users) {
    //         assert(users.length,1);
    //         // if(users.length==1){
    //         //     console.log("found login");
    //         //     done();
    //         // }
    //         // else{
    //         //     console.log("fail login");
    //         //     fail();
    //         // }
    //         // else{
    //         //
    //         //     fail();
    //         // }
    //     })
    // });
    // it('Log ind er succesfuld pga korrekt login', function(done) {
    //     chai.request(app)
    //         .post('/')
    //         .send({"email":"test@test.dk", "password":"123"})
    //         // .expect(200)
    //         // .expect('Content-Type', /json/)
    //         .end(function(err, res) {
    //             if (err) done(err);
    //             res.body.should.have.property('email');
    //             res.body.email.should.have.property('test@test.dk');
    //             done();
    //         });
    // });
    // console.log("kører bla bla");
    // it('should add a SINGLE blob on /blobs POST', function(done) {
    //     // this.timeout(1000000);
    //     console.log("start test");
    //     chai.request(app)
    //         .post('/')
    //         .type('form')
    //         .send({"email":"test@test.dk", "password":"123"})
    //         .end(function(err, res){
    //             if(err){
    //                 console.log(err);
    //             }
    //             else{
    //                 // console.log(err);
    //                 // console.log(res);
    //                 res.should.have.status(200);
    //                 // res.should.be.json;
    //                 // res.body.should.be.a('object');
    //                 // res.body.should.have.property('SUCCESS');
    //                 // res.body.SUCCESS.should.be.a('object');
    //                 res.body.SUCCESS.should.have.property('email');
    //                 // res.body.SUCCESS.should.have.property('lastName');
    //                 // res.body.SUCCESS.should.have.property('_id');
    //                 // res.body.SUCCESS.name.should.equal('Java');
    //                 // res.body.SUCCESS.lastName.should.equal('Script');
    //                 done();
    //             }
    //
    //         });
    // });

    // it('Log ind er succesfuld pga korrekt login',function () {
    //
    // });


    // it('Log ind fejler pga forkert login', function () {
    //
    // });

});