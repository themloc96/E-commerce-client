import { useState } from 'react';
import '../../styles/components/collapse.scss';

export default function Collapse(props) {
  const { title, children } = props;
  const [visibleContent, setVisibleContent] = useState(false);

  return (
    <div className="collapse-base">
      <button onClick={() => setVisibleContent(!visibleContent)}>
        <div
          className={`menu-collapse${
            visibleContent ? ' menu-collapse-openning' : ''
          }`}
        >
          <p>{title}</p>
          <img
            src={`/assets/app/${visibleContent ? 'minus' : 'plus'}.svg`}
            alt="plus"
          />
        </div>
      </button>
      {visibleContent && children}
    </div>
  );
}
