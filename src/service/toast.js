import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}
export default function Toast(props) {
    const msg = props.msg ? props.msg : "No Message";
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={props.open}
                message={msg}
                TransitionComponent={SlideTransition}
            />
        </div>
    );
}
