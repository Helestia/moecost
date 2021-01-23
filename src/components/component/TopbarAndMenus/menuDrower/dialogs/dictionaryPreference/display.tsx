import React from 'react';

import useStyleAutocomplete         from './hooks/useStyleAutocomplete';
import useSelectorDictionaryName    from './hooks/useSelectorDictionaryName';

import Accordion                from '../../../../../commons/accordion/accordion';

import moecostDb,{iDictionary}  from '../../../../../../scripts/storage';
import {numDeform}              from '../../../../../../scripts/common';

import Autocomplete     from '@material-ui/lab/Autocomplete'
import Box              from '@material-ui/core/Box';
import TableContainer   from '@material-ui/core/TableContainer';
import Table            from '@material-ui/core/Table';
import TableHead        from '@material-ui/core/TableHead';
import TableBody        from '@material-ui/core/TableBody';
import TableRow         from '@material-ui/core/TableRow';
import TableCell        from '@material-ui/core/TableCell';
import Typography       from '@material-ui/core/Typography';
import TextField        from '@material-ui/core/TextField';
import Paper            from '@material-ui/core/TableContainer';
import {
    makeStyles,
    createStyles,
    Theme,
    useTheme}           from '@material-ui/core/styles';

const useStylesDisplayTable = makeStyles((theme:Theme) => createStyles({
    tableRoot:{
        maxHeight:"50vh",
        overflowY:"scroll"
    },
    create:{
        backgroundColor: (theme.palette.type === "light") ? "#fcc" : "#300"
    },
    user:{
        backgroundColor: (theme.palette.type === "light") ? "#cff" : "#033"
    },
    npc:{
        backgroundColor: (theme.palette.type === "light") ? "#cfc" : "#030"
    }
}));

type tDisplayDictionaryProps = {
    isExpanded: boolean,
    isLoading: boolean,
    usingDictionary: string,
    dictionaryNames: string[],
    onChange: () => void,
}
const DisplayDictionary:React.FC<tDisplayDictionaryProps> = (props) => {
    const selectorHook = useSelectorDictionaryName(props.dictionaryNames,props.usingDictionary);
    const [dictionaryData,setDictionaryData] = React.useState<iDictionary|null>(null);
    const classesTable = useStylesDisplayTable();
    const classesAutoComplete = useStyleAutocomplete();
    const theme = useTheme();

    if(dictionaryData === null || dictionaryData.辞書名 !== selectorHook.value) retrieveDictionary(selectorHook.value);

    async function retrieveDictionary(dictionaryName:string) {
        const d = await moecostDb.retrieveDictionary(dictionaryName);
        setDictionaryData(d);
    }
    
    const initialize = () => {
        selectorHook.initialize();
        retrieveDictionary(props.usingDictionary);
    }

    const renderTable = () => {
        if(dictionaryData === null) return null;
        return (
            <TableContainer
                component={Paper}
                className={classesTable.tableRoot}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>アイテム名</TableCell>
                            <TableCell>調達方法</TableCell>
                            <TableCell>価格／レシピ名</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dictionaryData.内容.map(d => {
                            const key = `DisplayDictionary_${d.アイテム}`
                            switch(d.調達方法){
                                case "生産":
                                    return (
                                        <TableRow key={key}>
                                            <TableCell  className={classesTable.create}>{d.アイテム}</TableCell>
                                            <TableCell>生産</TableCell>
                                            <TableCell align="left">{d.レシピ名}</TableCell>
                                        </TableRow>
                                    );
                                case "自力調達":
                                    return (
                                        <TableRow key={key}>
                                            <TableCell  className={classesTable.user}>{d.アイテム}</TableCell>
                                            <TableCell>自力調達</TableCell>
                                            <TableCell align="right">{numDeform(d.調達価格)}</TableCell>
                                        </TableRow>
                                    );
                                default:
                                    return (
                                        <TableRow key={key}>
                                            <TableCell className={classesTable.npc}>{d.アイテム}</TableCell>
                                            <TableCell>NPC購入</TableCell>
                                            <TableCell align="center">-</TableCell>
                                        </TableRow>
                                    );
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <Accordion
            expanded={props.isExpanded}
            onChange={props.onChange}
            summary={<Typography>辞書内容の確認</Typography>}
            disabled={props.isLoading}
            initialize={initialize}
        >
            <Box width="100%">
                <Box
                    className={classesAutoComplete.root}
                    marginY={`${theme.spacing(1)}px`}
                >
                    <Autocomplete
                        options={props.dictionaryNames}
                        getOptionLabel={option => option}
                        onChange={selectorHook.handleChange}
                        onInputChange={selectorHook.handleChangeInput}
                        value={selectorHook.value}
                        inputValue={selectorHook.inputValue}
                        renderInput={(params) => <TextField {...params} label="辞書名"/>}
                    />
                </Box>
                <Box marginY={`${theme.spacing(1)}px`}>
                    {renderTable()}
                </Box>
            </Box>
        </Accordion>
    )
}

export default DisplayDictionary;
