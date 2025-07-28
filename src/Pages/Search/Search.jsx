import React from 'react'
import css from "./Search.module.css"
import { Model_Details } from '../../Data'

const Search = () => {
    const Card = ({ image, username, bio }) => {
        return <div className={css.ModelsCards}>
            <div className={css.Photo}>
                <img src={image} alt="modelPhoto" />
            </div>
            <div className={css.details}>
                <span>{username}</span>
                <span>{bio}</span>
            </div>
            <div className={css.EngagementButton}>
                <button>View Profile</button>
            </div>
        </div>
    }
    return (
        <div className={css.Frame}>
            <div className={css.SearchArea}>
                <input type="text" name="" id="" placeholder='Search' />

            </div>
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

export default Search