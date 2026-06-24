# SivarArt

**El hogar del arte salvadoreño** 🇸🇻 — galería 3D inmersiva + marketplace que paga a los artistas + Sivar Academy + mapa cultural. Inspirado en Google Arts & Culture, simplificado y superior.

Stack: **Next.js (App Router, TS) · React Three Fiber · Tailwind · shadcn-style UI · Supabase · Wompi SV · Framer Motion · GSAP · Lenis**.

## Requisitos
- Node.js ≥ 20 (probado con 24)
- Una cuenta de Supabase y un comercio Wompi SV (sandbox para desarrollo)

## Puesta en marcha
```bash
npm install
cp .env.example .env.local   # y completá los valores
npm run dev                   # http://localhost:3000
```

> La app arranca sin Supabase/Wompi configurados (la landing 3D funciona). Las
> funciones de auth/comercio requieren las variables de entorno.

## Variables de entorno
Ver `.env.example`. Claves:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `WOMPI_ENV`, `WOMPI_APP_ID`, `WOMPI_API_SECRET`, `WOMPI_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`, `PLATFORM_COMMISSION_BPS`

## Base de datos (Supabase)
1. Creá un proyecto en Supabase.
2. Aplicá la migración `supabase/migrations/0001_init.sql` (SQL Editor o Supabase CLI).
3. Activá los proveedores de Auth (Email + Google) y las URLs de redirección.
4. (Opcional) `supabase gen types typescript` → `types/database.types.ts`.

## Despliegue en Vercel
1. Subí el repo a GitHub.
2. Importalo en Vercel (framework Next.js — autodetectado).
3. Cargá las variables de entorno (las mismas de `.env.local`).
4. Conectá la integración de Supabase para sincronizar env (opcional).
5. Deploy. Para producción, cambiá `WOMPI_ENV=production` con llaves live tras el
   alta del comercio Wompi SV.

## Estructura
```
app/            rutas (App Router) + landing
components/      UI (site, landing, ui)
src/three/       escenas R3F (canvas, landing, gallery, hub)
src/motion|scroll  lenguaje de movimiento (Lenis/GSAP/Framer)
lib/            supabase, payments (Wompi), utils
supabase/        migraciones SQL
```

## Roadmap (milestones)
- **M0** Fundación + listo para Vercel ✅
- **M1** Landing cinemático ✅ (base)
- **M2** Galería 3D + ficha de obra (DeepZoom)
- **M3** Marketplace + checkout Wompi SV
- **M4** Studio del creador + payouts + suscripción
- **M5** Filtro IA estilo La Palma/Llort
- **M6** Mapa cultural de El Salvador
- **M7** Tour 3D del Hub

Plan completo: `~/.claude/plans/…sivar-art…md`.
