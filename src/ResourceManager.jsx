import { useState } from 'react';

const statusOptions = ['Active', 'Completed', 'On hold'];

const resources = {
  Projects: {
    singular: 'Project',
    fields: [
      { key: 'name', label: 'Project name', required: true },
      { key: 'donor', label: 'Donor' },
      { key: 'manager', label: 'Key account manager' },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'endDate', label: 'End date', type: 'date' },
      { key: 'budget', label: 'Budget (INR)', type: 'number' },
      { key: 'status', label: 'Status', options: statusOptions },
    ],
    rows: [
      { id: 1, name: 'AE Sustainability project', donor: 'Axis Bank Foundation', manager: 'Unassigned', startDate: '2023-04-03', endDate: '2023-05-05', budget: '0', status: 'Active' },
      { id: 2, name: 'BMGF 10k Women AE program', donor: 'BMGF', manager: 'Unassigned', startDate: '2022-01-01', endDate: '2022-12-31', budget: '0', status: 'Completed' },
      { id: 3, name: 'EDF', donor: 'EDF', manager: 'Unassigned', startDate: '2020-09-11', endDate: '2021-09-30', budget: '0', status: 'Completed' },
    ],
  },
  'Key Account Managers': {
    singular: 'Key Account Manager',
    fields: [
      { key: 'name', label: 'Full name', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'projects', label: 'Projects' },
      { key: 'status', label: 'Status', options: statusOptions },
    ],
    rows: [
      { id: 1, name: 'Account Manager 1', email: 'manager1@example.com', phone: '', projects: 'AE Sustainability project', status: 'Active' },
      { id: 2, name: 'Account Manager 2', email: 'manager2@example.com', phone: '', projects: 'BMGF 10k Women AE program', status: 'Active' },
    ],
  },
  Donors: {
    singular: 'Donor',
    fields: [
      { key: 'name', label: 'Organization name', required: true },
      { key: 'contact', label: 'Contact person' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'funding', label: 'Total funding (INR)', type: 'number' },
      { key: 'status', label: 'Status', options: statusOptions },
    ],
    rows: [
      { id: 1, name: 'Axis Bank Foundation', contact: '', email: '', phone: '', funding: '0', status: 'Active' },
      { id: 2, name: 'BMGF', contact: '', email: '', phone: '', funding: '0', status: 'Active' },
      { id: 3, name: 'EDF', contact: '', email: '', phone: '', funding: '0', status: 'Active' },
    ],
  },
  Teams: {
    singular: 'Team',
    fields: [
      { key: 'name', label: 'Team name', required: true },
      { key: 'lead', label: 'Team lead' },
      { key: 'members', label: 'Team members' },
      { key: 'projects', label: 'Projects' },
      { key: 'status', label: 'Status', options: statusOptions },
    ],
    rows: [
      { id: 1, name: 'Project Delivery', lead: '', members: '0', projects: 'AE Sustainability project', status: 'Active' },
      { id: 2, name: 'Field Operations', lead: '', members: '0', projects: 'BMGF 10k Women AE program', status: 'Active' },
    ],
  },
};

function loadRows(section, defaults) {
  const savedRows = window.localStorage.getItem(`aeg-dashboard:${section}`);
  return savedRows === null ? defaults : JSON.parse(savedRows);
}

export default function ResourceManager({ section }) {
  const config = resources[section];
  const [rows, setRows] = useState(() => loadRows(section, config.rows));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [dialog, setDialog] = useState(null);

  const filteredRows = rows.filter((row) => {
    const matchesQuery = Object.values(row)
      .join(' ')
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === 'All statuses' || row.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  function saveRows(nextRows) {
    window.localStorage.setItem(`aeg-dashboard:${section}`, JSON.stringify(nextRows));
    setRows(nextRows);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      config.fields.map((field) => [field.key, String(formData.get(field.key) ?? '')]),
    );

    if (dialog.mode === 'edit') {
      saveRows(rows.map((row) => (row.id === dialog.row.id ? { ...row, ...values } : row)));
    } else {
      saveRows([...rows, { id: Date.now(), ...values }]);
    }
    setDialog(null);
  }

  function deleteRow(row) {
    if (window.confirm(`Delete "${row.name}"? This cannot be undone.`)) {
      saveRows(rows.filter((item) => item.id !== row.id));
    }
  }

  return (
    <section className="resource-page">
      <div className="resource-heading">
        <div>
          <h2>{section}</h2>
          <p>Manage {section.toLowerCase()} and keep their details up to date.</p>
        </div>
        <button className="primary-button" onClick={() => setDialog({ mode: 'create' })}>
          Add {config.singular}
        </button>
      </div>

      <div className="resource-toolbar">
        <label className="search-field">
          <span className="visually-hidden">Search {section}</span>
          <input
            type="search"
            placeholder={`Search ${section.toLowerCase()}...`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="filter-field">
          <span className="visually-hidden">Filter by status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All statuses</option>
            {statusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <span className="result-count">{filteredRows.length} of {rows.length} records</span>
      </div>

      <div className="panel resource-table-panel">
        <div className="table-scroll">
          <table className="resource-table">
            <thead>
              <tr>
                {config.fields.map((field) => <th key={field.key}>{field.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  {config.fields.map((field) => (
                    <td key={field.key}>{row[field.key] || '—'}</td>
                  ))}
                  <td className="row-actions">
                    <button onClick={() => setDialog({ mode: 'view', row })}>View</button>
                    <button onClick={() => setDialog({ mode: 'edit', row })}>Edit</button>
                    <button className="delete-action" onClick={() => deleteRow(row)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={config.fields.length + 1} className="empty-state">
                    No matching records. Try another search or add a new {config.singular.toLowerCase()}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dialog && (
        <div className="dialog-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialog(null);
        }}>
          <section className="resource-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="dialog-heading">
              <h2 id="dialog-title">
                {dialog.mode === 'create' ? `Add ${config.singular}` : `${dialog.mode === 'edit' ? 'Edit' : 'View'} ${config.singular}`}
              </h2>
              <button className="close-button" aria-label="Close dialog" onClick={() => setDialog(null)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="resource-fields">
                {config.fields.map((field) => (
                  <label key={field.key}>
                    <span>{field.label}{field.required && ' *'}</span>
                    {field.options ? (
                      <select
                        name={field.key}
                        defaultValue={dialog.row?.[field.key] || field.options[0]}
                        disabled={dialog.mode === 'view'}
                      >
                        {field.options.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    ) : (
                      <input
                        name={field.key}
                        type={field.type || 'text'}
                        required={field.required}
                        defaultValue={dialog.row?.[field.key] || ''}
                        readOnly={dialog.mode === 'view'}
                        min={field.type === 'number' ? '0' : undefined}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="dialog-actions">
                <button type="button" className="secondary-button" onClick={() => setDialog(null)}>
                  {dialog.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {dialog.mode !== 'view' && (
                  <button type="submit" className="primary-button">
                    {dialog.mode === 'create' ? 'Create' : 'Save changes'}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
