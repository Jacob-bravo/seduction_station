import React from 'react'
import css from "./Navigation.module.css"
import { useNavigate } from 'react-router-dom'
import { Links } from '../../Data'

const Navigation = () => {
    const navigate = useNavigate();
    const handleNavigation = (link) => {
        const newlink = link.toLowerCase();
        navigate(`/${newlink}`);
    };
    return (
        <div className={css.Frame}>
            <div className={css.Rows}>
                {
                    Links.map((Navigationlink, index) => {
                        return <div className={css.RowInfo} key={index} onClick={() => {
                            handleNavigation(Navigationlink.navigation);
                        }}>
                            {Navigationlink.icon}
                            <span>{Navigationlink.link}</span>
                        </div>
                    })
                }

            </div>
        </div>
    )
}

export default Navigation