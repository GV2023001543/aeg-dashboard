export default function Sidebar({ activeSection, onSelect }) {
  const menuItems = [
    { name: 'Dashboard', icon: 'grid' },
    { name: 'Projects', icon: 'tiles' },
    { name: 'Key Account Managers', icon: 'user' },
    { name: 'Donors', icon: 'coin' },
    { name: 'Teams', icon: 'team' },
  ];

  const adminItems = [
    { name: 'User Management', icon: 'user' },
    { name: 'Roles & Permissions', icon: 'shield' },
    { name: 'Audit Log', icon: 'activity' },
    { name: 'Workspace Settings', icon: 'settings' },
  ];

  const renderItem = (item) => (
    <li key={item.name}>
      <a
        href="#"
        className={activeSection === item.name ? 'active' : ''}
        aria-current={activeSection === item.name ? 'page' : undefined}
        onClick={(event) => {
          event.preventDefault();
          onSelect(item.name);
        }}
      >
        <Icon name={item.icon} />
        {item.name}
      </a>
    </li>
  );

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <span className="brand-mark">
            aeg<span>foundation</span><sup>R</sup>
          </span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <ul>
            {menuItems.map(renderItem)}
          </ul>
          <div className="nav-section-label">ADMINISTRATION</div>
          <ul>{adminItems.map(renderItem)}</ul>
        </nav>
      </div>

      <div className="logout">
        <Icon name="logout" />
        <span>Logout</span>
      </div>
    </aside>
  );
}

function Icon({ name }) {
  return <span className={`nav-icon nav-icon-${name}`} aria-hidden="true" />;
}
