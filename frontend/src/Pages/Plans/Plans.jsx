import React from "react";
import css from "./Plans.module.css";
const Plans = () => {
  const Monthlyplans = [
    {
      title: "Basic Package - $120/month",
      prices: [
        "Free (20 minutes) daily sexting/sexchat with random photos/videos",
        "Free (2) photos daily from any model of choice",
        "Free (1) video per week from any model of choice",
      ],
    },
    {
      title: "Premium Package - $150/month",
      prices: [
        "Free (30 minutes) daily sexting/sexchat with random photos/videos",
        "Free (4) photos daily from any model of choice",
        "Free (2) videos per week from any model of choice",
      ],
    },
    {
      title: "VIP Package - $200/month",
      prices: [
        "Free (50 minutes) daily sexting/sexchat with random photos/videos",
        "Free (6) photos daily from any model of choice",
        "Free (4) videos per week from any model of choice",
      ],
    },
  ];
  const ThreeMonthplans = [
    {
      title: "Basic Package - $300/quarter",
      prices: [
        "Free (20 minutes) daily sexting/sexchat with random photos/videos",
        "Free (2) photos daily from any model of choice",
        "Free (1) video per week from any model of choice",
      ],
    },
    {
      title: "Premium Package - $380/quarter",
      prices: [
        "Free (30 minutes) daily sexting/sexchat with random photos/videos",
        "Free (4) photos daily from any model of choice",
        "Free (2) videos per week from any model of choice",
      ],
    },
    {
      title: "VIP Package - $500/quarter",
      prices: [
        "Free (1hr) daily sexting/sexchat with random photos/videos",
        "Free (6) photos daily from any model of choice",
        "Free (5) video per week from any model of choice",
      ],
    },
  ];
  return (
    <div className={css.Frame}>
      <div className={css.backgroundShapes}>
        <div className={css.shape + " " + css.shape1}></div>
        <div className={css.shape + " " + css.shape2}></div>
        <div className={css.shape + " " + css.shape3}></div>
      </div>
      <h2 className={css.ServiceHeader}>Monthly Subscription Options</h2>
      <div className={css.MonthlyCards}>
        {Monthlyplans.map((plan, index) => {
          return (
            <div className={css.glassCard} key={index}>
              <span className={css.planHeader}>{plan.title}</span>
              {plan.prices.map((price, index) => {
                return (
                  <div className={css.InternalRow} key={index}>
                    <div className={css.Icon}>✅</div>
                    <span>{price}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <h2 className={css.ServiceHeader}>3 Months Subscription Option</h2>
      <div className={css.MonthlyCards}>
        {ThreeMonthplans.map((plan, index) => {
          return (
            <div className={css.glassCard} key={index}>
              <span className={css.planHeader}>{plan.title}</span>
              {plan.prices.map((price, index) => {
                return (
                  <div className={css.InternalRow} key={index}>
                    <div className={css.Icon}>✅</div>
                    <span>{price}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className={css.mobileDivider}></div>
    </div>
  );
};

export default Plans;
