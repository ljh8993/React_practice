import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
export default function Toast(props) {
    const msg = props.msg ? props.msg : "No Message";
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={true}
                message={msg}
            />
        </div>
    );
}
