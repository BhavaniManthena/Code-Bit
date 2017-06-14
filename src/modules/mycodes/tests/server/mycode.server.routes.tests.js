'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mycode = mongoose.model('Mycode'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  mycode;

/**
 * Mycode routes tests
 */
describe('Mycode CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Mycode
    user.save(function () {
      mycode = {
        name: 'Mycode name'
      };

      done();
    });
  });

  it('should be able to save a Mycode if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Mycode
        agent.post('/api/mycodes')
          .send(mycode)
          .expect(200)
          .end(function (mycodeSaveErr, mycodeSaveRes) {
            // Handle Mycode save error
            if (mycodeSaveErr) {
              return done(mycodeSaveErr);
            }

            // Get a list of Mycodes
            agent.get('/api/mycodes')
              .end(function (mycodesGetErr, mycodesGetRes) {
                // Handle Mycodes save error
                if (mycodesGetErr) {
                  return done(mycodesGetErr);
                }

                // Get Mycodes list
                var mycodes = mycodesGetRes.body;

                // Set assertions
                (mycodes[0].user._id).should.equal(userId);
                (mycodes[0].name).should.match('Mycode name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Mycode if not logged in', function (done) {
    agent.post('/api/mycodes')
      .send(mycode)
      .expect(403)
      .end(function (mycodeSaveErr, mycodeSaveRes) {
        // Call the assertion callback
        done(mycodeSaveErr);
      });
  });

  it('should not be able to save an Mycode if no name is provided', function (done) {
    // Invalidate name field
    mycode.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Mycode
        agent.post('/api/mycodes')
          .send(mycode)
          .expect(400)
          .end(function (mycodeSaveErr, mycodeSaveRes) {
            // Set message assertion
            (mycodeSaveRes.body.message).should.match('Please fill Mycode name');

            // Handle Mycode save error
            done(mycodeSaveErr);
          });
      });
  });

  it('should be able to update an Mycode if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Mycode
        agent.post('/api/mycodes')
          .send(mycode)
          .expect(200)
          .end(function (mycodeSaveErr, mycodeSaveRes) {
            // Handle Mycode save error
            if (mycodeSaveErr) {
              return done(mycodeSaveErr);
            }

            // Update Mycode name
            mycode.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Mycode
            agent.put('/api/mycodes/' + mycodeSaveRes.body._id)
              .send(mycode)
              .expect(200)
              .end(function (mycodeUpdateErr, mycodeUpdateRes) {
                // Handle Mycode update error
                if (mycodeUpdateErr) {
                  return done(mycodeUpdateErr);
                }

                // Set assertions
                (mycodeUpdateRes.body._id).should.equal(mycodeSaveRes.body._id);
                (mycodeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mycodes if not signed in', function (done) {
    // Create new Mycode model instance
    var mycodeObj = new Mycode(mycode);

    // Save the mycode
    mycodeObj.save(function () {
      // Request Mycodes
      request(app).get('/api/mycodes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Mycode if not signed in', function (done) {
    // Create new Mycode model instance
    var mycodeObj = new Mycode(mycode);

    // Save the Mycode
    mycodeObj.save(function () {
      request(app).get('/api/mycodes/' + mycodeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', mycode.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Mycode with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mycodes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Mycode is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Mycode which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Mycode
    request(app).get('/api/mycodes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Mycode with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Mycode if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Mycode
        agent.post('/api/mycodes')
          .send(mycode)
          .expect(200)
          .end(function (mycodeSaveErr, mycodeSaveRes) {
            // Handle Mycode save error
            if (mycodeSaveErr) {
              return done(mycodeSaveErr);
            }

            // Delete an existing Mycode
            agent.delete('/api/mycodes/' + mycodeSaveRes.body._id)
              .send(mycode)
              .expect(200)
              .end(function (mycodeDeleteErr, mycodeDeleteRes) {
                // Handle mycode error error
                if (mycodeDeleteErr) {
                  return done(mycodeDeleteErr);
                }

                // Set assertions
                (mycodeDeleteRes.body._id).should.equal(mycodeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Mycode if not signed in', function (done) {
    // Set Mycode user
    mycode.user = user;

    // Create new Mycode model instance
    var mycodeObj = new Mycode(mycode);

    // Save the Mycode
    mycodeObj.save(function () {
      // Try deleting Mycode
      request(app).delete('/api/mycodes/' + mycodeObj._id)
        .expect(403)
        .end(function (mycodeDeleteErr, mycodeDeleteRes) {
          // Set message assertion
          (mycodeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Mycode error error
          done(mycodeDeleteErr);
        });

    });
  });

  it('should be able to get a single Mycode that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Mycode
          agent.post('/api/mycodes')
            .send(mycode)
            .expect(200)
            .end(function (mycodeSaveErr, mycodeSaveRes) {
              // Handle Mycode save error
              if (mycodeSaveErr) {
                return done(mycodeSaveErr);
              }

              // Set assertions on new Mycode
              (mycodeSaveRes.body.name).should.equal(mycode.name);
              should.exist(mycodeSaveRes.body.user);
              should.equal(mycodeSaveRes.body.user._id, orphanId);

              // force the Mycode to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Mycode
                    agent.get('/api/mycodes/' + mycodeSaveRes.body._id)
                      .expect(200)
                      .end(function (mycodeInfoErr, mycodeInfoRes) {
                        // Handle Mycode error
                        if (mycodeInfoErr) {
                          return done(mycodeInfoErr);
                        }

                        // Set assertions
                        (mycodeInfoRes.body._id).should.equal(mycodeSaveRes.body._id);
                        (mycodeInfoRes.body.name).should.equal(mycode.name);
                        should.equal(mycodeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Mycode.remove().exec(done);
    });
  });
});
