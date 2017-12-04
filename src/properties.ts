import * as obs from 'obs-studio-node';
import { startup_shutdown } from '../helpers/startup_shutdown'
import * as path from 'path';
import test from 'ava';

function test_number(details: obs.INumberDetails, t: any) {
    t.true(details.max != undefined);
    t.true(details.min != undefined);
    t.true(details.step != undefined);
    t.true(details.type != undefined);
    t.true(details.type <= obs.ENumberType.Slider);
    t.true(details.type >= 0);
}

function test_editable_list(details: obs.IEditableListDetails, t: any) {
    t.true(details.defaultPath != undefined);
    t.true(details.filter != undefined);
    t.true(details.type != undefined);
    t.true(details.type <= obs.EEditableListType.FilesAndUrls);
    t.true(details.type >= 0);
}

function test_list(details: obs.IListDetails, t: any) {
    t.true(details.format != undefined);
    t.true(details.format <= obs.EListFormat.String);
    t.true(details.format >= 0);
    t.true(details.items != undefined);
}

function test_path(details: obs.IPathDetails, t: any) {
    t.true(details.type != undefined);
    t.true(details.type <= obs.EPathType.Directory);
    t.true(details.type >= 0);
}

function test_text(details: obs.ITextDetails, t: any) {
    t.true(details.type != undefined);
    t.true(details.type <= obs.ETextType.Multiline);
    t.true(details.type >= 0);
}

function test_button(property: obs.IButtonProperty, source: object, t: any) {
    property.buttonClicked(source);
}

function test_property(property: obs.IProperty, source: object, t: any) {
    if (obs.isEditableListProperty(property)) {
        test_editable_list(property.details, t);
        test_list(property.details, t);
    }
    else if (obs.isListProperty(property)) {
        test_list(property.details, t);
    }
    else if (obs.isButtonProperty(property)) {
        test_button(property, source, t);
    }
    else if (obs.isNumberProperty(property)) {
        test_number(property.details, t);
    }
    else if (obs.isPathProperty(property)) {
        test_path(property.details, t);
    }
    else if(obs.isTextProperty(property)) {
        test_text(property.details, t);
    }
    else if (obs.isEmptyProperty(property)) {
        /* No additional information to query */
    }
    else  {
        t.fail(`${property.name} with type ${property.type}`);
    }
}

test('source properties', async t => {
    await startup_shutdown(t, (t) => {
        let plugin_types = obs.InputFactory.types();

        for(let i = 0; i < plugin_types.length; i++) {
            /* dshow has a race condition if we shutdown
               too fast after creating properties. */
            if (plugin_types[i] === "dshow_input")
                continue;

            let source = 
                obs.InputFactory.create(
                    plugin_types[i], 
                    `test ${plugin_types[i]}`
                );
            
            let settings = source.settings;

            /* This test is useful to indicate 
               a quartet of bytes represented as 
               a signed 32-bit integer while still
               being manipulated in javascript. 
               
               0xffffffff is -1 but because it uses
               two's compliment and enforces bit
               consistency, we can assume that whatever
               bits we set will stay set regardless of 
               how the integer is actually represented. */
            if (plugin_types[i] === 'color_source') {
                settings.color = 0xffffffff;
                source.update(settings);
                settings = source.settings;

                t.is(settings.color >>> 24, 0xff);
                t.is(settings.color << 8 >>> 24, 0xff);
                t.is(settings.color << 16 >>> 24, 0xff);
                t.is(settings.color << 24 >>> 24, 0xff);
                t.is(~settings.color, 0);
                t.is(settings.color, -1);
            }

            source.update(settings);
            console.log(settings);

            let properties = source.properties;
            let property = properties.first();
            let nextProperty: obs.IProperty = property.next();

            if (!property) {
                source.release();
                return;
            }

            do {
                console.log(property.name);
                test_property(property, source, t);
            } while (property = property.next());

            source.release();
        }
    });
});