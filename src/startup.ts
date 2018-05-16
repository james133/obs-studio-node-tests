import * as obs from 'obs-studio-node';
import test from 'ava';

const path = require('path');

test('startup and shutdown', async t => {
    const wd = path.join(__dirname, '..', 'node_modules', 'obs-studio-node');

    obs.NodeObs.IPC.ConnectOrHost(t.title.split(' ').join('_'));
    obs.NodeObs.SetWorkingDirectory(wd);
    obs.NodeObs.OBS_API_initAPI(path.join(__dirname, '..', 'AppData'));
    obs.NodeObs.OBS_API_destroyOBS_API();
    obs.NodeObs.IPC.disconnect();

    t.pass();	
});