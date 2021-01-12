import React from 'react';
import {tTabState} from './tabs'

const useTabs = (initSelected:string, tabs:tTabState[]) => {
    const [selected,setSelected] = React.useState(initSelected);

    const initialize = () => {
        console.log(initSelected);
        setSelected(initSelected);
    }
    const handleChange = (event:React.ChangeEvent<{}>, selectedValue:string) => {
        const selectedTab = tabs.find(tab => tab.value === selectedValue);
        if(selectedTab === undefined) return;
        if(selectedTab.disabled) return;
        setSelected(selectedValue);
    }
    return {
        selected:selected,
        handleChange:handleChange,
        initialize:initialize
    }
}

export default useTabs;
