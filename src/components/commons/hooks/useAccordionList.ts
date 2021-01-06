import React from 'react';

type tUseAccordionListReturn = {
    isExpandeds :boolean[],
    handleChangeAccordions: (index:number) => void,
    expandInitialize: () => void
}
type tUseAccordionList = (type:"accordion" | "unitExpand", length:number,expanded?:boolean[]) => tUseAccordionListReturn;
const useAccordionList:tUseAccordionList = (type,length,initExpanded) => {
    const [expanded,setExpanded] = React.useState<boolean[]>(calcUseState);

    function calcUseState () {
        const allFalse = (() => new Array<boolean>(length).fill(false));
        if(initExpanded === undefined) return allFalse();
        if(initExpanded.length !== length) return allFalse();
        return initExpanded.concat();
    }

    const handleChangeAccordion = (index:number) => {
        const newExpanded = expanded.map((b,i) => {
            if(i !== index) return false;
            else return (! b);
        });
        setExpanded(newExpanded);
    }

    const handleChangeUnitExpand = (index:number) => {
        const newExpanded = expanded.concat();
        newExpanded[index] = ! newExpanded[index];
        setExpanded(newExpanded);
    }

    const expandInitialize = () => setExpanded(calcUseState);

    return {
        isExpandeds :expanded,
        handleChangeAccordions: (type === "accordion") ? handleChangeAccordion : handleChangeUnitExpand,
        expandInitialize:expandInitialize
    }
}

export default useAccordionList;
