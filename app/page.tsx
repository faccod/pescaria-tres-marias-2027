import {
  getData,
  formatBRL,
  formatDateBR,
  formatDateTimeBR,
  calcularResumo,
  statusBadge,
  type Pescador,
} from "../lib/data";

export default function HomePage() {
  const d = getData();
  const resumo = calcularResumo();
  const matheus = d.equipe.find((p) => p.slug === "matheus")!;
  const amigos = d.equipe.filter((p) => p.slug !== "matheus");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-700">Expedição 2027</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
           {d.viajem.nome}
        </h1>
        <p className="mt-2 text-slate-600">{d.viajem.destino}</p>
        <p className="mt-1 text-sm text-slate-500">
          Saída <strong className="text-slate-700">{formatDateBR(d.viajem.saida)}</strong> (madrugada de {d.viajem.saida_local}) → Retorno{" "}
          <strong className="text-slate-700">{formatDateBR(d.viajem.retorno)}</strong> • {d.viajem.duracao}
        </p>
      </header>

      {/* Resumo Financeiro */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Resumo Financeiro</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card titulo="Total Contratado" valor={formatBRL(resumo.total_contratado)} sub="Guia + Chalé + Casco" cor="border-slate-300" />
          <Card titulo="Pago Antecipado" valor={formatBRL(resumo.total_pago_antecipado)} sub={`Por Matheus (50% geral)`} cor="border-sky-400" />
          <Card titulo="Falta Receber" valor={formatBRL(resumo.falta_receber)} sub={`De ${amigos.filter((p) => p.status !== "quitado").length} amigo(s)`} cor="border-amber-400" />
        </div>
        <p className="mt-4 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
          <strong>Matheus adiantou</strong> {formatBRL(resumo.total_pago_antecipado)} em sinais.{" "}
          Ele tem <strong className="text-emerald-700">{formatBRL(resumo.reembolso_total_esperado)}</strong> a reaver —{" "}
          já recebeu <strong className="text-blue-700">{formatBRL(resumo.reembolso_recebido)}</strong>,{" "}
          falta <strong className="text-amber-700">{formatBRL(resumo.falta_receber)}</strong>.
        </p>
      </section>

      {/* Cards por Amigo — O CORAÇÃO DA PÁGINA */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Situação de Cada Amigo</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {amigos.map((p) => (
            <AmigoCard key={p.slug} pescador={p} pix={d.pix_matheus} />
          ))}
        </div>
      </section>

      {/* Fornecedores — compacto */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Fornecedores Contratados</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-right">Pago</th>
                <th className="px-4 py-2 text-right">Saldo na Viagem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {d.fornecedores.map((f) => (
                <tr key={f.id}>
                  <td className="px-4 py-2 font-medium">{f.item}</td>
                  <td className="px-4 py-2 text-right">{f.total > 0 ? formatBRL(f.total) : <span className="text-slate-400">a definir</span>}</td>
                  <td className="px-4 py-2 text-right">
                    {f.sinal_pago > 0 ? <span className="text-emerald-700">{formatBRL(f.sinal_pago)}</span> : <span className="text-slate-400">–</span>}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {f.saldo_viagem > 0 ? formatBRL(f.saldo_viagem) : <span className="text-slate-400">–</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comprovantes — resumo */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Comprovantes <span className="text-sm font-normal text-slate-500">({d.comprovantes.length} registrados)</span>
        </h2>
        <div className="space-y-2">
          {d.comprovantes.map((c) => (
            <details key={c.id} className="group rounded-lg border border-slate-200 bg-white shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between p-3 hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700">{c.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.tipo === "recebido" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {c.tipo === "recebido" ? "Recebido" : "Pago"}
                  </span>
                  <span className="text-sm text-slate-700">{c.descricao}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-slate-900">{formatBRL(c.valor)}</span>
                  <svg className="h-4 w-4 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="border-t border-slate-100 p-3 text-xs text-slate-600">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div><span className="block font-semibold">Data</span>{formatDateTimeBR(c.data)}</div>
                  <div><span className="block font-semibold">Favorecido</span>{c.favorecido}</div>
                  <div><span className="block font-semibold">Autenticação</span><span className="font-mono">{c.autenticacao}</span></div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Checklist — compacto */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Checklist de Bagagem & Rancho
          <span className="ml-2 text-sm font-normal text-amber-700">⚠️ Roupa de cama/banho: cada um leva o seu</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {d.checklist.map((cat) => (
            <div key={cat.categoria} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">{cat.categoria}</h3>
              <ul className="space-y-1 text-sm">
                {cat.itens.map((it) => (
                  <li key={it.nome} className="text-slate-700">
                    • {it.nome}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        Atualizado em {new Date().toLocaleDateString("pt-BR")} • App mantido por Matheus (controle via chat com Mavis)
      </footer>
    </main>
  );
}

function Card({ titulo, valor, sub, cor }: { titulo: string; valor: string; sub: string; cor: string }) {
  return (
    <div className={`rounded-xl border-2 bg-white p-4 shadow-sm ${cor}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{titulo}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{valor}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function AmigoCard({ pescador, pix }: { pescador: Pescador; pix: { titular: string; chave: string; banco: string; obs: string } }) {
  const badge = statusBadge(pescador.status);
  const sinalFaltante = pescador.sinal_esperado - pescador.sinal_repassado;
  const saldoNaPousada = pescador.saldo_devedor - sinalFaltante;
  const precisaPagarMatheus = sinalFaltante > 0;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {pescador.nome}
            {pescador.apelido && <span className="text-sm font-normal text-slate-500"> ({pescador.apelido})</span>}
          </h3>
          <p className="text-xs text-slate-500">{pescador.funcao}</p>
        </div>
        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${badge.cor}`}>
          {badge.label}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Cota</p>
            <p className="mt-1 text-base font-bold text-slate-900">{formatBRL(pescador.cota_total)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Repassado</p>
            <p className="mt-1 text-base font-bold text-blue-700">{formatBRL(pescador.sinal_repassado)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Falta</p>
            <p className="mt-1 text-base font-bold text-amber-700">{formatBRL(pescador.saldo_devedor)}</p>
          </div>
        </div>

        {/* Detalhamento do que pagar */}
        {pescador.saldo_devedor > 0 && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm">
            {precisaPagarMatheus && (
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div>
                  <p className="font-medium text-slate-900">Sinal → Matheus (PIX)</p>
                  <p className="text-xs text-slate-500">Matheus adiantou em set/2026</p>
                </div>
                <p className="font-bold text-amber-700">{formatBRL(sinalFaltante)}</p>
              </div>
            )}
            <div className={`flex items-center justify-between ${precisaPagarMatheus ? "pt-2" : ""}`}>
              <div>
                <p className="font-medium text-slate-900">Saldo → Pousada (janeiro/27)</p>
                <p className="text-xs text-slate-500">Acerto presencial</p>
              </div>
              <p className="font-bold text-amber-700">{formatBRL(saldoNaPousada)}</p>
            </div>
          </div>
        )}

        {/* PIX do Matheus (se precisar) */}
        {precisaPagarMatheus && (
          <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-800">Pagar Matheus agora ({formatBRL(sinalFaltante)})</p>
            <p className="font-mono text-sm font-bold text-slate-900">{pix.chave}</p>
            <p className="text-xs text-slate-600">{pix.titular} • {pix.banco}</p>
          </div>
        )}

        {pescador.status === "sinal-quitado" && (
          <p className="mt-3 text-xs text-blue-700">✓ Sinal quitado — só falta pagar {formatBRL(saldoNaPousada)} direto na pousada em janeiro/2027.</p>
        )}
        {pescador.status === "credor" && (
          <p className="mt-3 text-xs text-emerald-700">✓ Adiantou todos os sinais — vai reaver {formatBRL(pescador.saldo_devedor)} dos amigos + paga o saldo dele direto na pousada.</p>
        )}
      </div>
    </div>
  );
}