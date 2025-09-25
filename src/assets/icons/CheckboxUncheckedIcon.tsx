import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const CheckboxUncheckedIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={24}
    height={24}
    fill="#e3e3e3"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
  </Svg>
);

export default CheckboxUncheckedIcon;