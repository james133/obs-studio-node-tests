import 'mocha'
import { expect } from 'chai'
import * as osn from 'obs-studio-node';
import { OBSProcessHandler } from '../util/obs_process_handler'

interface IPerformanceState {
    CPU: number;
    numberDroppedFrames: number;
    percentageDroppedFrames: number;
    bandwidth: number;
    frameRate: number;
}

type OBSHotkey = {
    ObjectName: string;
    ObjectType: osn.EHotkeyObjectType;
    HotkeyName: string;
    HotkeyDesc: string;
    HotkeyId: number;
};

describe('nodebs_api', () => {
    let obs: OBSProcessHandler;
    let obsHotkeys: OBSHotkey[];
    
    before(function() {
        obs = new OBSProcessHandler();
        
        if (obs.startup() != true)
        {
            throw new Error("Could not start OBS process. Aborting!")
        }
    });

    after(function() {
        obs.shutdown();
        obs = null;
    });

    context('# OBS_API_getPerformanceStatistics', () => {
        it('should fill stats object', () => {
            let stats: IPerformanceState;

            try {
                stats = osn.NodeObs.OBS_API_getPerformanceStatistics();
            } catch(e) {
                throw new Error("OBS_API_getPerformanceStatistics threw an expection");
            }
            
            expect(stats.CPU).to.not.equal(undefined);
            expect(stats.bandwidth).to.not.equal(undefined);
            expect(stats.frameRate).to.not.equal(undefined);
            expect(stats.numberDroppedFrames).to.not.equal(undefined);
            expect(stats.percentageDroppedFrames).to.not.equal(undefined);
        });
    });

    context('# OBS_API_QueryHotkeys', () => {
        it('should get all hotkeys', () => {
            try {
                obsHotkeys = osn.NodeObs.OBS_API_QueryHotkeys();
            } catch(e) {
                throw new Error("OBS_API_QueryHotkeys threw an expection");
            }
        });
    });

    context('# OBS_API_ProcessHotkeyStatus', () => {
        it('should process all hot keys gotten previously', () => {
            let hotkeyId: any;
            let isKeyDown: boolean;

            for (hotkeyId in obsHotkeys) {
                try {
                    osn.NodeObs.OBS_API_ProcessHotkeyStatus(hotkeyId, isKeyDown);
                } catch(e) {
                    throw new Error("hotkeyId " + hotkeyId + "does not exist");
                }
            }
        });

        it('should throw error if hot key id does not exist', () => {
            let isKeyDown: boolean;

            expect(function() {
                osn.NodeObs.OBS_API_ProcessHotkeyStatus(99999, isKeyDown);
            }).to.throw();
        });
    });
});
