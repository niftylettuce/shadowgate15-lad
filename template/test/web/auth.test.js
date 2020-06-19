// Libraries required for testing
const test = require('ava');

const phrases = require('../../config/phrases');
const { Users } = require('../../app/models');

const { before, beforeEach, afterEach, after } = require('../_utils');

test.before(before);
test.after.always(after);
test.beforeEach(beforeEach);
test.afterEach.always(afterEach);

test.serial('creates new user', async t => {
  const { web } = t.context;
  const res = await web.post('/en/register').send({
    email: 'lordbyron@example.com',
    password: '?X#8Hn=PbkvTD/{'
  });

  t.is(res.header.location, '/en/dashboard');
  t.is(res.status, 302);

  // make sure user was added to database
  const newUser = await Users.findOne({ email: 'lordbyron@example.com' });
  t.is(newUser.email, 'lordbyron@example.com');
});

test('fails registering with easy password', async t => {
  const { web } = t.context;
  const res = await web.post('/en/register').send({
    email: 'emilydickinson@example.com',
    password: 'password'
  });

  t.is(res.body.message, phrases.INVALID_PASSWORD_STRENGHT);
  t.is(res.status, 400);

  // make sure user was not added to database
  const newUser = await Users.findOne({ email: 'emilydickinson@example.com' });
  t.is(newUser, null);
});
