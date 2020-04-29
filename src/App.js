import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Slide
} from '@material-ui/core'
import {
  ExposureOutlined,
  WbSunnyOutlined,
  Search,
  BusinessOutlined,
  MenuOutlined,
  BorderClearOutlined,
  Home
} from '@material-ui/icons';

// component made by jooha
import Weather from './component/Weather';
import NaverRank from './component/NaverRank';
import Omok from './component/Omok';
import MapAddress from './component/MapAddress';
import Calculator from './component/Calculator';
import Toast from './service/toast';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 320
  },
  body: {

  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const lists = [
  {title: "HOME", component: '', icon: <Home />},
  {title: "날씨 확인", component: <Weather />, icon: <WbSunnyOutlined />},
  {title: "실시간 검색어 확인", component: <NaverRank />, icon: <Search />},
  {title: "오목 게임", component: <Omok />, icon: <BorderClearOutlined />},
  {title: "주소 찾기", component: <MapAddress />, icon: <BusinessOutlined />},
  {title: "계산기", component: <Calculator />, icon: <ExposureOutlined />}
];

function idInCookie() {
  const c = document.cookie.match('(^|;) ?_id=([^;]*)(;|$)');
  return c ? c[2] : false;
}

function deleteCookie (name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}

function App() {
  const classes = useStyles();
  const [leftMenu, setLeftMenu] = useState(false);
  const [main, setMain] = useState({title: lists[0].title, component: lists[0].component});
  const [logged_in, setLogged_in] = useState(false);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [toast, setToast] = useState({open: false, msg: ''});

  const [signupData, setSignupData] = useState({id: '', pwd1: '', pwd2: '', name: '', phone: ''});
  const [loginData, setLoginData] = useState({id: '', pwd: ''});

  useEffect(() => {
    const cookie_chk = idInCookie();
    if (cookie_chk) {
      setLoginData({
        ...loginData,
        id: cookie_chk
      });
    }
  }, []);

  const toggleDrawer = (_open) => (e) => {
    if (!logged_in || !idInCookie()) return false;
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setLeftMenu(_open);
  }

  const paging = (li) => {
    setMain({
      ...main,
      title: li.title,
      component: li.component
    })
  }

  const leftMenus = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {lists.map(li => (
          <ListItem  button divider key={li.title} onClick={() => paging(li)} >
            <ListItemIcon>{li.icon}</ListItemIcon>
            <ListItemText primary={li.title}/>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const loginBtn = () => {
    setDialog(true);
    if (signup) {
      setSignup(false);
    }
    setLogin(true);
  }

  const signupBtn = () => {
    setDialog(true);
    if (login) {
      setLogin(false);
    }
    setSignup(true);
  }

  const logoutBtn = async() => {
    // const res = await axios.post('/logout', {"id": id});
    // if (res.status === 200 && res.statusText === "OK" && res['result']) {
    //   const date = new Date();
    //   date.setDate(date.getDate() - 1);
    //   let cooks = "_id=" + id;
    //   cooks += "Expires=" + date.toUTCString();
    //   document.cookie=cooks;
    //   setLogged_in(false);
    //   toastFn("로그아웃 되었습니다.");
    // }
    deleteCookie("_id");
    setLogged_in(false);
    toastFn("로그아웃 되었습니다.");
  }


  const toastFn = (msg) => {
    setToast({
      ...toast,
      open: true,
      msg: msg
    });
    setTimeout(() => {
      setToast({
        ...toast,
        open: false,
        msg: msg
      });
    }, 3000);
  }

  const startDialog = async() => {
    if (login) {
      const res = await axios.post('/login', loginData);
      if (res.status === 200 && res.statusText === "OK") {
        const d = res.data;
        if (d['result']) {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          document.cookie=`_id=${d['id']};expires=${date.toUTCString()};path=/;`;
          setLogged_in(true);
          toastFn(d['msg']);
          handleClose();
          return;
        }
        alert(d['msg']);
      }
    }
    else if (signup) {
      if (signupData.phone.length > 11) {
        alert("이동전화번호를 확인해주세요.");
        return;
      }
      const res = await axios.post('/signup', signupData);
      if (res.status === 200 && res.statusText === "OK") {
        const d = res.data;
        if (!d['result']) {
          alert(d['msg']);
        } else {
          toastFn(d['msg']);
          handleClose();
        }
      }
    }
  }

  const handleClose = () => {
    setDialog(false);
    setSignupData({id: '', pwd1: '', pwd2: '', name: '', phone: ''});
    setLoginData({id: '', pwd: ''});
  }

  const handlerChange = (e) => {
    const t = e.target;
    if (login) {
      setLoginData({...loginData, [t.name]: t.value});
    } else if (signup) {
      setSignupData({...signupData, [t.name]: t.value});
    }
  }

  return (
    <div>
      <Toast open={toast.open} msg={toast.msg}/>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuOutlined />
            </IconButton>
            <SwipeableDrawer
              open={leftMenu}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {leftMenus()}
            </SwipeableDrawer>
            <Typography variant="h6" className={classes.title}>
              {main.title}
            </Typography>
            {
              !logged_in
              ? (<>
              <Button color="inherit" onClick={loginBtn}>LOGIN</Button>
              <Button color="inherit" onClick={signupBtn}>SIGN-UP</Button>
              </>)
              : (<Button color="inherit" onClick={logoutBtn}>LOG-OUT</Button>)
            }
            
          </Toolbar>
        </AppBar>
      </div>
      <div className={"App_body"}>
        {main.component}
      </div>

      <Dialog open={dialog}
        TransitionComponent={Transition}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {
            !signup && login
            ? "로그인"
            : "회원가입"
          }
        </DialogTitle>
        <DialogContent>
          {
            !signup && login
            ? (<>
              <TextField margin="dense" autoFocus type="text" name="id" label="아이디" value={loginData.id} onChange={handlerChange} /><br/>
              <TextField type="password" name="pwd" label="비밀번호" value={loginData.pwd} onChange={handlerChange} />
            </>)
            : (<>
              <TextField autoFocus type="text" name="id" label="아이디" value={signupData.id} onChange={handlerChange} /><br/>
              <TextField type="text" name="name" label="이름" value={signupData.name} onChange={handlerChange} /><br/>
              <TextField type="password" name="pwd1" label="비밀번호" value={signupData.pwd1} onChange={handlerChange} /><br/>
              <TextField type="password" name="pwd2" label="비밀번호 확인" value={signupData.pwd2} onChange={handlerChange} /><br/>
              <TextField type="number" name="phone" label="휴대전화 번호" value={signupData.phone} onChange={handlerChange} />
            </>) 
          }
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={startDialog} color="primary">
            {
              !signup && login
              ? "로그인"
              : "회원가입"
            }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
