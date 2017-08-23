import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import * as path from 'path';
import test from 'ava';

test('filter creation and destruction', async t => {
    await startup_shutdown(t, (t) => {
        let test_source =
            obs.InputFactory.create('ffmpeg_source', 'test source');

        const iterations = 50;

        t.is(test_source.status, 0);
        t.is(test_source.name, 'test source');
        t.is(test_source.id, 'ffmpeg_source');
        t.is(test_source.configurable, true);

        let test_filters: obs.IFilter[] = [];
        let filter_types = obs.FilterFactory.types();

        for (let i = 0; i < iterations; i++) {
            for (let k = 0; k < filter_types.length; ++k) {
                let index = (filter_types.length * i) + k
                let type = filter_types[k];
                let filter =
                    obs.FilterFactory.create(type, `${type} ${i}`);

                console.log(`Index: ${index}`);

                t.is(filter.id, `${type}`);
                t.is(filter.name, `${type} ${i}`);

                t.is(filter.status, 0);
                test_source.addFilter(filter);
                test_filters[index] = filter;

                let found_filter = test_source.findFilter(filter.name);
                t.is(found_filter == null, false);

                filter.release();
                test_source.removeFilter(filter);
            }
        }
        
        test_source.release();
        t.is(test_source.status, 1, "Failed to destroy source");
    });
});