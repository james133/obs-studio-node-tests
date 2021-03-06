import * as obs from 'obs-studio-node';

const prompt = require('prompt');

const locale = "en-US.utf8";

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

let audioError = obs.AudioFactory.reset({
    samplesPerSec: 44100,
    speakerLayout: obs.ESpeakerLayout.Stereo
});

obs.ModuleFactory.loadAll();
obs.ModuleFactory.logLoaded();

let display = obs.DisplayFactory.create();

let test_source = 
    obs.InputFactory.create('color_source', 'test source');

let test_audio_source = 
    obs.InputFactory.create('wasapi_output_capture', 'test audio source');

let test_scene = obs.SceneFactory.create('test scene');

let test_transition = 
    obs.TransitionFactory.create('fade_transition', 'test transition');

test_transition.set(test_scene);
test_scene.add(test_source);
test_scene.add(test_audio_source);

obs.Global.setOutputSource(0, test_transition);

const test_service_settings = {
    key: "live_149172892_63LDVjr9p1kv3wLP9soqH1yHqctfmq",
    server: "rtmp://live.twitch.tv/app",
    service: "Twitch"
};

let test_output = obs.OutputFactory.create('rtmp_output', 'test output');

let test_service = 
    obs.ServiceFactory.create(
        'rtmp_common', 'test service', 
        test_service_settings);

let test_audio_encoder = 
    obs.AudioEncoderFactory.create('mf_aac', 'test audio encoder');

let test_video_encoder = 
    obs.VideoEncoderFactory.create('obs_x264', 'test video encoder');

test_output.service = test_service;

let test_video = obs.VideoFactory.getGlobal();
let test_audio = obs.AudioFactory.getGlobal();

// setMedia is only used if no encoders are used! 
// They are otherwise ignored and the video
// and audio set by the encoders is what's used. 
/* test_output.setMedia(test_video, test_audio); */
test_audio_encoder.setAudio(test_audio);
test_video_encoder.setVideo(test_video);

test_output.setAudioEncoder(test_audio_encoder, 0);
test_output.setVideoEncoder(test_video_encoder);

test_output.start();

prompt.start();

prompt.get(['signal'], (err: any, result: any) => {
    console.log('Shutting down...');

    test_output.stop();
    test_output.release();
    test_service.release();
    test_audio_encoder.release();
    test_video_encoder.release();
    test_transition.release();
    test_scene.release();
    test_source.release();
    test_audio_source.release();
    obs.Global.shutdown()
});