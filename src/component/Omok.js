import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles (() => ({
    '1': {
        "width": "20px",
        "height": "20px",
        "border-radius": "50%",
        "background-color": "black",
        "display": "inline-block",
        "margin": "0 2px"
    },
    '0' : {
        "width": "18px",
        "height": "18px",
        "border-radius": "50%",
        "border": "1px solid",
        "display": "inline-block",
        "margin": "0 2px"
    },
    "plusmark": { "cursor": "pointer", "margin": "0 4px" },
    "div_hei": {"height": "29px"}
}));

const omok_frame = function make_frame() {
    const arr = Array();
    for (let i=0; i<num+1; i++) {
        const chd_addr = Array();
        for (let j=0; j<num+1; j++) {
            if (!i && !j) {
                chd_addr.push('┌');
            } else if (!i && j === num) {
                chd_addr.push('┐');
            } else if (i === num && !j) {
                chd_addr.push('└');
            } else if (i === num && j === num) {
                chd_addr.push('┘');
            } else if ((!i && 0 < j < num) || (i === num && 0 < j < num)) {
                chd_addr.push('─');
            } else if (0 < i < num && (!j || j === num)) {
                chd_addr.push('│');
            } else if (0 < i < num && 0 < j < num) {
                chd_addr.push('+');
            }
        }
        arr.push(chd_addr);
    }
    return arr;
}


let num = 19, count = 0, now = '0';

export default function Omok() {
    const classes = useStyles();
    const [frame, setFrame] = useState(omok_frame);

    const set_stone = (s, row, col) => {
        if (s !== '+') return;
        const tmp = [...frame];
        tmp[row][col] = count%2 === 1 ? '1' : '0';
        ++count;
        setFrame(tmp);
        if ((num-1)*(num-1) === count) {
            setTimeout(() => {
                alert("게임이 끝났습니다.");
            }, 300);
        }
    }
    return(
        <>
        <div>
            차례 : <span className={classes['' + count%2]}></span>
        </div>
        <div>
            {frame.map((rows, r_idx) => (
                    <div key={r_idx} className={classes.div_hei}>
                        {rows.map((col, c_idx) => (
                            col === '1' || col === '0'
                            ? <span key={c_idx} className={classes[col]}></span>
                            : <span key={c_idx} className={col === '+' ? classes.plusmark : ''} onClick={() => {set_stone(col, r_idx, c_idx)}}>{col}</span>
                        ))}
                    </div>
            ))}
        </div>
        </>
    );
}