import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CheckboxCheckedIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={24}
    height={24}
    fill="#e3e3e3"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z" />
  </Svg>
);

export default CheckboxCheckedIcon;