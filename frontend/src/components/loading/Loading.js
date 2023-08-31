import React from 'react'

const Loading = ({ size = 100 }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%"
        }}>
            Loading...
        </div>
    )
}

export default Loading