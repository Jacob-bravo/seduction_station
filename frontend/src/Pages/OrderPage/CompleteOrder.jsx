import React, { useEffect, useState } from 'react';
import css from './Complete.module.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { generateAccessToken, captureOrder } from '../../ReactQuery/api';

const CompleteOrder = () => {
    const { modelId, myId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");

        const capturePayment = async () => {
            try {
                if (!token) {
                    setError("Missing token.");
                    setLoading(false);
                    return;
                }

                const accessToken = await generateAccessToken();
                const result = await captureOrder(token, accessToken, modelId, myId);

                setSuccess(true);
            } catch (err) {
                console.error("Capture error:", err?.response?.data || err.message);
                setError("Something went wrong during capture.");
            } finally {
                setLoading(false);
            }
        };

        capturePayment();
    }, []);



    const handleNavigation = () => {
        navigate(`/model/${modelId}`);
    };

    return (
        <div className={css.Frame}>
            <div className={css.ConfirmationBox}>
                {loading ? (
                    <h2 className={css.Message}>Checking payment...</h2>
                ) : error ? (
                    <>
                        <h1 className={css.Title}>❌ Payment Failed</h1>
                        <p className={css.Message}>{error}</p>
                    </>
                ) : success ? (
                    <>
                        <h1 className={css.Title}>🎉 Payment Successful</h1>
                        <p className={css.Message}>Thank you for your purchase!</p>
                        <div className={css.Details}>
                            <p><strong>Service:</strong> Premium Content</p>
                            <p><strong>Status:</strong> Confirmed</p>
                        </div>
                        <button className={css.BackButton} onClick={handleNavigation}>
                            Back to model
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default CompleteOrder;
