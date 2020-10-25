import React from 'react';
import TopBar from './components/topBar'
import SearchSection, {tSearchSectionRtnFuncProps} from './components/searchSection'
import ResultSection from './components/resultSection';
import moecostDb,{iDisplay} from './scripts/storage'

import {createMuiTheme,ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';






function App() {
// 設定情報
  const [configDisplay,setConfigDisplay] = React.useState<iDisplay>(moecostDb.表示設定);
  const [searched, setSearched] = React.useState<tSearchSectionRtnFuncProps>(undefined);
  const theme = createMuiTheme({
    palette : {
      type : (configDisplay?.ダークモード) ? "dark" : "light"
    }
  });

  // 検索結果の取得
  const rtnFuncFirstSection = (rtnFuncProp : tSearchSectionRtnFuncProps) => {
    setSearched(rtnFuncProp);
  }

  // 表示設定更新
  const changeUseDarkMode = async () => {
    setConfigDisplay(moecostDb.表示設定);
  }

  // 初回処理・moecostDbの初期化・ステート取得
  React.useEffect(()=>{
    moecostDb.refleshProperties(() => {
      setConfigDisplay(moecostDb.表示設定);
    })
  },[])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar 
        changeUseDarkMode={changeUseDarkMode} />
      <SearchSection
        rtnFunc={rtnFuncFirstSection} />
      <ResultSection
        searched={searched} />
    </ThemeProvider>
  );
}


















export default App;
