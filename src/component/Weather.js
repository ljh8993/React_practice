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
      margin: '10%'
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginLeft: "25%",
        border: "1px solid darkgray"
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}));

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

    const modalOpenFn = async() => {
        if (!code) {
            if (toast) return;
            toastOpen();
            return;
        }
        setToast(false);
        setCircle(true);
        let s = code.split(';')
        const res = await axios.post('/weather', {method: "weather_data", code: s[0]});
        if (res.status === 200 && res.statusText === "OK" && res.data.result) {
            const msg = res.data.msg.replace(/<br \/>/gi, "\n\n");
            setTitle(s[1]);
            setContents(msg);
            setCircle(false);
            setModalOpen(true);
        } else {
            setCircle(false);
        }
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
            <Toast open={toast} msg={"You have to select '지역 선택'"}/>
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
            <Button className={classes.button} onClick={modalOpenFn}>
                검색
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
                    <p id="transition-modal-description">{modalContents}</p>
                </div>
                </Fade>
            </Modal>
        </>
    )
}

