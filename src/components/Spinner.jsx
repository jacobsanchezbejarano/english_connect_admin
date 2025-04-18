import React from 'react';

function Spinner({status}) {
    return (
        status === "loading" ? <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
        </div> : <div className="spinner-stoped">
            <div></div>
        </div>
    )
}

export default Spinner;