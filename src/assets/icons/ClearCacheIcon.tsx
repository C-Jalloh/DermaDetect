import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ClearCacheIconProps {
  size?: number;
  color?: string;
}

const ClearCacheIcon: React.FC<ClearCacheIconProps> = ({
  size = 24,
  color = 'currentColor',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960" fill="none">
      <Path
        d="M120-280v-80h560v80H120Zm80-160v-80h560v80H200Zm80-160v-80h560v80H280Z"
        fill={color}
      />
    </Svg>
  );
};

export default ClearCacheIcon;