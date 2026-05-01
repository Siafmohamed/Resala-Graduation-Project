import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.css';

interface SidebarMenuItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  isSubItem?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  to,
  icon,
  label,
  isSubItem = false,
}) => {
  return (
    <li className={isSubItem ? styles.subNavItem : styles.navItem}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            isSubItem ? styles.subNavLink : styles.navLink,
            isActive ? styles.active : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
      >
        {icon ? <span className={styles.navIcon}>{icon}</span> : null}
        <span className={styles.navLabel}>{label}</span>
      </NavLink>
    </li>
  );
};

export default SidebarMenuItem;

