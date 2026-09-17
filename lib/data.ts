import data from "../data/pescaria.json";

// Tipos
export type Pescador = {
  slug: string;
  nome: string;
  apelido: string | null;
  funcao: string;
  cota_total: number;
  sinal_esperado: number;
  sinal_repassado: number;
  saldo_devedor: number;
  status: "credor" | "sinal-quitado" | "aguardando-sinal" | "quitado";
  status_detalhe: string;
};

export type Fornecedor = {
  id: string;
  item: string;
  fornecedor: string;
  total: number;
  sinal_pago: number;
  saldo_viagem: number;
  comprovante_pagamento?: string;
  obs?: string;
};

export type Comprovante = {
  id: string;
  data: string;
  tipo: "pago" | "recebido";
  descricao: string;
  favorecido: string;
  valor: number;
  pix: string;
  autenticacao: string;
};

export type ChecklistItem = {
  nome: string;
  obs: string;
  checked: boolean;
};

export type ChecklistCategoria = {
  categoria: string;
  emoji: string;
  itens: ChecklistItem[];
};

export type PescariaData = {
  viajem: {
    nome: string;
    destino: string;
    saida: string;
    saida_local: string;
    retorno: string;
    duracao: string;
    descricao: string;
  };
  pix_matheus: {
    titular: string;
    chave: string;
    banco: string;
    obs: string;
  };
  fornecedores: Fornecedor[];
  equipe: Pescador[];
  comprovantes: Comprovante[];
  checklist: ChecklistCategoria[];
};

const pescaria = data as PescariaData;

export function getData(): PescariaData {
  return pescaria;
}

export function getPescador(slug: string): Pescador | null {
  return pescaria.equipe.find((p) => p.slug === slug) || null;
}

export function getFornecedor(id: string): Fornecedor | null {
  return pescaria.fornecedores.find((f) => f.id === id) || null;
}

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function formatDateBR(iso: string): string {
  // YYYY-MM-DD → DD/MM/YYYY
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateTimeBR(iso: string): string {
  // 2026-09-11T11:12:24 → 11/09/2026 11:12:24
  const [date, time] = iso.split("T");
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y} ${time || ""}`;
}

// Resumo financeiro calculado a partir dos dados
export type ResumoFinanceiro = {
  total_contratado: number;
  total_pago_antecipado: number;
  saldo_na_pousada: number;
  reembolso_total_esperado: number;
  reembolso_recebido: number;
  falta_receber: number;
};

export function calcularResumo(): ResumoFinanceiro {
  const totalContratado = pescaria.fornecedores.reduce((s, f) => s + f.total, 0);
  const totalPagoAntecipado = pescaria.fornecedores.reduce((s, f) => s + f.sinal_pago, 0);
  const saldoNaPousada = totalContratado - totalPagoAntecipado;

  const matheus = pescaria.equipe.find((p) => p.slug === "matheus")!;
  // O que Matheus tem a receber = o que ele adiantou (todo o sinal) - parte DELE do sinal
  const reembolsoEsperado = totalPagoAntecipado - matheus.sinal_esperado;

  // O que já recebeu = soma de sinal_repassado dos amigos (exclui Matheus)
  const reembolsoRecebido = pescaria.equipe
    .filter((p) => p.slug !== "matheus")
    .reduce((s, p) => s + p.sinal_repassado, 0);

  return {
    total_contratado: totalContratado,
    total_pago_antecipado: totalPagoAntecipado,
    saldo_na_pousada: saldoNaPousada,
    reembolso_total_esperado: reembolsoEsperado,
    reembolso_recebido: reembolsoRecebido,
    falta_receber: reembolsoEsperado - reembolsoRecebido,
  };
}

export function statusBadge(status: Pescador["status"]): { label: string; cor: string } {
  switch (status) {
    case "credor":
      return { label: "Credor (adiantou tudo)", cor: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    case "sinal-quitado":
      return { label: "Sinal quitado", cor: "bg-blue-100 text-blue-800 border-blue-300" };
    case "aguardando-sinal":
      return { label: "Aguardando sinal", cor: "bg-amber-100 text-amber-800 border-amber-300" };
    case "quitado":
      return { label: "Quitado total", cor: "bg-emerald-100 text-emerald-800 border-emerald-300" };
  }
}