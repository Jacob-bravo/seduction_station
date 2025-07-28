import React from 'react'
import css from "./LandingPage.module.css"
import { Model_Photos } from '../../Data'
import Login from '../../Components/Login/Login'


const LandingPage = () => {

    return (
        <div className={css.Frame}>
            <div className={css.ImagesBackground}>
                {
                    Model_Photos.map((image, index) => {
                        return <img src={image} alt="model_photes" />
                    })
                }
            </div>
            <div className={css.LoginComponent}>
                <Login />
            </div>
        </div>
    )
}

export default LandingPage