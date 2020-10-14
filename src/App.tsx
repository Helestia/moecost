import React, {useState,useEffect} from 'react';
// import {ConfigSection,tConfigSectionProps} from './compponents/configSection'
import {SerchSection,tSerchSectionProps} from './compponents/searchSection'
import {initialize} from './scripts/storage'

type searched = {
  レシピ名 : string,
  生成アイテム : string[]
} | undefined

export type iConfigDisplay = {
  簡易表示 : boolean,
  ダークモード : boolean,
  初期非表示設定 :{
      概要 : boolean,
      生成アイテム一覧 : boolean,
      素材_余剰生産品_副産物一覧 : boolean,
      生産ツリー : boolean
  }
}

const defaultConfigDsiplay:iConfigDisplay = {
  簡易表示 : false,
  ダークモード : false,
  初期非表示設定 :{
      概要 : false,
      生成アイテム一覧 :false,
      素材_余剰生産品_副産物一覧 :false,
      生産ツリー :false
  }
}


function App() {
// 設定情報
  const [darkMode,setDarkMode] = useState<iConfigDisplay>(defaultConfigDsiplay);

  const [searched, setSearched] = useState<searched>(undefined);

  const resetInitialize = () => {
    initialize().then(result => {

    


    });
  }
  const rtnFuncFirstSection = (rtnFuncProp : searched) => {
    setSearched(rtnFuncProp);
  }
  // 副作用(テーマcssの切り替え)
//  useEffect(() => {
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
















/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

export default App;
