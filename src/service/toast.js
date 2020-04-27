import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

function SlideTransition(props) {
    return <Slide {...props} direction={props.direction} />;
}
export default function Toast(props) {
    const msg = props.msg ? props.msg : "No Message";
    const vertical = props.direction ? props.direction : "top";
    const horizontal = props.horiz ? props.horiz : "center";
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: vertical,
                    horizontal: horizontal,
                }}
                open={props.open}
                message={msg}
                TransitionComponent={SlideTransition}
            />
        </div>
    );
}
