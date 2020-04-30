import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Circle_progress from '../service/circle_progress';
import Toast from '../service/toast';

const useStyles = makeStyles((theme) => ({
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
      maxHeight: "85%",
      minWidth: "360px",
      overflowY: "auto"
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
        border: "1px solid darkgray"
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}));

function dateFormatting(d) {
    const d_split = d.split(' ');
    const d_s = d_split[0].split('-');
    const date = `${d_s[0]}년${d_s[1]}월${d_s[2]}일 ${d_split[1].split(':')[0]}시`;
    return date;
}

function htmlReturn(li) {
    return(
        <div id="transition-modal-description">
            {li.map(l => (
                <>
                <h3>{l.city}</h3>
                {l.data.map(d => (
                    <>
                    <div>{dateFormatting(d.time)} ({d.text})</div>
                    <div>최저/최고 : {d.min}℃ / {d.max}℃</div><br/>
                    </>
                ))}
                </>
            ))}
        </div>
    );
}

export default function Weather() {
    const classes = useStyles();
    const [n_list, setNameList] = useState([]);
    const [code, setCode] = useState('');
    // modal 이벤트
    const [modalopen, setModalOpen] = useState(false);
    const [modalTitle, setTitle] = useState('');
    const [modalContents, setContents] = useState('');
    // 로딩 제어
    const [circle, setCircle] = useState(false);
    // 토스트 제어
    const [toast, setToast] = useState(false);

    useEffect(() => {
        get_cityName().then(res => setNameList(res.list))
        .catch(err => console.log(err));
    }, []);


    const get_cityName = async() => {
        const res = await axios.post('/weather', {method: "city_list"});
        if (res.status === 200 && res.statusText === "OK") {
            return res.data;
        }
        return {list: []}
    }
    

    const selectChange = (e) => {
        setCode(e.target.value);
    };

    // modal
    const modalCloseFn = () => {
        setModalOpen(false);
    };

    const modalOpenFn = async(text) => {
        if (!code) {
            if (toast) return;
            toastOpen();
            return;
        }
        if (toast) setToast(false);

        setCircle(true);
        setContents(''); setTitle('');
        const s = code.split(';');
        const res = await axios.post('/weather', {method: "weather_data", code: s[0], select: text});
        if (res.status === 200 && res.statusText === "OK" && res.data.result) {
            const d = res.data;
            setTitle(s[1]);
            if (d.sel === "list") {
                const html = htmlReturn(d.data);
                setContents(html);
            } else if (d.sel === "all") {
                const msg = d.data.replace(/<br \/>/gi, "\n\n");
                setContents(
                    <p id="transition-modal-description">{msg}</p>
                );
            }
            setModalOpen(true);
        }
        setCircle(false);
    };
    //////

    const toastOpen = () => {
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }
    
    return (
        <>
            <Toast open={toast} msg={"지역을 선택해주세요."}/>
            {circle && <Circle_progress />}
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">지역 선택</InputLabel>
                <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={code}
                onChange={selectChange}
                >
                <MenuItem value=""></MenuItem>
                {
                    n_list.map(item =>
                        (<MenuItem key={item.code} value={item.code + ';' + item.name}>{item.name}</MenuItem>)
                    )
                }
           
                </Select>
            </FormControl>
            <Button className={classes.button} onClick={() => modalOpenFn("list")}>
                도시 별 상세 날씨 리스트 (7일)
            </Button>
            <Button className={classes.button} onClick={() => modalOpenFn("all")}>
                전체적인 날씨
            </Button>

            {/* MODAL */}
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
                    <h2 id="transition-modal-title">{modalTitle}</h2>
                    {modalContents}
                </div>
                </Fade>
            </Modal>
        </>
    )
}

