import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useUserRole } from '@/features/authentication';
import SidebarMenuItem from './SidebarMenuItem';
import styles from './sidebar.module.css';
import { getNavConfigForRole } from './navigationConfig';

const SidebarNav: React.FC = () => {
  const role = useUserRole();

  const navConfig = useMemo(
    () => (role ? getNavConfigForRole(role) : []),
    [role],
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navConfig.map((group) => [group.id, true])),
  );

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  if (!role || navConfig.length === 0) {
    return null;
  }

  return (
    <nav className={styles.sidebarNav}>
      <ul className={styles.navList}>
        {navConfig.map((group) => {
          const isOpen = openGroups[group.id] ?? true;
          return (
            <li key={group.id} className={styles.navGroup}>
              <button
                type="button"
                className={styles.navGroupHeader}
                onClick={() => toggleGroup(group.id)}
              >
                <div className={styles.navGroupHeaderMain}>
                  {group.icon ? (
                    <span className={styles.navGroupIcon}>
                      <group.icon size={18} />
                    </span>
                  ) : null}
                  <span className={styles.navGroupLabel}>{group.label}</span>
                </div>
                <span className={styles.navGroupChevron}>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
                </span>
              </button>

              {isOpen && group.items.length > 0 ? (
                <ul className={styles.subNavList}>
                  {group.items.map((item) => (
                    <SidebarMenuItem
                      key={item.id}
                      to={item.path}
                      icon={item.icon ? <item.icon size={18} /> : undefined}
                      label={item.label}
                      isSubItem
                    />
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNav;

