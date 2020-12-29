import React from 'react'
import { Link } from 'react-router-dom'

export const InvalidPage = () => {
    return (
        <div className="mainSectionContainer col-10 col-md-8">
            <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>404</h1>
                        <h2>Page not found</h2>
                    </div>
                    <Link to="/">Back</Link>
                </div>
            </div>
        </div>
    )
}
