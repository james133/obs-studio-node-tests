import * as obs from 'obs-studio-node';
import * as path from 'path';
import test from 'ava';

test('startup and shutdown', async t => {
    t.plan(4);

    let locale = 'en-US';

    obs.Global.startup(locale);
    t.is(obs.Global.initialized, true);
    t.is(obs.Global.locale, locale);

    obs.Global.shutdown();
    t.is(obs.Global.initialized, false);
    t.is(obs.Global.locale, undefined);
});