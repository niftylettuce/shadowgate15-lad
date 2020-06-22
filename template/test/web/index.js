const test = require('ava');

const { before, beforeEach, afterEach, after } = require('../_utils');

test.before(before);
test.after.always(after);
test.beforeEach(beforeEach);
test.afterEach.always(afterEach);

test('redirects to correct locale', async t => {
  const { web } = t.context;
  const res = await web.get('/');

  t.is(res.status, 302);
  t.is(res.headers.location, '/en');
});

test('returns English homepage', async t => {
  const { web } = t.context;
  const res = await web.get('/en').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('returns Spanish homepage', async t => {
  const { web } = t.context;
  const res = await web.get('/es').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('returns English ToS', async t => {
  const { web } = t.context;
  const res = await web.get('/en/terms').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});

test('returns Spanish ToS', async t => {
  const { web } = t.context;
  const res = await web.get('/es/terms').set({ Accept: 'text/html' });

  t.snapshot(res.text);
});
