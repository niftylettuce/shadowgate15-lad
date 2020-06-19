// Libraries required for testing
const test = require('ava');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// server and models
const server = require('../../web');
const { Users } = require('../../app/models');

// Start MongoDB instance
const mongod = new MongoMemoryServer();

// Create connection to Mongoose before tests are run
test.before(async () => {
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri, {useMongoClient: true});
});

test.beforeEach(async t => {
  const user = new Users({
    email: 'johnwayne@example.com',
    password: '@!#SAL:DMA:SKLM!@'
  });
  await user.save();

  t.context.app = request.agent(server.listen());
});

test.afterEach.always(() => Users.remove());

test.serial('successful server setup', async t => {
  const { app } = t.context;
  const res = await app.get('/en');
  t.is(res.status, 200);
});

test.after.always(async () => {
  mongoose.disconnect();
  mongod.stop();
});
