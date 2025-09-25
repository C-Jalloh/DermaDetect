import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const FilterIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={24}
    height={24}
    fill="#e3e3e3"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Z" />
  </Svg>
);

export default FilterIcon;