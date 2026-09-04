# V7.4 — deploy checklist

## 1. Local validation

```bash
npm install
npm run build
npm run dev
```

Check these routes before pushing:

- `/`
- `/admin`
- `/work/sindpetshop-ecosystem`
- `/?for=food`
- `/?for=b2b&prospect=Empresa%20Teste`

## 2. Environment variables

Create `.env.local` locally and configure the same values in Vercel:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_KAREN_WHATSAPP=5511XXXXXXXXX
VITE_GUSTAVO_WHATSAPP=5511XXXXXXXXX
```

Do not commit `.env.local`.

## 3. Supabase

Execute/review once in Supabase SQL Editor:

`SUPABASE_V7_4_SETUP.sql`

Then confirm:

- bucket `portfolio-assets` is public for reads;
- authenticated Admin users can upload/update/delete media;
- existing table RLS still allows public reading of published data and authenticated management.

## 4. Media readiness

In `/admin`:

- every priority Reel should have an exact Instagram Reel permalink or `.mp4/.webm`;
- every priority Reel should have a poster;
- mark only the strongest items as `featured=true`;
- upload project covers to Storage instead of relying on third-party image URLs;
- use stable client slugs (`sindpetshop`, `venancio`, `seon`, etc.).

## 5. Mobile QA

Test at approximately:

- 360 × 800;
- 390 × 844;
- 430 × 932;
- tablet portrait;
- desktop 1366 × 768 and 1920 × 1080.

Check navigation menu, Reel modal, Showreel, Case Drawer, Before/After, Project Intelligence, Capability OS, Pitch Mode and 60-second brief.

## 6. Analytics

If GTM/GA4 is present, map the `dataLayer` events documented in README. Test at least:

- `page_view`
- `case_open`
- `reel_open`
- `reel_play`
- `showreel_start`
- `work_filter`
- `brief_started`
- `brief_completed`
- `case_share`
- `tool_evidence_open`

## 7. Git / Vercel

```bash
git add .
git commit -m "feat: Seeven Presence System V7.4"
git push
```

Vercel’s rewrite already routes clean paths such as `/work/...` back to `index.html`.


## Verificação visual V7.4

Após o deploy, conferir especialmente:

- Manifesto aparece sem precisar “forçar” scroll.
- Project Intelligence não cria vazio preto.
- Header troca corretamente entre tema claro/escuro.
- Selected Work fecha as linhas sem card órfão.
- Reels ficam legíveis em desktop e 2 por linha no celular.
- Captura de página inteira não repete grandes trechos.
