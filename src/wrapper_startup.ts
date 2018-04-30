import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import test from 'ava';

test('wrapper for startup and shutdown', async t => {
    await startup_shutdown(t, (t) => {});
});
