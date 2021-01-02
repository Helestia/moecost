import React from 'react';
import TopBar from './components/topBar'
import SearchSection, {tSearchSectionRtnFuncProps} from './components/searchSection'
import ResultSection from './components/resultSection';
import moecostDb,{iApplicationConfig} from './scripts/storage';

import {createMuiTheme,ThemeProvider} from '@material-ui/core/styles';
import CssBaseline                    from '@material-ui/core/CssBaseline';
import Snackbar                       from '@material-ui/core/Snackbar';
import Alert                          from '@material-ui/lab/Alert';

// スナックバーの標準のタイムアウト時間
const defSnackbarTimeout = 5000;

type tSnackbarSeverity = "success" | "warning" | "info" | "error" | undefined;
export type tHandleOpenSnackbar = (variant:tSnackbarSeverity, message:React.ReactNode, timeout?:number|null) => void;

function App() {
// 設定情報
  const [configDisplay,setConfigDisplay] = React.useState<iApplicationConfig>(moecostDb.アプリ設定);
  const [searched, setSearched] = React.useState<tSearchSectionRtnFuncProps>(undefined);

  const [isOpenSnackbar,setIsOpenSnackbar] = React.useState(false);
  const [snackbarSeverity,setSnackbarSeverity] = React.useState<"error" | "warning" | "info" | "success" | undefined>(undefined);
  const [snackbarMessage,setSnackbarMessage] = React.useState<React.ReactNode>(<></>);
  const [snackbarTimeout,setSnackbarTimeout] = React.useState<number|null>(null);

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
          "&:hover": {
            backgroundColor: (configDisplay.表示設定.ダークモード) ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"
          }
        }
      }
    }
  });

  // 検索結果の取得
  const rtnFuncFirstSection = (rtnFuncProp : tSearchSectionRtnFuncProps) => {
    setSearched(rtnFuncProp);
  }

  // 表示設定更新
  const changeAppPreference = () => setConfigDisplay(moecostDb.アプリ設定);

  // メッセージ表示（スナックバー）
  const handleOpenSnackbar:tHandleOpenSnackbar = (status,children,timeout) => {
    setIsOpenSnackbar(true);
    setSnackbarSeverity(status);
    setSnackbarMessage(children);
    if(timeout === undefined) setSnackbarTimeout(defSnackbarTimeout);
    else setSnackbarTimeout(timeout);
  }
  const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if(reason === "clickaway") return;
    setIsOpenSnackbar(false);
  }

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
        rtnFunc={rtnFuncFirstSection} />
      <ResultSection
        searched={searched}
        handleOpenSnackbar={handleOpenSnackbar} />
      <RenderSnackbar
        isOpen={isOpenSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
        timeout={snackbarTimeout}
        onClose={handleCloseSnackbar}
      />
    </ThemeProvider>
  );
}

type tRenderSnackbar = {
  isOpen: boolean
  severity: tSnackbarSeverity,
  message: React.ReactNode,
  timeout: number | null,
  onClose: () => void
}
const RenderSnackbar:React.FC<tRenderSnackbar> = (props) => {
  return (
    <Snackbar
      open={props.isOpen}
      onClose={props.onClose}
      autoHideDuration={props.timeout}
    >
      <Alert
        severity={props.severity}
        onClose={props.onClose}
      >
        {props.message}
      </Alert>
    </Snackbar>
  )
}

export default App;
