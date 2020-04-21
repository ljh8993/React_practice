import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        position: "absolute",
        backgroundColor: "#000000",
        opacity: 0.4,
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
    },
    children: {
        position: "absolute",
        color: "#ffffff",
        top: "50%"
    }
}));

export default function Circle_progress() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CircularProgress className={classes.children}/>
        </div>
    );
}