import React from 'react'
import css from "./Homepage.module.css"
import { Model_Details } from '../../Data'
import { useNavigate } from "react-router-dom";



const Homepage = () => {
    const navigate = useNavigate();
    const goToDetails = (username) => {
        navigate(`/model/${username}`);
    };
    const Card = ({ image, username, bio }) => {
        return <div className={css.ModelsCards} >
            <div className={css.Photo}>
                <img src={image} alt="modelPhoto" />
            </div>
            <div className={css.details}>
                <span>{username}</span>
                <span>{bio}</span>
            </div>
            <div className={css.EngagementButton}>
                <button onClick={() => goToDetails(username)}>View Profile</button>
            </div>
        </div>
    }
    return (
        <div className={css.Frame}>
            <div className={css.ModelsGrid}>
                {
                    Model_Details.map((model, index) => {
                        return <Card image={model.photo} username={model.username} bio={model.bio} key={index} />
                    })
                }
            </div>

        </div>
    )
}

export default Homepage