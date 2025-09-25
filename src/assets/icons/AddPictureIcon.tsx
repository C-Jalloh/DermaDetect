import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface AddPictureIconProps {
  size?: number;
  color?: string;
}

const AddPictureIcon: React.FC<AddPictureIconProps> = ({
  size = 24,
  color = 'currentColor',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5ZM19 17V7H5V17H19Z"
        fill={color}
      />
      <Path
        d="M14.5 10.5L11.5 13.5L9.5 11.5L7 14H17L14.5 10.5Z"
        fill={color}
      />
      <Path
        d="M15 8C15 8.55228 14.5523 9 14 9C13.4477 9 13 8.55228 13 8C13 7.44772 13.4477 7 14 7C14.5523 7 15 7.44772 15 8Z"
        fill={color}
      />
    </Svg>
  );
};

export default AddPictureIcon;