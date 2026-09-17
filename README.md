# Pescaria Três Marias 2027 – Controle Financeiro

App web (Next.js + Vercel Free) pra controle financeiro da viagem de pesca em grupo pra Pousada do Júnior, Três Marias/MG (12-16 janeiro/2027).

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS 3**
- **Sem banco de dados** — tudo num arquivo `data/pescaria.json` versionado no GitHub
- **Vercel Free** — auto-deploy em cada push

## Como funciona

1. **Equipe acessa pelo link** (subdomínio Vercel tipo `pescaria-tres-marias-2027.vercel.app`)
2. **Vê tudo numa landing única** — resumo financeiro, situação de cada amigo, fornecedores, comprovantes e checklist
3. **Cada amigo procura o card dele** e vê quanto deve, dados do PIX do Matheus, cronograma
4. **Matheus atualiza pelo chat comigo** — eu edito `data/pescaria.json`, dou commit/push, Vercel redeploya em ~30s

## Estrutura

```
web/
├── app/
│   ├── page.tsx           # landing única
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── data.ts            # tipos + helpers de cálculo
├── data/
│   └── pescaria.json      # fonte de verdade (atualizar aqui)
└── ...
```

## Como Matheus atualiza (via chat comigo)

Só me avisar no chat, tipo:
- "Rhuan pagou os 408,50" → eu atualizo o `sinal_repassado` dele pra 408.50 + status `sinal-quitado`
- "Wendel pagou 296" → atualizo Wendel
- "Coloquei gasolina 800 reais" → adiciono linha em fornecedores
- Etc.

Eu edito o JSON, commito, dou push. Vercel detecta em 30s e o link atualiza sozinho.

## Dev local

```bash
cd web
npm install
npm run dev
# abrir http://localhost:3000
```

## Deploy

Já tá conectado no GitHub: https://github.com/faccod/pescaria-tres-marias-2027

Vercel Free auto-deploy em cada push pra `main`.