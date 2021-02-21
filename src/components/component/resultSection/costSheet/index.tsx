import React from 'react';
import {
    tMaterial,
    tByproduct,
    tDurability,
    tSurplus,
    tCreation, 
    tNoLostItem}        from '../../../../scripts/makeListArrayFromTree';
import Accordion        from '../../../commons/accordion/accordion';

import MaterialTable    from './materialTable';
import ByproductTable   from './byproductTable';
import SurplusTable     from './surplusTable';
import DurabilityTable  from './durabilityTable';
import NoLostTable      from './nolostTable';
import CreationTable    from './creationTable';

import Box          from '@material-ui/core/Box';
import Button       from '@material-ui/core/Button';
import Typography   from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme:Theme) => createStyles({
    button: {
        marginTop:theme.spacing(2)
    }
}));

type tRenderCostSheet= {
    isExpanded: boolean,
    creations: tCreation[],
    materials: tMaterial[],
    durabilities: tDurability[],
    surpluses: tSurplus[],
    byproducts: tByproduct[],
    noLostItems: tNoLostItem[],
    handleExpand: () => void,
    changeTrashItemsSurpluses : (newItems:string[]) => void,
    changeTrashItemsByproducts : (newItems:string[]) => void,
    changeTrashItemsNoLost:(newItems:string[]) => void,
    handleItemClick: (itemName:string) => void,
    handleOpenQtyDialog: () => void
}

const CostSheet:React.FC<tRenderCostSheet> = (props) => {
    const classes = useStyles();

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.handleExpand}
            summary={<Typography component="span" variant="h6">原価表</Typography>}
        >
            <Box width="100%">
                <MaterialTable
                    materials={props.materials}
                    creations={props.creations}
                    handleItemClick={props.handleItemClick}
                />
                <ByproductTable
                    byproducts={props.byproducts}
                    handleItemClick={props.handleItemClick}
                    changeTrashItemsByproducts={props.changeTrashItemsByproducts}
                />
                <SurplusTable
                    surpluses={props.surpluses}
                    handleItemClick={props.handleItemClick}
                    changeTrashItemsSurpluses={props.changeTrashItemsSurpluses}
                />
                <DurabilityTable
                    durabilities={props.durabilities}
                    handleItemClick={props.handleItemClick}
                />
                <NoLostTable
                    noLostItems={props.noLostItems}
                    handleItemClick={props.handleItemClick}
                    changeTrashItemsNoLost={props.changeTrashItemsNoLost}
                />
                <CreationTable
                    creations={props.creations}
                    handleItemClick={props.handleItemClick}
                />
                <Button
                    variant="outlined"
                    onClick={props.handleOpenQtyDialog}
                    className={classes.button}
                >
                    作成個数の変更
                </Button>
            </Box>
        </Accordion>
    )
}

export default CostSheet;
