import React, { useState } from 'react';
import './App.css';

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
  // Button
} from '@material-ui/core'
import {
  ExposureOutlined,
  WbSunnyOutlined,
  Search,
  BusinessOutlined,
  MenuOutlined,
  BorderClearOutlined
} from '@material-ui/icons';

// component made by jooha
import Weather from './component/Weather';
import NaverRank from './component/NaverRank';
import Omok from './component/Omok';
import MapAddress from './component/MapAddress';
import Calculator from './component/Calculator';

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

const lists = [
  {title: "날씨 확인", component: <Weather />, icon: <WbSunnyOutlined />},
  {title: "실시간 검색어 확인", component: <NaverRank />, icon: <Search />},
  {title: "오목 게임", component: <Omok />, icon: <BorderClearOutlined />},
  {title: "주소 찾기", component: <MapAddress />, icon: <BusinessOutlined />},
  {title: "계산기", component: <Calculator />, icon: <ExposureOutlined />}
];

function App() {
  const classes = useStyles();
  const [leftMenu, setLeftMenu] = useState(false);
  const [compos, setCompos] = useState(lists[0].component);
  const [title, setTitle] = useState(lists[0].title);

  const toggleDrawer = (_open) => (e) => {
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setLeftMenu(_open);
  }

  const paging = (li) => {
    setTitle(li.title);
    setCompos(li.component);
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

  return (
    <div>
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
              {title}
            </Typography>
            {/* <Button color="inherit" onClick={() => loginFn}>LOGIN</Button> */}
          </Toolbar>
        </AppBar>
      </div>
      <div className={"App_body"}>
        {compos}
      </div>
    </div>
  );
}

export default App;
