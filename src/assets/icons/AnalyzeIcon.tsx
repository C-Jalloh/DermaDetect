import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const AnalyzeIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240l80 80h280q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H200Zm0-80h600v-480H447l-80-80H200v560Zm300-160q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-40-60v-80h80v80h-80Zm-200-80v-80h80v80h-80Zm400 0v-80h80v80h-80ZM200-200v-560 560Z" />
    </Svg>
);

export default AnalyzeIcon;