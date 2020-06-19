// Libraries required for testing
const test = require('ava');
const request = require('supertest');

const { Users } = require('../../app/models');

const { before, beforeEach, afterEach, after } = require('../_utils');

test.before(before);
test.after.always(after);
test.beforeEach(beforeEach);
test.afterEach.always(afterEach);

test.serial('creates new user', async t => {
  const app = await request(t.context.web.server);
  const res = await app.post('/en/register').send({
    email: 'lordbyron@example.com',
    password: '?X#8Hn=PbkvTD/{'
  });

  t.is(res.header.location, '/en/dashboard');
  t.is(res.status, 302);

  const newUser = await Users.findOne({ email: 'lordbyron@example.com' });
  t.is(newUser.email, 'lordbyron@example.com');
});
