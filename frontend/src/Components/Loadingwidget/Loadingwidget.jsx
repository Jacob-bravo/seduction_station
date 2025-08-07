import React from 'react'
import css from "./LoadingWidget.module.css"

const loadingwidget = () => {
  return (
  <div className={css.loadingWrapper}>
      <div className={css.backgroundShapes}>
        <div className={css.shape + " " + css.shape1}></div>
        <div className={css.shape + " " + css.shape2}></div>
        <div className={css.shape + " " + css.shape3}></div>
      </div>

      <div className={css.glassCard}>
        <div className={css.loader}></div>
        <p>Loading, please wait...</p>
      </div>
    </div>
  )
}

export default loadingwidget