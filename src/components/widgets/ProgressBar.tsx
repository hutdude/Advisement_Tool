import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles

interface Props {
  val: number,
  text: string
}

function ProgressBar(props: Props) {
    return (
        <div style={{ width: 100, height: 100 }}>
          <CircularProgressbarWithChildren value={props.val}>
            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
            <div style={{ fontSize: 12, marginTop: -5 }}>
              {props.text}
            </div>
          </CircularProgressbarWithChildren>
        </div>
      );
}

export default ProgressBar;