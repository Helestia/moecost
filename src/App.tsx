import React from 'react';
// import {ConfigSection,tConfigSectionProps} from './compponents/configSection'
import {SerchSection,tSerchSectionRtnFuncProps} from './components/searchSection'
import {retrieveDisplay,defaultStrage,iDisplay} from './scripts/storage'







function App() {
// 設定情報
  const [configDsiplay,setConfigDisplay] = React.useState<iDisplay>(defaultStrage.表示設定);
  const [searched, setSearched] = React.useState<tSerchSectionRtnFuncProps>(undefined);
  // 表示設定取得
  const init = async() => {
    setConfigDisplay(await retrieveDisplay());
  }
  
  




  // 検索結果の取得
  const rtnFuncFirstSection = (rtnFuncProp : tSerchSectionRtnFuncProps) => {
    setSearched(rtnFuncProp);
  }
  // 副作用(テーマcssの切り替え)
//  React.useEffect(() => {
//    if(dark)
//  })
  return (
    <>
{/*      <ConfigSection 
        rtnFunc={rtnFuncConfigSection} />*/}
      <SerchSection
        rtnFunc={rtnFuncFirstSection} />
    </>
  );
}


















export default App;
