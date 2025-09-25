import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const HospitalIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="M120-120v-760h120v160h80v-160h80v160h80v-160h80v160h80v-160h120v760H520v-160h-80v160H120Zm80-80h80v-80h80v80h80v-80h80v80h80v-240H200v240Zm0-320h560v-240H200v240Zm80-80v-80h80v80h-80Zm120 0v-80h80v80h-80Zm120 0v-80h80v80h-80Zm120 0v-80h80v80h-80ZM200-200v-80h560v80H200Z" />
    </Svg>
);

export default HospitalIcon;