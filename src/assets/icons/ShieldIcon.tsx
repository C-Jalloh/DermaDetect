import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface ShieldIconProps {
  size?: number;
  color?: string;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({
  size = 24,
  color = 'currentColor',
}) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 -960 960 960"
        fill="none"
    >
        <Path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z" fill={color} />
    </Svg>
);

export default ShieldIcon;