import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import * as path from 'path';
import test from 'ava';

test('source creation and destruction', async t => {
    await startup_shutdown(t, (t) => {
        let test_source =
            obs.InputFactory.create('ffmpeg_source', 'test source');

        const iterations = 100;

        t.is(test_source.status, 0);
        t.is(test_source.name, 'test source');
        t.is(test_source.id, 'ffmpeg_source');
        t.is(test_source.configurable, true);

        let test_filters: obs.IFilter[] = [];
        let filter_types = obs.FilterFactory.types();

        for (var i = 0; i < iterations; i++) {
            filter_types.forEach((element) => {
                let filter =
                    obs.FilterFactory.create(element, `${element} ${i}`);

                t.is(filter.id, `${element}`);
                t.is(filter.name, `${element} ${i}`);

                t.is(filter.status, 0);
                test_source.addFilter(filter);
                test_filters.push(filter);

                let found_filter = test_source.findFilter(filter.name);
                t.is(found_filter == null, false);

                filter.release();
            });
        }

        t.is(iterations * filter_types.length, test_filters.length);

        let filter_list_fetch = test_source.filters;
        t.is(filter_list_fetch.length, test_filters.length);

        test_filters.forEach((element, idx) => {
            let index = (i * filter_types.length) + idx;

            test_source.removeFilter(element);

            let removed_filter = test_source.findFilter(element.name);
            t.is(removed_filter, null);
        });

        test_source.release();
        t.is(test_source.status, 1, "Failed to destroy source");
    });
});