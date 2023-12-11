import { Dimensions } from 'react-native'
import React from 'react'
import Portfolio from "./Portfolio";
import Staking from "./Staking";
import Tracking from "./Tracking";
import LogoTitle from "./LogoTitle";

const {width, height} = Dimensions.get("screen");
const marginHorizontal = 20
const widthImage = width - 2 * marginHorizontal;
const heightImage = widthImage;
const InitialPages = [
  { 
    name: "tracking", 
    image: <Tracking width={widthImage} height={heightImage}/>,
    contentTitle: "Tracking",
    content:" Real-time system checking that manage all your trading, future and margin.",
    logoTitle: <LogoTitle />,
    pageNo: 1,
  },
  { 
    name: "staking", 
    image: <Staking width={widthImage} height={heightImage}/>,
    contentTitle: "Earning",
    content:"Staking your coin to get passive income with high interest rate",
    logoTitle: <LogoTitle />, 
    pageNo: 2,
  },
  { 
    name: "portfolio", 
    image: <Portfolio width={widthImage} height={heightImage}/>,
    contentTitle: "Portfolio",
    content:"Manage your crypto fund in exchange, wallet address and more.",
    logoTitle: <LogoTitle />,
    pageNo: 3,
  },
]
export default InitialPages;