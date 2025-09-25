import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const DatabaseIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="M120-120v-80h80v-640h400v40h160v80H680v80h160v80H680v80h160v80H680v80h160v80H680v40H200v160h-80Zm80-240h400v-80H200v80Zm0-160h400v-80H200v80Zm0-160h400v-80H200v80Zm480 0h80v-80h-80v80Zm0 160h80v-80h-80v80Zm0 160h80v-80h-80v80Z" />
    </Svg>
);

export default DatabaseIcon;