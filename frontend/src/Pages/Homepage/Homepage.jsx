import React from 'react'
import css from "./Homepage.module.css"
import { Model_Details } from '../../Data'
import { useNavigate } from "react-router-dom";
import { useGetModels } from '../../ReactQuery/queriesAndMutations';


const Homepage = () => {
    const navigate = useNavigate();
    const {
        data,
        error,
    } = useGetModels();


    const goToDetails = (id) => {
        navigate(`/model/${id}`);
    };
    const Card = ({ image, username, bio, _id }) => {
        return <div className={css.ModelsCards} >
            <div className={css.Photo}>
                <img src={image} alt="modelPhoto" />
            </div>
            <div className={css.details}>
                <span>{username}</span>
                <span>{bio}</span>
            </div>
            <div className={css.EngagementButton}>
                <button onClick={() => goToDetails(_id)}>View Profile</button>
            </div>
        </div>
    }
    return (
        <div className={css.Frame}>
            <div className={css.ModelsGrid}>
                {
                    data && data.map((model, index) => {
                        return <Card _id={model._id} image={model.profileimage} username={model.username} bio={model.about} key={index}  />
                    })
                }
            </div>

        </div>
    )
}

export default Homepage