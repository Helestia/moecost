import React from 'react';
import TopBar from './components/topBar'
import SearchSection, {tSearchSectionRtnFuncProps} from './components/searchSection'
import ResultSection from './components/resultSection';
import moecostDb,{iApplicationConfig} from './scripts/storage'

import {createMuiTheme,ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';


function App() {
// 設定情報
  const [configDisplay,setConfigDisplay] = React.useState<iApplicationConfig>(moecostDb.アプリ設定);
  const [searched, setSearched] = React.useState<tSearchSectionRtnFuncProps>(undefined);
  const theme = createMuiTheme({
    palette : {
      type : (configDisplay.表示設定.ダークモード) ? "dark" : "light"
    },
    typography : {
      fontSize: 14
    },
    props:{
      MuiTextField: {
        variant: "outlined"
      },
      MuiCheckbox: {
        color: "primary"
      },
      MuiSwitch: {
        color: "primary"
      },
      MuiRadio: {
        color: "primary",
        size: "small"
      },
      MuiTable: {
        size: (configDisplay.表示設定.smallテーブル) ? "small" : "medium"
      },
      MuiList:{
        dense: (configDisplay.表示設定.smallテーブル) ? true : false
      },
      MuiPaper: {
        variant: "outlined"
      }
    }
  });

  // 検索結果の取得
  const rtnFuncFirstSection = (rtnFuncProp : tSearchSectionRtnFuncProps) => {
    setSearched(rtnFuncProp);
  }

  // 表示設定更新
  const changeDisplayConfig = () => {
    setConfigDisplay(moecostDb.アプリ設定);
  }

  // 初回処理・moecostDbの初期化・ステート取得
  React.useEffect(()=>{
    moecostDb.refleshProperties(() => {
      setConfigDisplay(moecostDb.アプリ設定);
    })
  },[])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar 
        changeDisplayConfig={changeDisplayConfig} />
      <SearchSection
        rtnFunc={rtnFuncFirstSection} />
      <ResultSection
        searched={searched} />
    </ThemeProvider>
  );
}


















export default App;
