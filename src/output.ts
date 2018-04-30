import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown';
import test from 'ava';

test.failing('output channel setting', async t => {
    t.fail("OutputFactory no implemented");

    await startup_shutdown(t, (t) => {
        let test_source = 
            obs.InputFactory.createPrivate(
                'color_source',
                'test source',
            );

        let test_scene =
            obs.SceneFactory.create('test scene');

        let test_transition = 
            obs.TransitionFactory.create('fade_transition', 'test transition');

        test_transition.set(test_scene);
        test_scene.add(test_source);
        
        let source_check;

        obs.Global.setOutputSource(0, test_source);
        source_check = obs.Global.getOutputSource(0);
        source_check = obs.Global.getOutputSource(0);
        source_check = obs.Global.getOutputSource(0);
        t.is(source_check.name, 'test source');

        obs.Global.setOutputSource(0, test_scene);
        source_check = obs.Global.getOutputSource(0);
        source_check = obs.Global.getOutputSource(0);
        source_check = obs.Global.getOutputSource(0);
        t.is(source_check.name, 'test scene');

        obs.Global.setOutputSource(0, test_transition);
        source_check = obs.Global.getOutputSource(0);
        source_check = obs.Global.getOutputSource(0);
        source_check = obs.Global.getOutputSource(0);
        t.is(source_check.name, 'test transition');

        const test_output = obs.OutputFactory.create('null_output', 'test output');
        test_output.start();

        test_output.release();
        test_source.release();
        test_scene.release();
        test_transition.release();

        obs.Global.setOutputSource(0, null);
    });
});