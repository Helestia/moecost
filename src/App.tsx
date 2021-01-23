import React from 'react';

import TopBar         from './components/component/TopbarAndMenus/index';
import SearchSection  from './components/component/searchSection/index';
import ResultSection  from './components/component/resultSection/index';

import RenderSnackbar from './components/commons/snackbar/renderSnackbar';
import useSnackbar    from './components/commons/snackbar/useSnackbar';
import moecostDb,{iApplicationConfig} from './scripts/storage';

import {createMuiTheme,ThemeProvider} from '@material-ui/core/styles';
import CssBaseline                    from '@material-ui/core/CssBaseline';

function App() {
// 設定情報
  const [configDisplay,setConfigDisplay] = React.useState<iApplicationConfig>(moecostDb.アプリ設定);
  const {
    recipe,
    items,
    handleChangeRecipe} = useSearched();
  const {
    snackbarIsOpen,
    snackbarSeverity,
    snackbarMessage,
    snackbarAutoHideDuration,
    handleOpenSnackbar,
    handleCloseSnackbar} = useSnackbar();

  const theme = createMuiTheme({
    palette : {
      type : (configDisplay.表示設定.ダークモード) ? "dark" : "light",
      primary:{
        main: (configDisplay.表示設定.ダークモード) ? "#78f" : "#34b",
        light:(configDisplay.表示設定.ダークモード) ? "#9af" : "#56d",
        dark: (configDisplay.表示設定.ダークモード) ? "#56d" : "#12a",
      }
    },
    typography : {
      fontSize: 14,
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
    },
    overrides:{
      MuiAccordionSummary:{
        root: {
          minHeight: "40px",
          "&:hover": {
            backgroundColor: (configDisplay.表示設定.ダークモード) ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"
          }
        },
        content: {
          margin:"8px 0"
        },
        expandIcon: {
          padding: "8px"
        }
      }
    }
  });

  // 表示設定更新
  const changeAppPreference = () => setConfigDisplay(moecostDb.アプリ設定);


  // 初回処理・moecostDbの初期化・ステート取得
  React.useEffect(()=>{
    moecostDb.refleshProperties(() => {
      setConfigDisplay(moecostDb.アプリ設定);
    })
  },[]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar 
        changeAppPreference={changeAppPreference}
        handleOpenSnackbar={handleOpenSnackbar} />
      <SearchSection
        handleChangeRecipe={handleChangeRecipe} />
      <ResultSection
        recipe={recipe}
        items={items}
        handleOpenSnackbar={handleOpenSnackbar} />
      <RenderSnackbar
        isOpen={snackbarIsOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        timeout={snackbarAutoHideDuration}
        onClose={handleCloseSnackbar}
      />
    </ThemeProvider>
  );
}

type tUseSearched = () => {
  recipe:string,
  items:string[],
  handleChangeRecipe:(recipe:string,createItems:string[]) => void
}
const useSearched:tUseSearched = () => {
  const [recipe,setRecipe] = React.useState("");
  const [items,setCreateItems] = React.useState<string[]>([]);

  const handleChangeRecipe = (recipe:string,items:string[]) => {
    setRecipe(recipe);
    setCreateItems(items);
  }

  return {
    recipe:recipe,
    items:items,
    handleChangeRecipe:handleChangeRecipe
  }
}

export default App;
