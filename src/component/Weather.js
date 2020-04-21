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

const modalStyles = makeStyles((theme) => ({
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
}));

const selectStyles = makeStyles((theme) => ({
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



function Weather() {
    const modalStyle = modalStyles();
    const selectStyle = selectStyles();
    const [n_list, setNameList] = useState([]);
    const [code, setCode] = useState('');
    // modal 이벤트
    const [open, setOpen] = useState(false);
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
    const modalClose = () => {
        setOpen(false);
    };

    const modalOpen = async() => {
        if (!code) {
            toastOpen();
            return;
        }
        setCircle(true);
        let s = code.split(';')
        const res = await axios.post('/weather', {method: "weather_data", code: s[0]});
        if (res.status === 200 && res.statusText === "OK" && res.data.result) {
            const msg = res.data.msg.replace(/<br \/>/gi, "\n\n");
            setTitle(s[1]);
            setContents(msg);
            setCircle(false);
            setOpen(true);
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
            {toast && <Toast msg={"You have to select '도 선택'"}/>}
            {circle && <Circle_progress />}
            <Button className={selectStyle.button} onClick={modalOpen}>
                검색
            </Button>
            <FormControl className={selectStyle.formControl}>
                <InputLabel id="demo-controlled-open-select-label">도 선택</InputLabel>
                <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={code}
                onChange={selectChange}
                >
                <MenuItem value="">
                    <em></em>
                </MenuItem>
                {
                    n_list.map((item) =>
                        (<MenuItem key={item.code} value={item.code + ';' + item.name}><em>{item.name}</em></MenuItem>)
                    )
                }
           
                </Select>
            </FormControl>

            {/* MODAL */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={modalStyle.modal}
                open={open}
                onClose={modalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                <div className={modalStyle.paper}>
                    <h2 id="transition-modal-title">{modalTitle}</h2>
                    <p id="transition-modal-description">{modalContents}</p>
                </div>
                </Fade>
            </Modal>
        </>
    )
}

export default Weather;