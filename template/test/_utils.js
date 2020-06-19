// Necessary utils for testing
// Librarires required for testing
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const request = require('supertest');

// Models and server
const web = require('../web');
const api = require('../api');
const { Users } = require('../app/models');

const mongod = new MongodbMemoryServer();

// create connection to mongoose before all tests
exports.before = async () => {
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
};

// create fixtures before each test
exports.beforeEach = async t => {
  const user = new Users({
    email: 'robertfrost@example.com',
    password: '?X#8Hn=PbkvTD/{'
  });

  await user.save();

  t.context.web = await request.agent(web.server);
  t.context.api = await request.agent(api.server);
};

exports.afterEach = async () => {
  await Users.deleteMany();
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
