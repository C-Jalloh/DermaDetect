import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const FlashIcon: React.FC<SvgProps> = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="#e3e3e3"
        viewBox="0 -960 960 960"
        {...props}
    >
        <Path d="M240-760v-120h480v120H240Zm240 420q25 0 42.5-17.5T540-400q0-25-17.5-42.5T480-460q-25 0-42.5 17.5T420-400q0 25 17.5 42.5T480-340ZM320-80v-440l-80-120v-40h480v40l-80 120v440H320Z" />
    </Svg>
);

export default FlashIcon;