import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import css from "./Complete.module.css";
const CancelOrder = () => {
  const { modelId, myId } = useParams();
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`/model/${modelId}`);
  };
  return (
    <div className={css.Frame}>
      <div className={css.ConfirmationBox}>
        <h1 className={css.Title}>❌ Payment UnSuccessful</h1>
        <p className={css.Message}>You have canceled the Order</p>
        <div className={css.Details}>
          <p>
            <strong>Service:</strong> Premium Content
          </p>
          <p>
            <strong>Status:</strong> Canceled
          </p>
        </div>
        <button className={css.BackButton} onClick={handleNavigation}>
          Back to model
        </button>
      </div>
    </div>
  );
};

export default CancelOrder;
