import React from 'react';

function NoData(props) {
  const { text = 'No data found' } = props;
  return <div className="text-center">{text}&nbsp;</div>;
}

export default NoData;
