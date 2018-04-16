import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import test from 'ava';

test('source creation and destruction', async t => {
    await startup_shutdown(t, (t) => {
        let types = obs.InputFactory.types();
        let test_sources: obs.IInput[] = [];
        const iterations = 100;

        console.log(types);

        for (let k = 0; k < iterations; ++k) {
            for (let i = 0; i < types.length; ++i) {
                let source = 
                    obs.InputFactory.create(types[i], `${types[i]} ${k}`);
                
                source.release();
            }
        }
    });
});