import React, { useState } from 'react'
import css from "./Search.module.css"
import { Model_Details } from '../../Data'
import { useNavigate } from 'react-router-dom'
import { useGetExploreModelResults, useGetModels } from '../../ReactQuery/queriesAndMutations';

const Search = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const goToDetails = (id) => {
        navigate(`/model/${id}`);
    };
    const { data: modelsData, error: modelsError } = useGetModels();
    const { data: searchData, error } = useGetExploreModelResults(keyword);

    const Card = ({ image, username, bio, _id }) => {
        return <div className={css.ModelsCards}>
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
            <div className={css.SearchArea}>
                <input
                    type="text"
                    placeholder="Search"
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value); }}
                />

            </div>
            <div className={css.ModelsGrid}>
                {keyword.trim().length === 0 ?
                    modelsData && modelsData.map((model, index) => {
                        return <Card _id={model._id} image={model.profileimage} username={model.username} bio={model.about} key={index} />
                    }) : searchData && searchData.map((model, index) => {
                        return <Card _id={model._id} image={model.profileimage} username={model.username} bio={model.about} key={index} />
                    })
                }
            </div>

        </div>
    )
}

export default Search