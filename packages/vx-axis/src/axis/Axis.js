import React from 'react';
import cx from 'classnames';
import { Line } from '@vx/shape';
import { Point } from '@vx/point';
import { Group } from '@vx/group';
import center from '../utils/center';
import identity from '../utils/identity';
import ORIENT from '../constants/orientation';

export default function Axis({
  scale,
  orientation,
  top = 0,
  left = 0,
  stroke = 'black',
  strokeWidth = 1,
  strokeDasharray,
  numTicks = 10,
  tickFormat,
  tickStroke = 'black',
  tickLength = 8,
  tickLabelPadding = 14,
  tickOffset = 0,
  tickTransform,
  axisPadding = 0.5,
  hideAxisLine = false,
  hideTicks = false,
  hideZero = false,
  labelComponent = (
    <text
      textAnchor="middle"
      fontFamily="Arial"
      fontSize={10}
      fill="black"
    >
      default label
    </text>
  ),
  tickLabelComponent = (
    <text
      textAnchor="middle"
      fontFamily="Arial"
      fontSize={10}
      fill="black"
    />
  ),
  className,
}) {
    const values = scale.ticks ? scale.ticks(numTicks) : scale.domain();
    let format = scale.tickFormat ? scale.tickFormat() : identity;
    if (tickFormat) format = tickFormat;

    const range = scale.range();
    const range0 = range[0] + axisPadding;
    const range1 = range[range.length - 1] + axisPadding;

    const horizontal = orientation !== ORIENT.left && orientation !== ORIENT.right;
    const isLeft = orientation === ORIENT.left;
    const isTop = orientation === ORIENT.top;
    const tickSign = isLeft || isTop ? -1 : 1;
    const totalTickSize = tickLength + Math.abs(tickLabelPadding) + Math.abs(tickOffset);

    const transform = horizontal ? '' : `translate(${tickOffset})`;
    const position = (scale.bandwidth ? center : identity)(scale.copy());

    const axisFromPoint = new Point({
      x: horizontal ? range0 : 0,
      y: horizontal ? 0 : range0,
    });
    const axisToPoint = new Point({
      x: horizontal ? range1 : 0,
      y: horizontal ? 0 : range1,
    });

    const labelFontSize = labelComponent.props.fontSize || 10;
    const tickLabelFontSize = tickLabelComponent.props.fontSize || 10;

    const labelProps = {
      transform: horizontal ?  '' : `rotate(${tickSign * 90})`,
      x: horizontal ? range1 / 2 : tickSign * (range0 / 2),
      y: horizontal ? tickSign * totalTickSize : (isLeft ? 1 : -1) * tickSign * totalTickSize,
    };

    return (
      <Group
        className={cx('vx-axis', className)}
        top={top}
        left={left}
      >
        {values.map((val, i) => {
          if (hideZero && val === 0) return null;

          const tickFromPoint = new Point({
            x: horizontal ? position(val) : 0,
            y: horizontal ? 0 : position(val),
          });
          const tickToPoint = new Point({
            x: horizontal ? position(val) : tickLength,
            y: horizontal ? tickLength : position(val),
          });
           const tickLabelProps = {
            x: (!horizontal ? tickSign : 1) * tickToPoint.x,
            y: (horizontal ? tickSign : 1) * (tickToPoint.y + (horizontal && !isTop ? tickLabelFontSize : 0)),
          };

          return (
            <Group
              key={`vx-tick-${val}-${i}`}
              className='vx-axis-ticks'
            >
              {!hideTicks &&
                <Line
                  from={tickFromPoint}
                  to={tickToPoint}
                  transform={tickTransform || transform}
                  stroke={tickStroke || stroke}
                />
              }
              {React.cloneElement(tickLabelComponent, tickLabelProps, format(val))}
            </Group>
          );
        })}
        {!hideAxisLine &&
          <Line
            from={axisFromPoint}
            to={axisToPoint}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        }
      </Group>
    );
}
