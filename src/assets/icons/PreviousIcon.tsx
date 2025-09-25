import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const PreviousIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
    </Svg>
);

export default PreviousIcon;