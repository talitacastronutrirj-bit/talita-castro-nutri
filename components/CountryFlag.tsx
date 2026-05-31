// =================================================================
// CountryFlag — bandeiras SVG inline (funcionam em qualquer SO/browser)
// =================================================================
//
// Windows 10/11 não renderiza emojis de bandeira Unicode — mostra só
// "BR US IT" como letras. Esse componente garante que as bandeiras
// apareçam sempre, independente do sistema do visitante.
//
// Substituídos no TrustBar quando o admin escreve códigos de bandeira
// no formato Unicode (🇧🇷, 🇺🇸, 🇮🇹...) — convertemos automaticamente.
//
// Catálogo de bandeiras suportadas. Quando o cliente usa um país que
// não está aqui, mostramos o emoji original (que pode ou não renderizar
// dependendo do SO).

type Props = {
  code: string; // ISO-3166-1 alpha-2: "br", "us", "it", "gb", "fr"...
  className?: string;
  title?: string;
};

const W = 24; // largura padrão do viewBox

export function CountryFlag({ code, className = "inline-block w-7 h-5 align-middle", title }: Props) {
  const c = code.toLowerCase();
  const commonProps = {
    className,
    viewBox: `0 0 ${W} 16`,
    role: "img" as const,
    "aria-label": title ?? c.toUpperCase(),
    style: { borderRadius: 2, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" },
  };

  switch (c) {
    case "br":
      // Brasil: verde + losango amarelo + círculo azul (simplificado)
      return (
        <svg {...commonProps}>
          <rect width={W} height="16" fill="#009c3b" />
          <polygon points="12,2 22,8 12,14 2,8" fill="#ffdf00" />
          <circle cx="12" cy="8" r="3.2" fill="#002776" />
        </svg>
      );
    case "us":
      // EUA: 13 listras (simplificado pra 7 visíveis em viewbox pequena) + canto azul
      return (
        <svg {...commonProps}>
          <rect width={W} height="16" fill="#bf0a30" />
          {[1, 3, 5, 7, 9, 11, 13].map((y) => (
            <rect key={y} y={y} width={W} height="1.15" fill="#fff" />
          ))}
          <rect width="10" height="8" fill="#002868" />
          {/* Pequenos pontos pra simular as estrelas */}
          {[
            [2, 1.5], [4, 1.5], [6, 1.5], [8, 1.5],
            [3, 3], [5, 3], [7, 3],
            [2, 4.5], [4, 4.5], [6, 4.5], [8, 4.5],
            [3, 6], [5, 6], [7, 6],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="0.4" fill="#fff" />
          ))}
        </svg>
      );
    case "it":
      // Itália: 3 stripes verticais verde-branco-vermelho
      return (
        <svg {...commonProps}>
          <rect width={W / 3} height="16" fill="#008c45" />
          <rect x={W / 3} width={W / 3} height="16" fill="#fff" />
          <rect x={(W / 3) * 2} width={W / 3} height="16" fill="#cd212a" />
        </svg>
      );
    case "fr":
      // França: azul-branco-vermelho vertical
      return (
        <svg {...commonProps}>
          <rect width={W / 3} height="16" fill="#002654" />
          <rect x={W / 3} width={W / 3} height="16" fill="#fff" />
          <rect x={(W / 3) * 2} width={W / 3} height="16" fill="#ed2939" />
        </svg>
      );
    case "pt":
      // Portugal: verde + vermelho 60/40 vertical (sem brasão pra simplicidade)
      return (
        <svg {...commonProps}>
          <rect width={W * 0.4} height="16" fill="#046a38" />
          <rect x={W * 0.4} width={W * 0.6} height="16" fill="#da291c" />
          <circle cx={W * 0.4} cy="8" r="2.2" fill="#fee100" stroke="#fff" strokeWidth="0.3" />
        </svg>
      );
    case "es":
      // Espanha: 3 listras vermelho-amarelo-vermelho (amarelo mais grossa)
      return (
        <svg {...commonProps}>
          <rect width={W} height="4" fill="#aa151b" />
          <rect y="4" width={W} height="8" fill="#f1bf00" />
          <rect y="12" width={W} height="4" fill="#aa151b" />
        </svg>
      );
    case "gb":
    case "uk":
      // Reino Unido: cruzes vermelho/branco/azul (simplificado)
      return (
        <svg {...commonProps}>
          <rect width={W} height="16" fill="#012169" />
          <path d={`M0,0 L${W},16 M${W},0 L0,16`} stroke="#fff" strokeWidth="2.2" />
          <path d={`M0,0 L${W},16 M${W},0 L0,16`} stroke="#c8102e" strokeWidth="1" />
          <path d={`M${W / 2},0 L${W / 2},16 M0,8 L${W},8`} stroke="#fff" strokeWidth="3" />
          <path d={`M${W / 2},0 L${W / 2},16 M0,8 L${W},8`} stroke="#c8102e" strokeWidth="1.5" />
        </svg>
      );
    case "de":
      // Alemanha: 3 listras preto-vermelho-amarelo
      return (
        <svg {...commonProps}>
          <rect width={W} height="5.33" fill="#000" />
          <rect y="5.33" width={W} height="5.33" fill="#dd0000" />
          <rect y="10.66" width={W} height="5.34" fill="#ffce00" />
        </svg>
      );
    case "ca":
      // Canadá: branco + duas bandas vermelhas + folha de maple (simplificada)
      return (
        <svg {...commonProps}>
          <rect width={W * 0.25} height="16" fill="#d52b1e" />
          <rect x={W * 0.25} width={W * 0.5} height="16" fill="#fff" />
          <rect x={W * 0.75} width={W * 0.25} height="16" fill="#d52b1e" />
          <path d={`M${W / 2},4 l1,2 l2,-1 l-1,2 l2,1 l-2,1 l1,2 l-2,-1 l-1,2 l-1,-2 l-2,1 l1,-2 l-2,-1 l2,-1 l-1,-2 l2,1 z`} fill="#d52b1e" />
        </svg>
      );
    case "ar":
      // Argentina: azul claro + branco + azul claro
      return (
        <svg {...commonProps}>
          <rect width={W} height="5.33" fill="#74acdf" />
          <rect y="5.33" width={W} height="5.33" fill="#fff" />
          <rect y="10.66" width={W} height="5.34" fill="#74acdf" />
          <circle cx={W / 2} cy="8" r="1.2" fill="#f6b40e" />
        </svg>
      );
    case "mx":
      // México: verde-branco-vermelho vertical
      return (
        <svg {...commonProps}>
          <rect width={W / 3} height="16" fill="#006847" />
          <rect x={W / 3} width={W / 3} height="16" fill="#fff" />
          <rect x={(W / 3) * 2} width={W / 3} height="16" fill="#ce1126" />
        </svg>
      );
    default:
      // Fallback: caixinha cinza com o código
      return (
        <span
          className={className}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ddd",
            borderRadius: 2,
            fontSize: "0.7em",
            fontWeight: 600,
            color: "#555",
            padding: "0 4px",
          }}
          title={title ?? c.toUpperCase()}
        >
          {c.toUpperCase()}
        </span>
      );
  }
}

// =================================================================
// Conversão de emojis Unicode pra códigos ISO
// =================================================================
//
// Cada bandeira Unicode é formada por 2 "Regional Indicator Symbols":
// U+1F1E6 (🇦) até U+1F1FF (🇿). Subtraindo U+1F1E6 e somando 'A',
// reconstruímos as letras do código ISO.
//
// Ex: 🇧🇷 = U+1F1E7 (B) + U+1F1F7 (R) → "BR" → bandeira do Brasil

export function flagCodeFromEmoji(emoji: string): string | null {
  const chars = [...emoji];
  if (chars.length !== 2) return null;
  const base = 0x1f1e6;
  const aCode = 0x41; // 'A'
  const codepoints = chars.map((c) => c.codePointAt(0) ?? 0);
  if (codepoints.some((cp) => cp < base || cp > base + 25)) return null;
  return String.fromCharCode(...codepoints.map((cp) => aCode + (cp - base)));
}
