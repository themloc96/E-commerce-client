import React from 'react';
import { Link } from 'react-router-dom';
import DarkLogo from '../Svg/DarkLogo';
import LightLogo from '../Svg/LightLogo';
import { useWindowDimensions } from '../../hooks';
import DartkLogoMobile from '../Svg/DartkLogoMobile';
import LightLogoMobile from '../Svg/LightLogoMobile';

export default function Logo(props) {
  const { isDark, link = '/', onClick = null } = props;
  const { width } = useWindowDimensions();
  if (width < 992) {
    return (
      <Link style={{ marginTop: '2px' }} to={link} onClick={onClick}>
        {isDark && <DartkLogoMobile />} {!isDark && <LightLogoMobile />}
      </Link>
    );
  }
  return (
    <Link style={{ marginTop: '2px' }} to={link}>
      {isDark && <DarkLogo />} {!isDark && <LightLogo />}
    </Link>
  );
}
