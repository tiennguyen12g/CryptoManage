import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
interface IconProps {
  width?: number,
  height?: number,
  fillColor?: string,
}
const Facebook = ({ width = 50, height = 50, fillColor = "#555" }: IconProps) => (
  <Svg viewBox={`0 0 25 25`} width={width} height={height} >
    <G clipPath="url(#clip0_127_40)">
      <Path
        d="M25 12.5C25 5.5965 19.4035 0 12.5 0C5.5965 0 0 5.5965 0 12.5C0 18.362 4.036 23.281 9.4805 24.632V16.32H6.903V12.5H9.4805V10.854C9.4805 6.5995 11.406 4.6275 15.583 4.6275C16.375 4.6275 17.7415 4.783 18.3005 4.938V8.4005C18.0055 8.3695 17.493 8.354 16.8565 8.354C14.807 8.354 14.015 9.1305 14.015 11.149V12.5H18.098L17.3965 16.32H14.015V24.9085C20.2045 24.161 25.0005 18.891 25.0005 12.5H25Z"
        fill="#0866FF"
      />
      <Path
        d="M17.396 16.32L18.0975 12.5H14.0145V11.149C14.0145 9.1305 14.8065 8.354 16.856 8.354C17.4925 8.354 18.005 8.3695 18.3 8.4005V4.938C17.741 4.7825 16.3745 4.6275 15.5825 4.6275C11.4055 4.6275 9.48 6.5995 9.48 10.854V12.5H6.9025V16.32H9.48V24.632C10.447 24.872 11.4585 25 12.4995 25C13.012 25 13.5175 24.9685 14.014 24.9085V16.32H17.3955H17.396Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_127_40">
        <Rect width={width} height={height} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Facebook;
