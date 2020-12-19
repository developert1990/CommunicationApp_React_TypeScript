import React from 'react'

export const ThirdColumn = () => {
    return (
        <div className="col-md-2 d-none d-md-block"> {/* 스크린이 medium 사이즈 일때 block 이고 d-none으로 줫으므로 스크린사이즈가 줄어들게 되면 display가 none이 된다.  */}
                    third column
        </div>
    )
}
