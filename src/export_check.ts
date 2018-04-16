import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import test from 'ava';

let IInput_key_table = [
    //IInput
    'volume',
    'syncOffset',
    'showing',
    'audioMixers',
    'filters',
    'monitoringType',
    'deinterlaceFieldOrder',
    'deinterlaceMode'
];

test('property and method existance check', async t => {
    await startup_shutdown(t, (t) => {
        let test_source: obs.IInput = 
            obs.InputFactory.create('color_source', 'test source');

        for (let i = 0; i < IInput_key_table.length; ++i) {
            let key = IInput_key_table[i];
            t.is(test_source.hasOwnProperty(key), true, `${key} missing`);
        }

        t.is(test_source.hasOwnProperty(`'doesn'texistyo`), false);
    });
})