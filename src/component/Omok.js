import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles (() => ({
    '1': {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "black",
        display: "inline-block",
        margin: "0 2px"
    },
    '0' : {
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        border: "1px solid",
        display: "inline-block",
        margin: "0 2px"
    },
    plusmark: {
        margin: "0 4px" },
    div_hei: {
        height: "29px"
    }
}));

let num = 19, count = 0, done = false;

function make_frame() {
    const arr = [];
    for (let i=0; i<num+1; i++) {
        const chd_addr = [];
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

const omok_frame = make_frame();

function five_check(li, row, col) {
    let cnt = 1;
    let row_m = row, row_p = row;
    let col_m = col, col_p = col;
    const stone = li[row][col];

    // '\' 모양 체크
    for (let i=0; i<4; i++) {
        --col_m;
        --row_m;
        const chk_stone = li[row_m][col_m];
        if (col_m < 1 || row_m < 1 || chk_stone !== stone) break;
        ++cnt;
    }
    for (let i=0; i<4; i++) {
        ++col_p;
        ++row_p;
        const chk_stone = li[row_p][col_p];
        if (col_p > num-1 || row_p > num-1 || chk_stone !== stone) break;
        ++cnt;
    }
    if (cnt === 5) return true;

    // '/' 모양 체크
    cnt = 1;
    row_m = row_p = row;
    col_m = col_p = col;
    for (let i=0; i<4; i++) {
        --row_m;
        ++col_p;
        const chk_stone = li[row_m][col_p];
        if (row_m < 1 || col_p > num-1 || chk_stone !== stone) break;
        ++cnt;
    }
    for (let i=0; i<4; i++) {
        ++row_p;
        --col_m;
        const chk_stone = li[row_p][col_m];
        if (row_p > num-1 || col_m < 1 || chk_stone !== stone) break;
        ++cnt;
    }
    if (cnt === 5) return true;

    // 'ㅡ' 모양 체크
    cnt = 1;
    col_m = col_p = col;
    for (let i=0;i<4;i++) {
        --col_m;
        const chk_stone = li[row][col_m];
        if (col_m < 1 || stone !== chk_stone) break;
        ++cnt;
    }

    for (let i=0;i<4;i++) {
        ++col_p;
        const chk_stone = li[row][col_p];
        if (col_p > num-1 || stone !== chk_stone) break;
        ++cnt;
    }
    if (cnt === 5) return true;

    // 'ㅣ' 모양 체크
    cnt = 1;
    row_m = row_p = row;
    for (let i=0; i<4;i++) {
        --row_m;
        const chk_stone = li[row_m][col];
        if (row_m < 1 || chk_stone !== stone) break;
        ++cnt;
    }
    for (let i=0;i<4;i++) {
        ++row_p;
        const chk_stone = li[row_p][col];
        if (row_p > num-1 || chk_stone !== stone) break;
        ++cnt;   
    }
    return cnt === 5 ? true : false;
}


export default function Omok() {
    const classes = useStyles();
    const [frame, setFrame] = useState(omok_frame);

    const set_stone = (s, row, col) => {
        if (s !== '+' || done) return;
        const tmp = [...frame];
        tmp[row][col] = count%2 === 1 ? '1' : '0';
        ++count;
        setFrame(tmp);
        if (five_check(tmp, row, col)) {
            done = true;
            const dic = {"1": "흑돌", "0": "백돌"}
            setTimeout(() => {
                alert(dic[tmp[row][col]] + " 승리 !");
            }, 400);
        }
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