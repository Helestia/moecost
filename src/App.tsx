import React from 'react';
// import {ConfigSection,tConfigSectionProps} from './compponents/configSection'
import SerchSection, {tSerchSectionRtnFuncProps} from './components/searchSection'
import {retrieveDisplay,defaultStrage,iDisplay} from './scripts/storage'
import {createMuiTheme,ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';







function App() {
// 設定情報
  const [configDsiplay,setConfigDisplay] = React.useState<iDisplay>(defaultStrage.表示設定);
  const [searched, setSearched] = React.useState<tSerchSectionRtnFuncProps>(undefined);
  // 表示設定取得
  const init = async() => {
    setConfigDisplay(await retrieveDisplay());
  }
  const theme = createMuiTheme({
    palette : {
      type : "light"
    }
  });
  




  // 検索結果の取得
  const rtnFuncFirstSection = (rtnFuncProp : tSerchSectionRtnFuncProps) => {
    setSearched(rtnFuncProp);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
{/*      <ConfigSection 
        rtnFunc={rtnFuncConfigSection} />*/}
      <SerchSection
        rtnFunc={rtnFuncFirstSection} />
    </ThemeProvider>
  );
}


















export default App;
