import React from 'react'
import css from "./Details.module.css"
import { useParams } from "react-router-dom";

const Details = () => {
    const { username } = useParams();
    return (
        <div className={css.Frame}>
            <span>PROFILE DETAILS FOR</span>
            <h2>{username}</h2>
        </div>
    )
}

export default Details