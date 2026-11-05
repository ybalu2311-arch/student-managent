import { useEffect, useMemo, useState } from 'react';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Search, Plus,
  Pencil, Trash2, X, Mail, Phone, Menu, ChevronDown, RefreshCw,
  UserRound, CheckCircle2, CircleAlert
} from 'lucide-react';

const emptyForm = {
  name: '', email: '', department: 'Computer Science', year: '1st Year',
  phone: '', gpa: '8.0', status: 'Active'
};

const departmentColors = {
  'Computer Science': 'blue',
  'Information Technology': 'purple',
  Electronics: 'orange',
  Mechanical: 'green',
  Civil: 'pink'
};

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Unable to load students.');
      setStudents(await response.json());
    } catch {
      setError('Could not connect to the Node.js server. Start the backend and refresh this page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = [student.name, student.id, student.email, student.department]
        .some((value) => String(value).toLowerCase().includes(query));
      const matchesFilter = filter === 'All' || student.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  const activeCount = students.filter((student) => student.status === 'Active').length;
  const averageGpa = students.length
    ? (students.reduce((sum, student) => sum + Number(student.gpa), 0) / students.length).toFixed(2)
    : '0.00';

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingId(student.id);
    setForm({ ...student, gpa: String(student.gpa) });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const url = editingId ? `/api/students/${editingId}` : '/api/students';
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not save student.');
      await loadStudents();
      closeForm();
      setNotice(editingId ? 'Student details updated.' : 'Student added successfully.');
    } catch (err) {
      setNotice(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name} from the student list?`)) return;
    try {
      const response = await fetch(`/api/students/${student.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not delete student.');
      setStudents((current) => current.filter((item) => item.id !== student.id));
      setNotice('Student deleted successfully.');
    } catch (err) {
      setNotice(err.message || 'Something went wrong.');
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={23} /></div>
          <div><strong>CampusDesk</strong><span>STUDENT PORTAL</span></div>
          <button className="icon-button close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="navigation">
          <button className="nav-item active"><LayoutDashboard size={18} /> Dashboard</button>
          <button className="nav-item" onClick={() => { setFilter('All'); setMobileMenu(false); }}><Users size={18} /> Students <span className="nav-count">{students.length}</span></button>
          <button className="nav-item" onClick={() => { setSearch(''); setFilter('Active'); setMobileMenu(false); }}><BookOpen size={18} /> Active students</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><GraduationCap size={17} /></div>
            <strong>Student workspace</strong>
            <p>Manage student records in one simple place.</p>
          </div>
          <div className="profile">
            <div className="profile-avatar">AD</div>
            <div className="profile-info"><strong>Admin User</strong><span>Administrator</span></div>
            <ChevronDown size={16} className="profile-chevron" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="topbar-right"><span className="today-label">Student administration</span><div className="top-avatar">AD</div></div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow">OVERVIEW</div><h1>Student Dashboard</h1><p>Manage student information and academic records.</p></div>
            <button className="primary-button" onClick={openAddForm}><Plus size={18} /> Add student</button>
          </div>

          <section className="stats-grid" aria-label="Student statistics">
            <div className="stat-card"><div className="stat-top"><span>Total students</span><div className="stat-icon purple-bg"><Users size={19} /></div></div><div className="stat-value">{students.length}</div><div className="stat-foot">Registered student records</div></div>
            <div className="stat-card"><div className="stat-top"><span>Active students</span><div className="stat-icon green-bg"><CheckCircle2 size={19} /></div></div><div className="stat-value">{activeCount}</div><div className="stat-foot">Currently active</div></div>
            <div className="stat-card"><div className="stat-top"><span>Inactive students</span><div className="stat-icon orange-bg"><UserRound size={19} /></div></div><div className="stat-value">{students.length - activeCount}</div><div className="stat-foot">Currently inactive</div></div>
            <div className="stat-card"><div className="stat-top"><span>Average GPA</span><div className="stat-icon blue-bg"><GraduationCap size={19} /></div></div><div className="stat-value">{averageGpa}<small>/ 10</small></div><div className="stat-foot">Across all students</div></div>
          </section>

          <section className="table-card">
            <div className="table-heading"><div><h2>Student records</h2><p>View and manage all registered students.</p></div><button className="refresh-button" onClick={loadStudents} title="Refresh records"><RefreshCw size={16} /> Refresh</button></div>
            <div className="table-toolbar">
              <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, ID, email or department..." /></div>
              <select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by status"><option>All</option><option>Active</option><option>Inactive</option></select>
            </div>

            {notice && <div className="notice" role="status"><CheckCircle2 size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
            {error && <div className="error-box"><CircleAlert size={18} /><span>{error}</span><button onClick={loadStudents}>Retry</button></div>}

            <div className="table-wrap">
              <table>
                <thead><tr><th>STUDENT</th><th>STUDENT ID</th><th>DEPARTMENT</th><th>YEAR</th><th>GPA</th><th>STATUS</th><th className="actions-heading">ACTIONS</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan="7" className="empty-state">Loading student records...</td></tr> : visibleStudents.length === 0 ? <tr><td colSpan="7" className="empty-state">No students found. Try a different search or add a student.</td></tr> : visibleStudents.map((student) => (
                    <tr key={student.id}>
                      <td><div className="student-cell"><div className={`student-avatar ${departmentColors[student.department] || 'blue'}`}>{initials(student.name)}</div><div className="student-meta"><strong>{student.name}</strong><span><Mail size={12} /> {student.email}</span></div></div></td>
                      <td><span className="student-id">{student.id}</span></td>
                      <td><span className={`department-tag ${departmentColors[student.department] || 'blue'}`}>{student.department}</span></td>
                      <td>{student.year}</td>
                      <td><span className="gpa-value">{Number(student.gpa).toFixed(1)}</span></td>
                      <td><span className={`status ${student.status.toLowerCase()}`}><i />{student.status}</span></td>
                      <td><div className="row-actions"><button className="action-button edit" onClick={() => openEditForm(student)} title="Edit student"><Pencil size={16} /></button><button className="action-button delete" onClick={() => deleteStudent(student)} title="Delete student"><Trash2 size={16} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing <strong>{visibleStudents.length}</strong> of <strong>{students.length}</strong> students</span><span>Student Management System</span></div>
          </section>
          <footer className="page-footer">© 2026 CampusDesk <span>•</span> Student Management System</footer>
        </section>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
        <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><div className="eyebrow">STUDENT DETAILS</div><h2 id="modal-title">{editingId ? 'Edit student' : 'Add new student'}</h2><p>Enter the student's information below.</p></div><button className="icon-button" onClick={closeForm} aria-label="Close"><X size={20} /></button></div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field full-width">Full name<input name="name" value={form.name} onChange={updateField} placeholder="Enter full name" required /></label>
              <label className="form-field">Email address<input type="email" name="email" value={form.email} onChange={updateField} placeholder="student@example.com" required /></label>
              <label className="form-field">Phone number<input type="tel" name="phone" value={form.phone} onChange={updateField} placeholder="Enter phone number" required /></label>
              <label className="form-field">Department<select name="department" value={form.department} onChange={updateField}><option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical</option><option>Civil</option></select></label>
              <label className="form-field">Academic year<select name="year" value={form.year} onChange={updateField}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label>
              <label className="form-field">GPA (0–10)<input type="number" name="gpa" value={form.gpa} onChange={updateField} min="0" max="10" step="0.1" required /></label>
              <label className="form-field">Status<select name="status" value={form.status} onChange={updateField}><option>Active</option><option>Inactive</option></select></label>
            </div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeForm}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add student'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default App;
