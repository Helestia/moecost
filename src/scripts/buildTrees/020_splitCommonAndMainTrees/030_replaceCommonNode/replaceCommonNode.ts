import { tTreeNodeD_creation } from '../../commonTypes';
import { replaceCommonNode_creation } from './replaceCommonNode_creation';

type tReplaceCommonNode = (
    main: readonly tTreeNodeD_creation[],
    splitTargets: readonly string[]
) => tTreeNodeD_creation[];
export const replaceCommonNode:tReplaceCommonNode = (main,splitTargets) => {
    return main.map((node) => replaceCommonNode_creation(node, splitTargets));
}
