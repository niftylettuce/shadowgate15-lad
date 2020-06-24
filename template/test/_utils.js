// Necessary utils for testing
// Librarires required for testing
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const request = require('supertest');
const sinon = require('sinon');

// Models and server
const web = require('../web');
const api = require('../api');
const { Users } = require('../app/models');
const config = require('../config');

const mongod = new MongodbMemoryServer();
const passport = require('koa-passport');

// create connection to mongoose before all tests
exports.before = async () => {
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
};

// create fixtures before each test
exports.beforeEach = async t => {
  const query = {
    email: 'robertfrost@example.com',
    group: 'admin'
  };
  query[config.userFields.hasVerifiedEmail] = true;
  query[config.userFields.hasSetPassword] = true;
  await Users.register(query, '?X#8Hn=PbkvTD/{');

  t.context.web = await request.agent(web.server);
  t.context.api = await request.agent(api.server);
  t.context.authenticate = sinon.stub(passport, 'authenticate')
    .returns(() => {});
  t.context.serialize = sinon.stub(passport, 'serializeUser')
    .returns(() => {});
  t.context.deserialize = sinon.stub(passport, 'deserializeUser')
    .returns(() => {});
};

exports.afterEach = async t => {
  await Users.deleteMany();
  t.context.authenticate.restore();
  t.context.serialize.restore();
  t.context.deserialize.restore();
};

exports.after = async () => {
  mongoose.disconnect();
  mongod.stop();
};

exports.login = async web => {
  await web.post('/en/login').send({
    email: 'robertfrost@example.com',
    password: '?X#8Hn=PbkvTD/{'
  });

  return web;
};
