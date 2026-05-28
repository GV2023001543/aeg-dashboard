export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: 'grid', active: true },
    { name: 'Projects', icon: 'tiles', active: false },
    { name: 'Key Account Managers', icon: 'user', active: false },
    { name: 'Donors', icon: 'coin', active: false },
    { name: 'Teams', icon: 'team', active: false },
  ];

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
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={item.active ? 'active' : ''}
                  aria-current={item.active ? 'page' : undefined}
                >
                  <Icon name={item.icon} />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
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
