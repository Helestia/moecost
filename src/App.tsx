import React from 'react';
import TopBar from './components/topBar'
import SearchSection, {tSerchSectionRtnFuncProps} from './components/searchSection'
import moecostDb from './scripts/storage'
import {createMuiTheme,ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';







function App() {
// 設定情報
  const [isDarkMode,setIsDarkMode] = React.useState<boolean|undefined>(undefined);
  const [searched, setSearched] = React.useState<tSerchSectionRtnFuncProps>(undefined);
  const theme = createMuiTheme({
    palette : {
      type : (isDarkMode) ? "dark" : "light"
    }
  });

  // 検索結果の取得
  const rtnFuncFirstSection = (rtnFuncProp : tSerchSectionRtnFuncProps) => {
    setSearched(rtnFuncProp);
  }

  // 表示設定更新
  const changeUseDarkMode = async () => {
    setIsDarkMode(moecostDb.表示設定.ダークモード);
  }

  // 初回設定
  if(isDarkMode === undefined){
    moecostDb.refleshProperties(()=>{
      setIsDarkMode(moecostDb.表示設定.ダークモード)
    })
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar 
        changeUseDarkMode={changeUseDarkMode} />
      <SearchSection
        rtnFunc={rtnFuncFirstSection} />
    </ThemeProvider>
  );
}


















export default App;
