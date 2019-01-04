import * as obs from 'obs-studio-node';

export class ConnectionHandler {
    startup(): boolean {
        const path = require('path');
        const wd = path.join(__dirname, '..', 'node_modules', 'obs-studio-node');
        const pipeName = 'osn-tests-pipe';  

        try {
            obs.NodeObs.IPC.ConnectOrHost(pipeName);
            obs.NodeObs.SetWorkingDirectory(wd);
            obs.NodeObs.OBS_API_initAPI('en-US', path.join(__dirname, '..', 'AppData'));
        } catch(e) {
            return false;
        }

        return true;
    }

    shutdown(): boolean {
        try {
            obs.NodeObs.OBS_API_destroyOBS_API();
            obs.NodeObs.IPC.disconnect();
        } catch(e) {
            return false;
        }

        return true;
    }
}