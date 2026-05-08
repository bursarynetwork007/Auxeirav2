// SVG diagram: The Auxeira Evidence Intelligence Framework
// Extract (Longitudinal Evidence Audit) → Synthesise (Decision-Ready Synthesis Engine) → Move (Knowledge Products That Move)

export default function FrameworkDiagram() {
  return (
    <svg
      viewBox="0 0 900 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-3xl mx-auto"
      aria-label="The Auxeira Evidence Intelligence Framework: Extract, Synthesise, Move"
      role="img"
    >
      {/* ── Node 1: Extract ── */}
      <rect x="0" y="40" width="240" height="140" rx="2" fill="#0f1f3d" stroke="#C9A84C" strokeWidth="1" />
      <text x="120" y="82" textAnchor="middle" fill="#C9A84C" fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="3" fontWeight="500">01</text>
      <text x="120" y="108" textAnchor="middle" fill="#F5F0E8" fontSize="15" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">The Longitudinal</text>
      <text x="120" y="128" textAnchor="middle" fill="#F5F0E8" fontSize="15" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">Evidence Audit</text>
      <text x="120" y="152" textAnchor="middle" fill="#F5F0E8" fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.5" letterSpacing="2">EXTRACT</text>

      {/* ── Arrow 1 → 2 ── */}
      <line x1="244" y1="110" x2="326" y2="110" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 3" />
      <polygon points="326,105 338,110 326,115" fill="#C9A84C" />

      {/* ── Node 2: Synthesise ── */}
      <rect x="330" y="40" width="240" height="140" rx="2" fill="#0f1f3d" stroke="#C9A84C" strokeWidth="1" />
      <text x="450" y="82" textAnchor="middle" fill="#C9A84C" fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="3" fontWeight="500">02</text>
      <text x="450" y="108" textAnchor="middle" fill="#F5F0E8" fontSize="15" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">The Decision-Ready</text>
      <text x="450" y="128" textAnchor="middle" fill="#F5F0E8" fontSize="15" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">Synthesis Engine</text>
      <text x="450" y="152" textAnchor="middle" fill="#F5F0E8" fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.5" letterSpacing="2">SYNTHESISE</text>

      {/* ── Arrow 2 → 3 ── */}
      <line x1="574" y1="110" x2="656" y2="110" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 3" />
      <polygon points="656,105 668,110 656,115" fill="#C9A84C" />

      {/* ── Node 3: Move ── */}
      <rect x="660" y="40" width="240" height="140" rx="2" fill="#C9A84C" stroke="#C9A84C" strokeWidth="1" />
      <text x="780" y="82" textAnchor="middle" fill="#0A1628" fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="3" fontWeight="500">03</text>
      <text x="780" y="108" textAnchor="middle" fill="#0A1628" fontSize="15" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">Knowledge Products</text>
      <text x="780" y="128" textAnchor="middle" fill="#0A1628" fontSize="15" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600">That Move</text>
      <text x="780" y="152" textAnchor="middle" fill="#0A1628" fontSize="10" fontFamily="DM Sans, sans-serif" opacity="0.6" letterSpacing="2">MOVE</text>

      {/* ── Framework label ── */}
      <text x="450" y="210" textAnchor="middle" fill="#C9A84C" fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="3" opacity="0.6">THE AUXEIRA EVIDENCE INTELLIGENCE FRAMEWORK</text>
    </svg>
  );
}
