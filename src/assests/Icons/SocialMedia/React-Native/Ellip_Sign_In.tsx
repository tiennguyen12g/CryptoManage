import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
interface IconProps {
    width?: number,
    height?: number,
    fillColor?: string,
}
const Ellip_Sign_In = ({ width = 330,height = 158, fillColor = "#555" }: IconProps) => {
    const ratio = (330/158);
    const newHeight = width / ratio;
return (
    <Svg viewBox={`0 0 330 158`} width={width} height={newHeight} >
    <Path
      d="M0 110.757C37.092 139.088 97.1813 157.5 165 157.5C232.819 157.5 292.908 139.088 330 110.757V0.5H0V110.757Z"
      fill="url(#paint0_linear_131_52)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_131_52"
        x1={'0%'} y1={'0%'} x2={'100%'} y2={'100%'}
        gradientUnits="userSpaceOnUse"
      >
        {/* <Stop offset={0} stopColor="#FEB877" stopOpacity={0.14} />
        <Stop offset={0.5} stopColor="#FF9029" stopOpacity={0.18} /> */}
        <Stop offset={0} stopColor="#167bf0" stopOpacity={1} />
        <Stop offset={1} stopColor="#8f028f" stopOpacity={1} />
      </LinearGradient>
    </Defs>
  </Svg>
)
};
export default Ellip_Sign_In;