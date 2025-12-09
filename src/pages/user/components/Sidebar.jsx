import React from "react";
import PGLogo from "../../../assets/PG.png";

const Sidebar = ({
  styles,
  activeTab,
  onTabClick,
  isSidebarOpen,
  isMobile,
  onProfileSelect,
}) => {
  const sidebarStyle = {
    ...styles.sidebar,
    left: isSidebarOpen ? 0 : "-260px",
  };

  const navItem = (tab, label, onClick = () => onTabClick(tab)) => (
    <div
      style={{
        ...styles.navLink,
        ...(activeTab === tab ? styles.navLinkActive : {}),
      }}
      onClick={onClick}
    >
      {label}
    </div>
  );

  return (
    <aside style={sidebarStyle}>
      <div style={styles.logo}>
        <img src={PGLogo} alt="Logo" style={styles.logoImg} />
        <div style={styles.logoText}>Perfect Your Goals</div>
      </div>
      <nav style={styles.nav}>
        {navItem("dashboard", "Dashboard")}
        {navItem("dataEntry", "Data Entry")}
        {navItem("agreement", "Show Agreement")}
        {navItem("instructions", "Instructions")}
        {navItem("withdrawal", "Withdrawal")}
        {navItem("profile", "My Profile", () => {
          onProfileSelect();
          onTabClick("profile");
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

