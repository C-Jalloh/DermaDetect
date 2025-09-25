import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const HomeIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
    </Svg>
);

export default HomeIcon;
