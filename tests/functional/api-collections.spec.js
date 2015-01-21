/*jslint node: true */
/*jshint strict:false */
'use strict';

// Setup superagent and chai expect
// Note: This is also set in chai-helper.js, but JShint complains if its not here too
var chai = require('chai');
var expect = chai.expect;
var superagent = require('superagent');
var app = require('../../app');


describe('server', function () {

  describe('rest api', function(){
    var id;

    it('can add an object', function(done){
      superagent.post('http://localhost:3000/api/collections/test')
        .send({
          name: 'John',
          email: 'john@rpjs.co'
        })
        .end(function(e,res){
          //console.log(res.body)
          expect(e).to.eql(null);
          expect(res.body.length).to.eql(1);
          expect(res.body[0]._id.length).to.eql(24);
          id = res.body[0]._id;
          done();
        });
    });

    it('can retrieve a specific object', function(done){
      superagent.get('http://localhost:3000/api/collections/test/' + id)
        .end(function(e, res){
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body._id.length).to.eql(24);
          expect(res.body._id).to.eql(id);
          done();
        });
    });

    it('can retrieve a collection of objects', function(done){
      superagent.get('http://localhost:3000/api/collections/test')
        .end(function(e, res){
          //console.log(res.body)
          expect(e).to.eql(null);
          expect(res.body.length).to.be.above(0);
          expect(res.body.map(function (item){
            return item._id;
          })).to.contain(id);
          done();
        });
    });

    it('can updates an object', function(done){
      superagent.put('http://localhost:3000/api/collections/test/' + id)
        .send({
          name: 'Peter',
          email: 'peter@yahoo.com'
        })
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('can check an updated object', function(done){
      superagent.get('http://localhost:3000/api/collections/test/'+id)
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body._id.length).to.eql(24);
          expect(res.body._id).to.eql(id);
          expect(res.body.name).to.eql('Peter');
          done();
        });
    });

    it('can remove an object', function(done){
      superagent.del('http://localhost:3000/api/collections/test/'+id)
        .end(function(e, res){
          // console.log(res.body)
          expect(e).to.eql(null);
          expect(typeof res.body).to.eql('object');
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

  });
});