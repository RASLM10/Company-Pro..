import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './react.css';

async function apiFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const csrfResponse = await fetch('/api/auth/csrf', { credentials: 'same-origin' });
    if (csrfResponse.ok) {
      const csrf = await csrfResponse.json();
      headers.set(csrf.headerName || 'X-CSRF-TOKEN', csrf.token);
    }
  }
  const response = await fetch(url, { ...options, headers, credentials: 'same-origin' });
  if (response.status === 401 && window.location.pathname.startsWith('/employees')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('companyEmployees');
    localStorage.removeItem('companyDepartments');
    window.location.replace('/legacy/login.html');
  }
  return response;
}

function App() {
  const [count, setCount] = useState('—');
  const [departmentCount, setDepartmentCount] = useState('—');
  const employeeRoute = window.location.pathname === '/employees';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  useEffect(() => {
    if (employeeRoute && !isLoggedIn) {
      window.location.replace('/legacy/login.html');
      return;
    }
    if (employeeRoute) {
      apiFetch('/api/auth/me').then(response => { if (!response.ok) window.location.replace('/legacy/login.html'); });
      return;
    }
    fetch('/api/public/summary').then(r => r.ok ? r.json() : Promise.reject()).then(summary => { setCount(summary.employees); setDepartmentCount(summary.departments); }).catch(() => { setCount('—'); setDepartmentCount('—'); });
  }, [employeeRoute, isLoggedIn]);
  if (employeeRoute && !isLoggedIn) return <main className="employee-app"/>;
  if (employeeRoute) return <EmployeesPage/>;
  return <>
    <section className="hero"><nav className="landing-nav"><a className="logo-large" href="/"><i className="fas fa-building"/><span>CompanyPro</span></a><div className="nav-links"><a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a><a className="btn-login" href="/legacy/login.html">Admin Login</a></div></nav>
      <div className="hero-content"><div className="hero-text"><h1 className="hero-title">Manage Your Workforce <br/><span className="gradient-text">Efficiently &amp; Effectively</span></h1><p className="hero-description">CompanyPro is a comprehensive employee management system designed to streamline HR operations, boost productivity, and enhance organizational efficiency.</p><div className="hero-buttons"><a className="btn-primary-large" href="/legacy/login.html"><i className="fas fa-rocket"/> Get Started</a><a className="btn-secondary-large" href="#features"><i className="fas fa-play-circle"/> Learn More</a></div><div className="hero-stats"><div className="stat-item"><h3>{count}</h3><p>Employees</p></div><div className="stat-item"><h3>{departmentCount}</h3><p>Departments</p></div><div className="stat-item"><h3>6</h3><p>People tools</p></div></div></div><div className="hero-image"><div className="hero-card"><i className="fas fa-chart-line"/><h3>Real-time Analytics</h3><p>Track performance metrics instantly</p></div><div className="hero-card"><i className="fas fa-users"/><h3>Team Management</h3><p>Organize and manage teams efficiently</p></div><div className="hero-card"><i className="fas fa-shield-alt"/><h3>Secure &amp; Reliable</h3><p>Manage company records with confidence</p></div></div></div>
    </section>
    <section id="features" className="features-section"><div className="section-heading"><h2>Powerful Features</h2><p>Everything you need to manage your workforce</p></div><div className="features-grid">{[
      ['users-cog','Employee Management','Manage employee profiles, roles, and contact details.','/employees'],
      ['chart-bar','Analytics Dashboard','Review workforce summaries and activity.','/legacy/reports.html'],
      ['sitemap','Department Management','Organize teams and keep department information current.','/legacy/departments.html'],
      ['file-invoice-dollar','Payroll Insights','Review salary details and payroll summaries.','/legacy/reports.html'],
      ['calendar-check','Attendance Tracking','See employee status, attendance, and leave information.','/legacy/reports.html'],
      ['file-alt','Custom Reports','Generate reports, preview them, then download when needed.','/legacy/reports.html']
    ].map(([icon,title,copy,href])=><a className="feature-card" href={href} key={title}><i className={`fas fa-${icon}`}/><h3>{title}</h3><p>{copy}</p></a>)}</div></section>
    <section id="about" className="landing-about"><div><span className="contact-eyebrow">ABOUT COMPANYPRO</span><h2>People operations, all in one place.</h2></div><p>Keep employee records, departments, and workforce reports together in a single workspace. Sign in to manage your company data.</p><a href="/legacy/login.html">Open admin portal <i className="fas fa-arrow-right"/></a></section>
    <section id="contact" className="landing-contact"><div className="section-heading"><span className="contact-eyebrow">CONTACT</span><h2>Get in touch</h2><p>Have a question about CompanyPro? Reach out using the details below.</p></div><div className="contact-grid"><a className="contact-card" href="mailto:info@companypro.com"><i className="fas fa-envelope"/><span><small>EMAIL</small><strong>info@companypro.com</strong></span><i className="fas fa-arrow-up-right-from-square"/></a><a className="contact-card" href="tel:+911234567890"><i className="fas fa-phone"/><span><small>PHONE</small><strong>+91 123 456 7890</strong></span><i className="fas fa-arrow-up-right-from-square"/></a></div></section>
    <footer className="landing-footer">CompanyPro <span>Workforce management, made simple.</span><a href="#contact">Contact us <i className="fas fa-arrow-up"/></a></footer>
  </>;
}

function EmployeesPage() {
  const empty = {name:'',email:'',phone:'',department:'',position:'',salary:'',joiningDate:'',status:'active',address:''};
  const [employees,setEmployees]=useState([]), [query,setQuery]=useState(''), [form,setForm]=useState(null), [editing,setEditing]=useState(null), [error,setError]=useState(''), [busy,setBusy]=useState(false);
  async function load(){try{const [employeeResponse,departmentResponse]=await Promise.all([apiFetch('/api/employees'),apiFetch('/api/departments')]);if(!employeeResponse.ok||!departmentResponse.ok)throw new Error('Could not load company data. Is the API running?');const [rows,departments]=await Promise.all([employeeResponse.json(),departmentResponse.json()]);setEmployees(rows);localStorage.setItem('companyEmployees',JSON.stringify(rows.map(employee=>({...employee,id:employee.employeeCode}))));localStorage.setItem('companyDepartments',JSON.stringify(departments.map(department=>({...department,id:department.departmentCode}))));setError('');}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  const visible=employees.filter(e=>(`${e.name} ${e.email} ${e.department} ${e.employeeCode}`).toLowerCase().includes(query.toLowerCase()));
  function startEdit(employee){setEditing(employee.id);setForm({...employee,salary:employee.salary??''});setError('');}
  async function submit(event){event.preventDefault();setBusy(true);setError('');const body={...form,salary:form.salary===''?null:Number(form.salary),joiningDate:form.joiningDate||null};try{const response=await apiFetch(editing?`/api/employees/${editing}`:'/api/employees',{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.message||'Could not save employee. Check the required fields and email address.');}setForm(null);setEditing(null);await load();}catch(e){setError(e.message);}finally{setBusy(false);}}
  async function remove(employee){if(!window.confirm(`Delete ${employee.name}?`))return;try{const response=await apiFetch(`/api/employees/${employee.id}`,{method:'DELETE'});if(!response.ok)throw new Error('Could not delete employee.');await load();}catch(e){setError(e.message);}}
  return <main className="employee-app"><header className="employee-top"><a className="employee-brand" href="/"><i className="fas fa-building"/> CompanyPro</a><a className="employee-back" href="/">← Home</a></header><section className="employee-content"><div className="employee-title"><div><p className="eyebrow">PEOPLE OPERATIONS</p><h1>Employees</h1><p className="subhead">Manage your company directory and employee records.</p></div><button className="employee-add" onClick={()=>{setEditing(null);setForm({...empty});setError('');}}>＋ Add employee</button></div><div className="employee-toolbar"><div className="employee-search"><i className="fas fa-search"/><input placeholder="Search name, email, department…" value={query} onChange={e=>setQuery(e.target.value)}/></div><span>{visible.length} {visible.length===1?'employee':'employees'}</span></div>{error&&<div className="employee-error">{error}</div>}<div className="employee-table-wrap"><table className="api-employee-table"><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>POSITION</th><th>STATUS</th><th> </th></tr></thead><tbody>{visible.map(e=><tr key={e.id}><td><strong>{e.name}</strong><small>{e.employeeCode} · {e.email}</small></td><td>{e.department}</td><td>{e.position||'—'}</td><td><span className="employee-pill">{e.status||'active'}</span></td><td className="employee-actions"><button onClick={()=>startEdit(e)}>Edit</button><button className="delete-action" onClick={()=>remove(e)}>Delete</button></td></tr>)}{visible.length===0&&<tr><td colSpan="5" className="empty-employees">{error?'Start the Spring Boot backend to load your database.':'No employees match this search.'}</td></tr>}</tbody></table></div></section>{form&&<div className="employee-overlay" onMouseDown={e=>{if(e.target===e.currentTarget){setForm(null);setEditing(null);}}}><form className="employee-form" onSubmit={submit}><button className="form-close" type="button" onClick={()=>{setForm(null);setEditing(null);}}>×</button><p className="eyebrow">EMPLOYEE RECORD</p><h2>{editing?'Edit employee':'Add employee'}</h2><div className="employee-fields">{[['name','Full name','text',true],['email','Work email','email',true],['phone','Phone','tel',false],['department','Department','text',true],['position','Position','text',false],['salary','Salary','number',false],['joiningDate','Joining date','date',false],['status','Status','text',false],['address','Location','text',false]].map(([key,label,type,required])=><label key={key}>{label}<input type={type} required={required} min={type==='number'?'0':undefined} value={form[key]??''} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}</div>{error&&<div className="employee-error">{error}</div>}<div className="form-actions"><button type="button" className="cancel-action" onClick={()=>{setForm(null);setEditing(null);}}>Cancel</button><button className="employee-add" disabled={busy}>{busy?'Saving…':'Save employee'}</button></div></form></div>}</main>;
}

createRoot(document.getElementById('root')).render(<App/>);
