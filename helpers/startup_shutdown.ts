import * as obs from 'obs-studio-node';
import test from 'ava';

const path = require('path');

let node_dist_dir = 'node-obs'

export async function startup_shutdown(t: any, cb: (t: any) => void, locale?: string, start_path?: string) {
    if (arguments.length == 2) {
        var locale = 'en-US';
    }

    const wd = path.join(__dirname, '..', 'node_modules', 'obs-studio-node');

    const pipeName = t.title.split(' ').join('_');

    console.log(`Using pipe name: ${pipeName}`);

    obs.NodeObs.IPC.ConnectOrHost(pipeName);
    obs.NodeObs.SetWorkingDirectory(wd);
    obs.NodeObs.OBS_API_initAPI(path.join(__dirname, '..', 'AppData'));

    await cb(t);

    obs.NodeObs.OBS_API_destroyOBS_API();
}