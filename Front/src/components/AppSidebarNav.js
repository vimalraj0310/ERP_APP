import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { CBadge, CNavLink, CSidebarNav } from '@coreui/react';
export const AppSidebarNav = ({ items, auth, pageData }) => {
  // Convert all keys in pageData to lowercase
  const lowerCasePageData = Object.fromEntries(
    Object.entries(pageData).map(([key, value]) => [key.toLowerCase(), value.toLowerCase()])
  );

  const navLink = (name, icon, badge, indent = false) => (
    < >
      {icon ? (
        <span className="nav-icon">{icon}</span>
      ) : (
        indent && (
          <span className="nav-icon">
            <span className="nav-icon-bullet"></span>
          </span>
        )
      )}
      {name && name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto">
          {badge.text}
        </CBadge>
      )}
    </>
    
  );

  const navItem = (item, index, indent = false) => {
    const { component: Component, name, screenid, badge, icon, ...rest } = item;

    // Check authorization and page data
    if (lowerCasePageData[screenid.toLowerCase()] !== 'a' && auth.UserStatus !== 'SA') {
      return null; // Skip this item
    }

    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <NavLink
            {...rest}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            {navLink(name, icon, badge, indent)}
          </NavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component: Component, name, screenid, icon, items, ...rest } = item;

    if (lowerCasePageData[screenid.toLowerCase()] !== 'a' && auth.UserStatus !== 'SA') {
      return null; // Skip this item
    }

    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((subItem, subIndex) =>
          subItem.items ? navGroup(subItem, subIndex) : navItem(subItem, subIndex, true)
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => 
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  auth: PropTypes.shape({
    UserStatus: PropTypes.string.isRequired,
  }).isRequired,
  pageData: PropTypes.objectOf(PropTypes.string).isRequired,
};
