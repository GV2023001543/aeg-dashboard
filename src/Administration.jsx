import { useState } from 'react';

const defaultUsers = [
  { id: 1, name: 'Baskar Reddy', email: 'baskar.reddy@syngenta.com', role: 'Administrator', status: 'Active' },
  { id: 2, name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'Project Manager', status: 'Active' },
  { id: 3, name: 'Jamie Patel', email: 'jamie.patel@example.com', role: 'Contributor', status: 'Active' },
  { id: 4, name: 'Taylor Kim', email: 'taylor.kim@example.com', role: 'Viewer', status: 'Invited' },
];

const permissionNames = ['View', 'Create', 'Edit', 'Delete', 'Export'];
const permissionAreas = ['Projects', 'Donors', 'Teams', 'Users', 'Reports'];
const defaultRoles = [
  { name: 'Administrator', permissions: Object.fromEntries(permissionAreas.map((area) => [area, [...permissionNames]])) },
  { name: 'Project Manager', permissions: { Projects: ['View', 'Create', 'Edit', 'Export'], Donors: ['View'], Teams: ['View', 'Create', 'Edit'], Users: ['View'], Reports: ['View', 'Export'] } },
  { name: 'Contributor', permissions: { Projects: ['View', 'Edit'], Donors: ['View'], Teams: ['View'], Users: [], Reports: ['View'] } },
  { name: 'Viewer', permissions: { Projects: ['View'], Donors: ['View'], Teams: ['View'], Users: [], Reports: ['View'] } },
];

const initialActivity = [
  { id: 1, action: 'Workspace initialized', actor: 'System', time: 'Today', detail: 'Admin console is ready to configure.' },
  { id: 2, action: 'Default roles created', actor: 'System', time: 'Today', detail: 'Administrator, Project Manager, Contributor, and Viewer.' },
];

function readStorage(key, fallback) {
  const value = window.localStorage.getItem(`aeg-dashboard:${key}`);
  return value === null ? fallback : JSON.parse(value);
}

function useStoredValue(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  function updateValue(nextValue) {
    window.localStorage.setItem(`aeg-dashboard:${key}`, JSON.stringify(nextValue));
    setValue(nextValue);
  }

  return [value, updateValue];
}

function formatTime() {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
}

export default function Administration({ section }) {
  const [users, setUsers] = useStoredValue('admin:users', defaultUsers);
  const [roles, setRoles] = useStoredValue('admin:roles', defaultRoles);
  const [activity, setActivity] = useStoredValue('admin:audit', initialActivity);
  const [settings, setSettings] = useStoredValue('admin:settings', {
    organization: 'AEG Foundation',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD MMM YYYY',
    weeklyDigest: true,
    overdueAlerts: true,
    donorUpdates: false,
  });
  const [query, setQuery] = useState('');
  const [userDialog, setUserDialog] = useState(null);
  const [notice, setNotice] = useState('');

  function logActivity(action, detail) {
    setActivity([
      { id: Date.now(), action, actor: 'Baskar Reddy', time: formatTime(), detail },
      ...activity,
    ]);
  }

  function saveUser(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim(),
      role: String(data.get('role')),
      status: String(data.get('status')),
    };
    if (userDialog.mode === 'edit') {
      setUsers(users.map((item) => item.id === userDialog.user.id ? { ...item, ...user } : item));
      logActivity('User updated', `${user.name} · ${user.role}`);
    } else {
      setUsers([{ id: Date.now(), ...user }, ...users]);
      logActivity('User invited', `${user.email} · ${user.role}`);
    }
    setUserDialog(null);
    setNotice(userDialog.mode === 'edit' ? 'User details saved.' : 'User added to the workspace.');
  }

  function togglePermission(roleName, area, permission) {
    const nextRoles = roles.map((role) => {
      if (role.name !== roleName) return role;
      const current = role.permissions[area] || [];
      const next = current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission];
      return { ...role, permissions: { ...role.permissions, [area]: next } };
    });
    setRoles(nextRoles);
    logActivity('Role permissions changed', `${roleName} · ${area} · ${permission}`);
  }

  function saveSettings(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextSettings = {
      organization: String(data.get('organization')).trim(),
      timezone: String(data.get('timezone')),
      dateFormat: String(data.get('dateFormat')),
      weeklyDigest: data.has('weeklyDigest'),
      overdueAlerts: data.has('overdueAlerts'),
      donorUpdates: data.has('donorUpdates'),
    };
    setSettings(nextSettings);
    logActivity('Workspace settings saved', `${nextSettings.organization} · ${nextSettings.timezone}`);
    setNotice('Workspace preferences saved.');
  }

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="admin-page">
      <header className="admin-heading">
        <div>
          <div className="eyebrow">ADMIN CONSOLE</div>
          <h2>{section}</h2>
          <p>Manage workspace access, permissions, and configuration.</p>
        </div>
        <span className="local-data-badge">Local workspace settings</span>
      </header>

      {notice && (
        <div className="admin-notice" role="status">
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button>
        </div>
      )}

      {section === 'User Management' && (
        <UserManagement
          users={users}
          filteredUsers={filteredUsers}
          query={query}
          setQuery={setQuery}
          onAdd={() => setUserDialog({ mode: 'create' })}
          onEdit={(user) => setUserDialog({ mode: 'edit', user })}
          onToggle={(user) => {
            const status = user.status === 'Active' ? 'Suspended' : 'Active';
            setUsers(users.map((item) => item.id === user.id ? { ...item, status } : item));
            logActivity(status === 'Active' ? 'User reactivated' : 'User suspended', user.email);
            setNotice(`${user.name} is now ${status.toLowerCase()}.`);
          }}
          onDelete={(user) => {
            if (window.confirm(`Remove ${user.name} from this workspace?`)) {
              setUsers(users.filter((item) => item.id !== user.id));
              logActivity('User removed', user.email);
              setNotice(`${user.name} was removed from the workspace.`);
            }
          }}
        />
      )}
      {section === 'Roles & Permissions' && <RoleManagement roles={roles} onToggle={togglePermission} />}
      {section === 'Audit Log' && <AuditLog activity={activity} />}
      {section === 'Workspace Settings' && <WorkspaceSettings settings={settings} onSave={saveSettings} />}

      {userDialog && (
        <UserDialog
          dialog={userDialog}
          onClose={() => setUserDialog(null)}
          onSubmit={saveUser}
        />
      )}
    </section>
  );
}

function UserManagement({ users, filteredUsers, query, setQuery, onAdd, onEdit, onToggle, onDelete }) {
  const activeCount = users.filter((user) => user.status === 'Active').length;
  const invitedCount = users.filter((user) => user.status === 'Invited').length;
  const suspendedCount = users.filter((user) => user.status === 'Suspended').length;

  return (
    <>
      <div className="admin-stat-grid">
        <StatCard label="Total users" value={users.length} detail="Workspace accounts" tone="green" />
        <StatCard label="Active" value={activeCount} detail="Can access workspace" tone="blue" />
        <StatCard label="Invited" value={invitedCount} detail="Awaiting activation" tone="amber" />
        <StatCard label="Suspended" value={suspendedCount} detail="Access disabled" tone="red" />
      </div>
      <section className="admin-card">
        <div className="admin-card-heading">
          <div><h3>Workspace users</h3><p>Invite teammates and manage their access level.</p></div>
          <button className="primary-button" onClick={onAdd}>＋ Invite user</button>
        </div>
        <div className="admin-toolbar">
          <input aria-label="Search users" type="search" placeholder="Search name, email or role..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <span>{filteredUsers.length} shown</span>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><div className="user-cell"><span className="user-initial">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
                  <td>{user.role}</td>
                  <td><StatusBadge status={user.status} /></td>
                  <td className="admin-actions"><button onClick={() => onEdit(user)}>Edit</button><button onClick={() => onToggle(user)}>{user.status === 'Active' ? 'Suspend' : 'Activate'}</button><button className="remove-user" onClick={() => onDelete(user)}>Remove</button></td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td className="admin-empty" colSpan="4">No users match your search.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <div className="admin-footnote">User management is a local demo. Invitations and access enforcement require a connected identity provider.</div>
    </>
  );
}

function RoleManagement({ roles, onToggle }) {
  return (
    <>
      <div className="admin-card role-intro">
        <div className="role-intro-icon">✓</div>
        <div><h3>Access by role</h3><p>Select permissions to adjust what each role can do. Changes are saved automatically on this device.</p></div>
      </div>
      <section className="admin-card">
        <div className="admin-card-heading"><div><h3>Permission matrix</h3><p>Configure access for each workspace area.</p></div><span className="permission-legend">Click a check to toggle access</span></div>
        <div className="admin-table-scroll">
          <table className="admin-table permission-table">
            <thead><tr><th>Role</th>{permissionAreas.map((area) => <th key={area}>{area}</th>)}</tr></thead>
            <tbody>{roles.map((role) => (
              <tr key={role.name}>
                <td><strong>{role.name}</strong><small className="role-description">{role.name === 'Administrator' ? 'Full workspace control' : role.name === 'Project Manager' ? 'Manage assigned work' : role.name === 'Contributor' ? 'Update project information' : 'Read-only access'}</small></td>
                {permissionAreas.map((area) => (
                  <td key={area}>
                    <div className="permission-cell">
                      {permissionNames.map((permission) => {
                        const enabled = (role.permissions[area] || []).includes(permission);
                        return (
                          <button
                            key={permission}
                            type="button"
                            className={`permission-toggle ${enabled ? 'enabled' : ''}`}
                            aria-label={`${role.name}: ${permission} ${area} ${enabled ? 'enabled' : 'disabled'}`}
                            aria-pressed={enabled}
                            onClick={() => onToggle(role.name, area, permission)}
                          >
                            {permission.slice(0, 1)}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="permission-key">{permissionNames.map((permission) => <span key={permission}><i>{permission.slice(0, 1)}</i>{permission}</span>)}</div>
      </section>
      <div className="admin-footnote">Role settings describe the demo UI only; they do not enforce permissions without a backend authorization service.</div>
    </>
  );
}

function AuditLog({ activity }) {
  const [filter, setFilter] = useState('All activity');
  const filtered = activity.filter((item) => filter === 'All activity' || item.action.toLowerCase().includes(filter.toLowerCase()));
  return (
    <section className="admin-card">
      <div className="admin-card-heading"><div><h3>Recent activity</h3><p>Review administrative changes made in this workspace.</p></div><select aria-label="Filter audit log" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All activity</option><option>User</option><option>Role</option><option>Workspace</option></select></div>
      <div className="audit-list">
        {filtered.map((item) => (
          <article className="audit-entry" key={item.id}>
            <span className="audit-marker" aria-hidden="true" />
            <div className="audit-copy"><strong>{item.action}</strong><p>{item.detail}</p><small>{item.actor} <span>·</span> {item.time}</small></div>
          </article>
        ))}
        {filtered.length === 0 && <div className="admin-empty">No activity for this filter.</div>}
      </div>
      <div className="admin-footnote">This audit log is stored in this browser and is not a tamper-proof security record.</div>
    </section>
  );
}

function WorkspaceSettings({ settings, onSave }) {
  return (
    <form className="settings-layout" onSubmit={onSave}>
      <section className="admin-card settings-card">
        <div className="admin-card-heading"><div><h3>Organization profile</h3><p>Set the defaults used across your workspace.</p></div></div>
        <div className="settings-fields">
          <label>Organization name<input name="organization" required defaultValue={settings.organization} /></label>
          <label>Timezone<select name="timezone" defaultValue={settings.timezone}><option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option><option value="UTC">Coordinated Universal Time (UTC)</option><option value="America/New_York">Eastern Time (UTC−05:00)</option><option value="Europe/London">London (UTC+00:00)</option></select></label>
          <label>Date format<select name="dateFormat" defaultValue={settings.dateFormat}><option>DD MMM YYYY</option><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></label>
        </div>
      </section>
      <section className="admin-card settings-card">
        <div className="admin-card-heading"><div><h3>Notifications</h3><p>Choose which reminders appear in your workspace.</p></div></div>
        <div className="settings-toggles">
          <ToggleField name="weeklyDigest" label="Weekly summary" detail="A weekly snapshot of project progress." checked={settings.weeklyDigest} />
          <ToggleField name="overdueAlerts" label="Overdue milestone alerts" detail="Highlight milestones past their target date." checked={settings.overdueAlerts} />
          <ToggleField name="donorUpdates" label="Donor updates" detail="Include donor and funding changes." checked={settings.donorUpdates} />
        </div>
      </section>
      <div className="settings-save-row"><span>Changes are stored in this browser.</span><button className="primary-button" type="submit">Save preferences</button></div>
    </form>
  );
}

function ToggleField({ name, label, detail, checked }) {
  return (
    <label className="toggle-field">
      <span><strong>{label}</strong><small>{detail}</small></span>
      <input type="checkbox" name={name} defaultChecked={checked} />
    </label>
  );
}

function UserDialog({ dialog, onClose, onSubmit }) {
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="resource-dialog" role="dialog" aria-modal="true" aria-labelledby="user-dialog-title">
        <div className="dialog-heading"><h2 id="user-dialog-title">{dialog.mode === 'edit' ? 'Edit user' : 'Invite user'}</h2><button className="close-button" aria-label="Close dialog" onClick={onClose}>×</button></div>
        <form onSubmit={onSubmit}>
          <div className="resource-fields">
            <label><span>Full name *</span><input name="name" required defaultValue={dialog.user?.name || ''} /></label>
            <label><span>Email address *</span><input name="email" type="email" required defaultValue={dialog.user?.email || ''} /></label>
            <label><span>Role</span><select name="role" defaultValue={dialog.user?.role || 'Contributor'}>{defaultRoles.map((role) => <option key={role.name}>{role.name}</option>)}</select></label>
            <label><span>Account status</span><select name="status" defaultValue={dialog.user?.status || 'Invited'}><option>Active</option><option>Invited</option><option>Suspended</option></select></label>
          </div>
          <div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">{dialog.mode === 'edit' ? 'Save changes' : 'Add user'}</button></div>
        </form>
      </section>
    </div>
  );
}

function StatCard({ label, value, detail, tone }) {
  return <article className="admin-stat-card"><span className={`stat-icon ${tone}`}>{label === 'Total users' ? 'U' : label === 'Active' ? '✓' : label === 'Invited' ? '＋' : '!'}</span><div><small>{label}</small><strong>{value}</strong><span>{detail}</span></div></article>;
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
}
