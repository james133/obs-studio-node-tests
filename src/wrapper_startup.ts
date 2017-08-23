import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import * as path from 'path';
import test from 'ava';

test('wrapper for startup and shutdown', async t => {
    t.plan(6);

    await startup_shutdown(t, (t) => {
        t.is(obs.Global.initialized, true);
        t.is(obs.Global.locale, 'en-US');
    });

    t.is(obs.Global.initialized, false);
    t.is(obs.Global.locale, undefined);
});
