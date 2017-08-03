import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import * as path from 'path';
import test from 'ava';

test('wrapper for startup and shutdown', async t => {
    t.plan(5);

    await startup_shutdown(t, (t) => {
        t.is(obs.ObsGlobal.initialized, true);
        t.is(obs.ObsGlobal.locale, 'en-US');
    });

    t.is(obs.ObsGlobal.initialized, false);
    t.is(obs.ObsGlobal.locale, undefined);
});
