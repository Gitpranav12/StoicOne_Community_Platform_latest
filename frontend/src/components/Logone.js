import "../components/Logone.css";

export default function Logone() {
  return (
    <>
      <div className="logone-container">
        <div className="logone-text">
          <span className="blue">Stoic</span>
          <img src="/logo-modified.png" alt="O Logo" className="logone-o" />
          <span className="black">ne</span>
          <span className="sub d-none d-md-block">Community</span>
        </div>
      </div>
    </>
  );
}
