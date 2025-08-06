import React, { useContext } from 'react';
import css from "./LandingPage.module.css"
import { Model_Photos } from '../../Data'
import AuthPage from '../../AuthContext/AuthPage'
import { AuthContext } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, isLoading } = useContext(AuthContext);
    if (user) {
        navigate('/home');
    }
    return (
        <div className={css.Frame}>
            <div className={css.ImagesBackground}>
                {
                    Model_Photos.map((image, index) => {
                        return <img src={image} alt="model_photes" key={index} />
                    })
                }
            </div>
            <div className={css.LoginComponent}>
                <AuthPage />
            </div>
        </div>
    )
}

export default LandingPage