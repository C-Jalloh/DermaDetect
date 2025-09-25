import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface OfflineModeIconProps {
  size?: number;
  color?: string;
}

const OfflineModeIcon: React.FC<OfflineModeIconProps> = ({
  size = 24,
  color = 'currentColor',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960" fill="none">
      <Path
        d="m80-80 800-800v240H720v560H80Zm760 0q-17 0-28.5-11.5T800-120q0-17 11.5-28.5T840-160q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80Zm-40-160v-320h80v320h-80Z"
        fill={color}
      />
    </Svg>
  );
};

export default OfflineModeIcon;