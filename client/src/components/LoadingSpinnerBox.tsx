import React from 'react';
import { Spinner } from 'react-bootstrap';

export const LoadingSpinnerBox = () => {


    return (
        <div className="LoadingSpinner">
            <Spinner animation="border" variant="secondary" />
        </div>
    )
}
