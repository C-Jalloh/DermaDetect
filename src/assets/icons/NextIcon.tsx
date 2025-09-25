import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const NextIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
    </Svg>
);

export default NextIcon;