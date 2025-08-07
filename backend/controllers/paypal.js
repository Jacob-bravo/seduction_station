const axios = require('axios')
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/UserModel")


async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })

    return response.data.access_token
}
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        const accessToken = await generateAccessToken();
        const { OrderPrice, ModelId, myId } = req.body;

        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: [
                            {
                                name: 'Model access',
                                description: 'Subscription access for a model',
                                quantity: 1,
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: OrderPrice
                                }
                            }
                        ],

                        amount: {
                            currency_code: 'USD',
                            value: OrderPrice,
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: OrderPrice
                                }
                            }
                        }
                    }
                ],

                application_context: {
                    return_url: process.env.BASE_URL + `/complete-order/${ModelId}/${myId}`,
                    // kurudi site
                    cancel_url: process.env.BASE_URL + `/cancel-order/${ModelId}`,
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'Secretseduction.com'
                }
            })
        })

        const approvalUrl = response.data.links.find(
            (link) => link.rel === 'approve'
        )?.href;

        if (!approvalUrl) {
            return res.status(500).json({
                success: false,
                message: 'Approval URL not found in PayPal response',
            });
        }




        return res.status(201).json({
            success: true,
            message: 'PayPal order created successfully',
            approvalUrl,
        });




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create PayPal order',
            error: error?.response?.data || error.message,
        });
    }
});
exports.completeOrder = catchAsyncErrors(async (req, res, next) => {
    const { modelId, myId, } = req.body;
    if (!modelId || !myId) {
        return res.status(400).json({
            success: false,
            message: 'Missing order ID or required parameters',
        });
    }

    try {
        await User.findByIdAndUpdate(
            myId,
            { $addToSet: { cart: modelId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Payment captured successfully, model access granted',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to capture payment',
            error: error?.response?.data || error.message,
        });
    }
});
