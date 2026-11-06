export default function Header({ title }) {
  return (
    <header className="topbar">
      <h1>{title}</h1>

      <div className="user-card">
        <div className="avatar">B</div>
        <div className="user-copy">
          <span>baskar.reddy@syngenta.com</span>
          <strong>ADMIN</strong>
        </div>
      </div>
    </header>
  );
}
