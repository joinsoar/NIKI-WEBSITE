import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <img src="/photogenik.png" alt="Photogenik" />
      </div>
      <div className="meta">
        <span className="meta-subtitle">
          THE FUTURE OF PHOTOGRAPHY IN YOUR POCKET
        </span>
        <span className="meta-issue">ISSUE 01</span>
      </div>
    </header>
  );
}
