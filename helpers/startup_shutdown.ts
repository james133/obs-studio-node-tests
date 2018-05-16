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
    try {
        await cb(t);
    } catch (e) {
        // Ava has this weird concept of completely fucking up the entire process if a v8 exception happens that is not caught.
        // So lets catch it, disconnect, and continue because what else can we do?
        obs.NodeObs.IPC.disconnect();
        throw e;
    }

    obs.NodeObs.OBS_API_destroyOBS_API();
    obs.NodeObs.IPC.disconnect();
}