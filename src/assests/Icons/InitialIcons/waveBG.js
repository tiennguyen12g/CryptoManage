import * as React from "react";
import Svg, {
  Mask,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
const WaveBG = ({width = 362, height = 250}) => (
    <Svg
        width={width}
        height={width * (250 / 362)}
        viewBox="0 0 362 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
  >
    <Mask
      id="mask0_224_223"
      style={{
        maskType: "luminance",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={362}
      height={250}
    >
      <Path d="M362 0H0V250H362V0Z" fill="white" />
    </Mask>
    <G mask="url(#mask0_224_223)">
      <Path
        d="M371.87 147.68L447.987 109.214L235.095 -91.6951L-53.1658 53.9962L-14.6248 90.3693C69.0937 67.8788 272.284 29.375 371.87 147.68Z"
        fill="#FFCC00"
      />
      <Path
        d="M401.772 132.566L424.879 120.89L447.987 109.214L368.902 0.22728L235.095 -91.6951L15.6746 -39.9242L-53.1778 53.9868L-33.9073 72.1686L-14.6369 90.3504C27.2345 79.1193 106.44 60.0947 187.625 58.6648C268.809 57.2443 351.985 73.4186 401.772 132.566Z"
        fill="#FFA000"
      />
      <Path
        opacity={0.56}
        d="M426.472 120.076L437.224 114.64L447.975 109.205L365.318 0.833351L235.095 -91.6951L22.7336 -57.8882L-53.1658 53.9962L-33.8953 72.1781L-14.6248 90.3599C27.2344 79.1193 112.606 56.9792 199.969 52.4243C287.331 47.8788 376.685 60.928 426.472 120.076Z"
        fill="#FF3900"
      />
      <Path
        d="M426.472 120.076L437.224 114.64L447.975 109.205L384.987 -5.31248L235.095 -91.6951L7.63816 -36.8466L-53.1658 53.9868L-46.4446 60.322L-39.7235 66.6572C2.1237 55.4262 93.7821 39.2046 187.419 40.5777C281.057 41.9603 376.685 60.928 426.472 120.076Z"
        fill="url(#paint0_linear_224_223)"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_224_223"
        x1={342.815}
        y1={-116.494}
        x2={187.151}
        y2={214.073}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0.1589} stopColor="#FFFF00" />
        <Stop offset={1} stopColor="#FF0000" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default WaveBG;
