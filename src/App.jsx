import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="workspace">
        <Header />
        <main className="dashboard-page">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
