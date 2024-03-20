export const getActiveSubMenuItem = ({ pathname, menuItem }) => {
  const activeSubMenuItem = menuItem?.sub?.find(item => pathname?.startsWith(item.link));
  
  return activeSubMenuItem?.link === '/' ? null : activeSubMenuItem;
};

export const getActiveMenuItem = ({ pathname, menuList }) => {
  return menuList.find(
    menuItem =>
      pathname.startsWith(menuItem.link) ||
      getActiveSubMenuItem({ menuItem, pathname }),
  );
};
