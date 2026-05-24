import React from "react";

/**
 * Renderiza o texto do heading do hero suportando 2 marcações simples:
 *
 * - Quebra de linha (\n)         → <br />
 * - *texto entre asteriscos*     → vira span dourado/itálico/destacado
 *
 * Implementação propositalmente conservadora: não usa dangerouslySetInnerHTML.
 * Cada caractere fora dos padrões é renderizado como texto literal.
 *
 * Exemplo:
 *
 *   Direito Imobiliário,
 *   com tradição
 *   *registral e notarial*.
 *
 * Renderiza:
 *
 *   Direito Imobiliário,
 *   com tradição
 *   <span class="hero-highlight">registral e notarial</span>.
 */
export function renderHeroHeading(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, lineIdx) => (
    <React.Fragment key={lineIdx}>
      {parseInlineHighlights(line)}
      {lineIdx < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

function parseInlineHighlights(line: string): React.ReactNode[] {
  // Split mantendo os delimitadores; cada *...* vira um grupo capturado.
  const parts = line.split(/(\*[^*\n]+\*)/g);

  return parts.map((part, i) => {
    const isHighlight =
      part.length >= 2 && part.startsWith("*") && part.endsWith("*");

    if (isHighlight) {
      const inner = part.slice(1, -1);
      return (
        <span
          key={i}
          className="italic text-accent-bright"
          style={{
            textShadow:
              "0 2px 3px rgba(0,0,0,0.95), 0 4px 10px rgba(0,0,0,0.8), 0 8px 22px rgba(0,0,0,0.6)",
          }}
        >
          {inner}
        </span>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
