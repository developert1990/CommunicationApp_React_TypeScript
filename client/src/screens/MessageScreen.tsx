import React from 'react';
import { Link } from 'react-router-dom';

import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';

export const MessageScreen = () => {
    return (
        <div>
            <div className="titleContainer">
                <h1>Inbox</h1>
                <div className="headerButton">
                    <Link to="/message/new"><RateReviewOutlinedIcon /></Link>
                </div>
            </div>
        </div>
    )
}
