import * as obs from 'obs-studio-node';
import * as path from 'path';
import test from 'ava';

let node_dist_dir = 'node-obs'

export async function startup_shutdown(t: any, cb: (t: any) => void, locale?: string, start_path?: string) {
    if (arguments.length == 2) {
        var locale = 'en-US';
    }

    obs.Global.startup(locale);

    /* Module Loading */
    let bin_path = obs.DefaultBinPath;
    let data_path = obs.DefaultDataPath;
    let plugin_bin_path = obs.DefaultPluginPath;
    let plugin_data_path = obs.DefaultPluginDataPath;
    console.log(`Bin Path: ${bin_path}`);
    console.log(`Data Path: ${data_path}`);
    console.log(`Plugin Bin Path: ${plugin_bin_path}`);
    console.log(`Plugin Data Path: ${plugin_data_path}`);
    obs.ModuleFactory.addPath(bin_path, data_path);
    obs.ModuleFactory.addPath(plugin_bin_path, plugin_data_path);

    /* Video Context Setup */
    let obs_d3d11_path = obs.DefaultD3D11Path;

    console.log(`Searching for libobs-d3d11 at ${obs_d3d11_path}`);

    let error = obs.VideoFactory.reset({
        'graphicsModule': obs_d3d11_path,
        'fpsNum': 30,
        'fpsDen': 1,
        'outputWidth': 800,
        'outputHeight': 600,
        'outputFormat': obs.EVideoFormat.RGBA,
        'baseWidth': 800,
        'baseHeight': 600,
        'gpuConversion': false,
        'adapter': 0,
        'colorspace': obs.EColorSpace.Default,
        'range': obs.ERangeType.Default,
        'scaleType': obs.EScaleType.Default
    });

    t.is(error, 0);

    let audioError = obs.AudioFactory.reset({
        samplesPerSec: 44100,
        speakerLayout: obs.ESpeakerLayout.Stereo
    });

    t.is(audioError, true);

    obs.ModuleFactory.loadAll();
    obs.ModuleFactory.logLoaded();

    /* Dummy Display */
    var display_init = {
        'width': 800,
        'height': 600,
        'format': obs.EColorFormat.RGBA,
        'zsformat': obs.EZStencilFormat.None
    };

    let display = obs.DisplayFactory.create();

    await cb(t);

    display.destroy();
    obs.Global.shutdown();
}