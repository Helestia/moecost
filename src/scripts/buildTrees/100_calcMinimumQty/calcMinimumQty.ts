import { tTreeNodeD_creation } from '../commonTypes';
import { lcmArray } from './001_mathLogic/lcmArray';
import { processMain_getCommonUsage } from './100_processMain_getCommonUsage/processMain_getCommonUsage';
import { processMain_getCreationMultiple} from './110_processMain_getCreationMultiple/processMain_getCreationMultiple';
import { processCommon } from './200_processCommon/processCommon';

type tCalcMinimumQty = (main:tTreeNodeD_creation[],commons:tTreeNodeD_creation[]) => number;
export const calcMinimumQty:tCalcMinimumQty = (main,commons) => {
    const commonUsagesMain = processMain_getCommonUsage(main);
    const creationMultipleMain = processMain_getCreationMultiple(main);

    const creationMultipleMainAndCommon = processCommon(
        commons,
        commonUsagesMain,
        creationMultipleMain
    );
    const AllAmountLcm = lcmArray(creationMultipleMainAndCommon.map(cm => cm.要求数));
    const AllCmATdA = creationMultipleMainAndCommon.map(cm => cm.作成数 * AllAmountLcm / cm.要求数);
    return lcmArray(AllCmATdA) / AllAmountLcm;
}
