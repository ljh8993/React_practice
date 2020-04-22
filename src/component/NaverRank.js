import React, {useState} from 'react';
import axios from 'axios';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Circle_progress from '../service/circle_progress';

const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
    margin: "4px 0"
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
    border: "1px solid darkgray"
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: "pre-line"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    margin: '10%',
    width: "40%"
  },
}));


export default function NaverRank() {
    const classes = useStyles();
    const [rankList, setRankList] = useState([]);
    const [modalopen, setModalOpen] = useState(false);
    const [circle, setCircle] = useState(false);

    const modalOpenFn = async() => {
        setCircle(true);
        const res = await axios.post('/naver_now_rank', {method: "rank"});
        if (res.status === 200 && res.statusText === "OK") {
            setRankList(res.data.list);
            setCircle(false);
            setModalOpen(true);
        } else {
            setCircle(false);
        }
    }

    const modalCloseFn = () => {
        setModalOpen(false);
    }

    const HtmlTooltip = withStyles((theme) => ({
        tooltip: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 300,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
          whiteSpace: "pre-line"
        },
    }))(Tooltip);

    const tooltipFn = (data) => {
        if (data.length) {
            let str = '';
            data.map(data => (
                str += data + '\n'
            ))
            return str;
        }
    }

    return (
        <>
        {circle && <Circle_progress />}
        <Button className={classes.button} onClick={modalOpenFn}>
            실시간 검색어 확인
        </Button>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalopen}
            onClose={modalCloseFn}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={modalopen}>
            <div className={classes.paper}>
                <h2 id="transition-modal-title">네이버 실시간 검색어</h2>
                <div id="transition-modal-description">{
                    <List className={classes.listRoot} subheader={<li />}>
                        {rankList.map(data => (
                            data.keyword_synonyms.length ? (
                                <HtmlTooltip key={data.rank} title={tooltipFn(data.keyword_synonyms)} placement={"left-start"} enterDelay={400} leaveDelay={100}>
                                    <li className={classes.listSection}>
                                    <ul className={classes.ul}>
                                        {data.rank}. {data.keyword}
                                    </ul>
                                    </li>
                                </HtmlTooltip>
                            ) : (
                                <li key={data.rank} className={classes.listSection}>
                                <ul className={classes.ul}>
                                    {data.rank}. {data.keyword}
                                </ul>
                                </li>
                            )
                        ))}
                    </List>
                }</div>
            </div>
            </Fade>
        </Modal>
        </>
    );
}