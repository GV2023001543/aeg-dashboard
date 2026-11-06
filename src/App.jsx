import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import ResourceManager from './ResourceManager';
import Administration from './Administration';

const administrationSections = [
  'User Management',
  'Roles & Permissions',
  'Audit Log',
  'Workspace Settings',
];

export default function App() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleSectionSelect = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSelect={handleSectionSelect} />
      <div className="workspace">
        <Header title={activeSection} />
        <main className="dashboard-page">
          {activeSection === 'Dashboard' ? (
            <Dashboard />
          ) : administrationSections.includes(activeSection) ? (
            <Administration key={activeSection} section={activeSection} />
          ) : (
            <ResourceManager key={activeSection} section={activeSection} />
          )}
        </main>
      </div>
    </div>
  );
}
