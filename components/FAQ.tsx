type Q = { q: string; a: React.ReactNode };

const items: Q[] = [
  {
    q: "Preciso mesmo de advogado pra comprar um imóvel?",
    a: (
      <>
        Tecnicamente não é obrigatório, mas o risco de fechar negócio sem
        assessoria é alto: documentação incompleta, dívidas ocultas, registros
        mal lavrados. Análise jurídica prévia evita prejuízo desproporcional
        ao custo dela.
      </>
    ),
  },
  {
    q: "Quanto tempo demora um inventário?",
    a: (
      <>
        Depende do tipo. <strong>Extrajudicial</strong> (em cartório, quando
        herdeiros são maiores e estão de acordo): de 1 a 3 meses.{" "}
        <strong>Judicial</strong>: de 8 meses a vários anos, conforme
        complexidade e congestionamento do fórum.
      </>
    ),
  },
  {
    q: "Em que casos cabe usucapião?",
    a: (
      <>
        Quando há posse mansa, pacífica e contínua do imóvel por prazo legal
        (varia de 2 a 15 anos, conforme a modalidade). Avaliamos requisitos
        específicos no atendimento inicial.
      </>
    ),
  },
  {
    q: "Vocês atendem clientes fora de RJ e ES?",
    a: (
      <>
        Sim, com modalidade de atendimento à distância (videoconferência,
        procurações e documentos digitais). Para causas em outras comarcas,
        atuamos em parceria com correspondentes locais quando necessário.
      </>
    ),
  },
  {
    q: "Como funciona o atendimento à distância?",
    a: (
      <>
        Conversa inicial pelo WhatsApp ou videochamada. Documentos enviados
        digitalmente. Procurações via plataformas com validade jurídica.
        Reuniões periódicas conforme andamento do caso.
      </>
    ),
  },
  {
    q: "É possível parcelar honorários?",
    a: (
      <>
        Sim, condições combinadas caso a caso. Trabalhamos com honorários
        fixos, mistos (entrada + êxito) ou exclusivamente de êxito em
        situações específicas. Tudo formalizado em contrato.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            Perguntas frequentes
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            Dúvidas comuns
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div className="space-y-3">
          {items.map((it) => (
            <details
              key={it.q}
              className="rounded-xl p-5 border bg-page"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <summary
                className="flex justify-between items-center font-medium"
                style={{ color: "var(--bg-dark)" }}
              >
                <span>{it.q}</span>
                <span className="faq-icon text-2xl text-accent font-light">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-dark">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
