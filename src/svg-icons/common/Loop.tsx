import React from 'react';
import { Rect, Svg } from 'react-native-svg';

import { IconProps } from '../../types';

// Loop boomerang mark (same geometry as the web logo, 40x40 grid)
export const LoopIcon = ({ stroke = '#858585' }: IconProps): JSX.Element => {
  return (
    <Svg width="100%" height="100%" viewBox="6 3 30 30" fill="none">
      <Rect
        x="10.6"
        y="7"
        width="5.6"
        height="19"
        rx="2.8"
        transform="rotate(18 13 26)"
        fill={stroke}
      />
      <Rect
        x="13"
        y="23.2"
        width="19"
        height="5.6"
        rx="2.8"
        transform="rotate(-18 13 26)"
        fill={stroke}
      />
    </Svg>
  );
};
