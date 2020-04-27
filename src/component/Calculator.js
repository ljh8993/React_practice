import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Toast from '../service/toast';
import {
    Button,
    Tooltip,
    Input,
    IconButton
} from '@material-ui/core';
import {
    ExpandLess,
    Clear,
    Add,
    Remove,
    ArrowBack
}from '@material-ui/icons';

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      input: {
        textAlign: "right",
        padding: "6px",
        margin: "6px",
        backgroundColor: "#80808017"
      },
    },
  },
});

const useStyles = makeStyles(() => ({
    frameSt : {
        border: "1px solid darkgray",
        borderRadius: "10px"
    },
    textTransUnset: {
        textTransform: "unset"
    }
}));

function replaceAll(str) {
    try {
        if (str.indexOf('xx') > -1) {
            return false;
        }
        return eval(str.replace(/÷/g, '/').replace(/\^/g, '**').replace(/x/g, '*'));
    } catch { return false; }
}

export default function Calculator() {
    const [inputVal, setInputVal] = useState('');
    const [toast, setToast] = useState(false);
    const classes = useStyles();

    const clicked = (num) => {
        if (num === '←') {
            if (inputVal === '') return;
            setInputVal(inputVal.substr(0, inputVal.length-1));
        }
        else if (num === '=') {
            const res = replaceAll(inputVal);
            if (res === false) {
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 3000);
            } else {
                setInputVal(''+res);
            }
        } else {
            setInputVal(inputVal+num);
        }
    }

    const li = [
        ['7','8','9',['←', '취소', <ArrowBack />], ['^', '제곱', <ExpandLess />]],
        ['4','5','6',['+','더하기', <Add />], ['-', '빼기', <Remove />]],
        ['1','2','3',['x', '곱하기', <Clear />], ['÷', '나누기']],
        ['0','.','=',]
    ];
    return (
    <>
        <Toast open={toast} direction="bottom" msg={"올바른 식을 작성해주세요."}/>
        <div className={classes.frameSt}>
            <table>
                <thead>
                    <tr>
                        <td colSpan="5">
                            <ThemeProvider theme={theme}>
                                <Input fullWidth readOnly value={inputVal}/>
                            </ThemeProvider>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {li.map((data, parent_idx) => (
                        <tr key={parent_idx}>
                            {data.map((sub_data, idx) => (
                                <td colSpan={parent_idx === 3 && (!idx || idx === 2)? '2' : '1'} key={idx}>
                                    {[3, 4].indexOf(idx) > -1
                                    ? (<Tooltip title={sub_data[1]} placement={'right-start'}>
                                        {
                                            [3, 4].indexOf(idx) > -1 && (!parent_idx || parent_idx === 1)
                                            || parent_idx === 2 && idx === 3
                                            ? (<IconButton onClick={() => clicked(sub_data[0])}>{sub_data[2]}</IconButton>)
                                            : (<Button onClick={() => clicked(sub_data[0])} className={classes.textTransUnset}>{sub_data[0]}</Button>)
                                        }
                                        </Tooltip>)
                                    : (<Button onClick={() => clicked(sub_data)}>{sub_data}</Button>)
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}