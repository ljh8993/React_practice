import React from 'react';
import '../css/ImageSlider.css';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos }from '@material-ui/icons';

const images = [
    "/imgs/dog1.jpg",
    "/imgs/dog2.jpg",
    "/imgs/dog3.jpg",
];

export default function ImageSlider() {
    const clicked = (n) => {
        let current = Number(document.getElementsByClassName("img_f")[0].style.marginLeft.replace(/[^0-9]/g, '')) || 0;
        if (!n && !current) return false;
        let move = 0;
        if (!n) {
            move = (current - 100) / 100;
        } else {
            if (images.length-1 === current/100) return false;
            move = (current + 100) / 100;
        }
        document.getElementById(`${"dot_input"+move}`).click();
    }

    const radioClicked = (n) => {
        document.getElementsByClassName("img_f")[0].style.marginLeft = `${-(n*100) + '%'}`;
    }
    
    return(
        <div className={"frame"}>
            <IconButton className={"back"} onClick={() => clicked(0)}><ArrowBackIos /></IconButton>
            <IconButton className={"forward"} onClick={() => clicked(1)}><ArrowForwardIos /></IconButton>
            {images.map((value, idx) => (
                !idx
                ? (<input key={idx} type="radio" name="dot" id={"dot_input"+idx} onClick={() => radioClicked(idx)} defaultChecked/>)
                : (<input key={idx} type="radio" name="dot" id={"dot_input"+idx} onClick={() => radioClicked(idx)} />)
            ))}
            <div className={"img_f"}>
                {images.map((addr, idx) => (
                    <div key={idx} className={"img_d"}>
                        <img key={idx} src={addr}/>
                    </div>
                ))}
            </div>
            <p className={"dots"}>
                {images.map((value, idx) => (
                    <label key={idx} htmlFor={"dot_input"+idx}>{idx}</label>
                ))}
            </p>
        </div>
    )
}