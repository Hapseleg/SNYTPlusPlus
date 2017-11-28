// var assert = require('chai').assert;
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
// var request = require('mocha');
chai.use(chaiHttp);

var app = "http://localhost:1337";
// var app = require("../app");
var user = require('../models/User.model');

describe('Log ind',function () {
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
    console.log("kører bla bla");
    it('should add a SINGLE blob on /blobs POST', function(done) {
        // this.timeout(1000000);
        console.log("start test");
        chai.request(app)
            .post('/')
            .type('form')
            .send({"email":"test@test.dk", "password":"123"})
            .end(function(err, res){
                console.log(err);
                console.log(res);
                res.should.have.status(200);
                // res.should.be.json;
                // res.body.should.be.a('object');
                // res.body.should.have.property('SUCCESS');
                // res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('email');
                // res.body.SUCCESS.should.have.property('lastName');
                // res.body.SUCCESS.should.have.property('_id');
                // res.body.SUCCESS.name.should.equal('Java');
                // res.body.SUCCESS.lastName.should.equal('Script');
                done();
            });
    });

    // it('Log ind er succesfuld pga korrekt login',function () {
    //
    // });


    it('Log ind fejler pga forkert login', function () {

    });

});