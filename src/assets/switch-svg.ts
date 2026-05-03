import { svg } from "lit";

export const svgHandheld = svg`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="nscJcL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#26d0f0"/>
      <stop offset="50%" stop-color="#0AB9E6"/>
      <stop offset="100%" stop-color="#0780a3"/>
    </linearGradient>
    <linearGradient id="nscJcR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stop-color="#ff2c3d"/>
      <stop offset="50%" stop-color="#E60012"/>
      <stop offset="100%" stop-color="#9c0010"/>
    </linearGradient>
    <linearGradient id="nscBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2e2e2e"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="nscStick" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#5a5a5a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <radialGradient id="nscBtn" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#5e5e5e"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </radialGradient>
  </defs>
  <ellipse cx="300" cy="194" rx="270" ry="5" fill="#000" opacity="0.18"/>
  <!-- Joy-Con L -->
  <path d="M 22 14 Q 4 14 4 36 L 4 164 Q 4 186 22 186 L 60 186 L 60 14 Z" fill="url(#nscJcL)"/>
  <circle cx="22" cy="42" r="11" fill="url(#nscStick)"/>
  <circle cx="22" cy="42" r="8" fill="#0a0a0a"/>
  <circle cx="32" cy="86" r="5" fill="url(#nscBtn)"/>
  <circle cx="32" cy="116" r="5" fill="url(#nscBtn)"/>
  <circle cx="18" cy="101" r="5" fill="url(#nscBtn)"/>
  <circle cx="46" cy="101" r="5" fill="url(#nscBtn)"/>
  <rect x="44" y="38" width="9" height="2" rx="1" fill="#0780a3"/>
  <rect x="42" y="148" width="9" height="9" rx="1.5" fill="url(#nscBtn)"/>
  <!-- Tablet -->
  <rect x="60" y="14" width="3" height="172" fill="#000" opacity="0.55"/>
  <rect x="63" y="6" width="474" height="188" rx="10" fill="url(#nscBody)"/>
  <rect x="71" y="20" width="458" height="160" rx="4" fill="#040404"/>
  <rect x="79" y="26" width="442" height="148" rx="2" fill="#0c0c0c"/>
  <rect x="294" y="190" width="14" height="2" rx="1" fill="#000" opacity="0.7"/>
  <!-- Joy-Con R -->
  <rect x="537" y="14" width="3" height="172" fill="#000" opacity="0.55"/>
  <path d="M 540 14 L 540 186 L 578 186 Q 596 186 596 164 L 596 36 Q 596 14 578 14 Z" fill="url(#nscJcR)"/>
  <circle cx="572" cy="42" r="6" fill="url(#nscBtn)"/>
  <text x="572" y="45" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">X</text>
  <circle cx="586" cy="56" r="6" fill="url(#nscBtn)"/>
  <text x="586" y="59" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">A</text>
  <circle cx="558" cy="56" r="6" fill="url(#nscBtn)"/>
  <text x="558" y="59" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">Y</text>
  <circle cx="572" cy="70" r="6" fill="url(#nscBtn)"/>
  <text x="572" y="73" font-size="7" fill="#aaa" text-anchor="middle" font-weight="bold">B</text>
  <circle cx="578" cy="138" r="11" fill="url(#nscStick)"/>
  <circle cx="578" cy="138" r="8" fill="#0a0a0a"/>
  <g stroke="#9c0010" stroke-width="2" stroke-linecap="round">
    <line x1="548" y1="38" x2="556" y2="38"/>
    <line x1="552" y1="34" x2="552" y2="42"/>
  </g>
  <circle cx="552" cy="158" r="5" fill="#0a0a0a"/>
  <circle cx="552" cy="158" r="4.5" fill="none" stroke="#aaa" stroke-width="0.6" opacity="0.4"/>
</svg>
`;
