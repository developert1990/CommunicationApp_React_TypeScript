import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface ToggleAlertPropsType {
    open: boolean;
    alertMsg: string;
    handleAlertClose: () => void;
}

export const ToggleAlert: React.FC<ToggleAlertPropsType> = ({ handleAlertClose, alertMsg, open }) => {



    return (
        <Snackbar open={open} autoHideDuration={1500} onClose={handleAlertClose} >
            <Alert severity="success">
                {alertMsg} succeessfully !
                </Alert>
        </Snackbar>
    )
}
