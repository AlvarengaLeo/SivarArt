-- ╔══════════════════════════════════════════════════════════════╗
-- ║  SivarArt — esquema inicial (Supabase / Postgres)              ║
-- ║  Dinero en centavos (bigint), USD. RLS enable+force en todo.   ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── Enums ────────────────────────────────────────────────────────
create type user_role         as enum ('visitor','buyer','artist','admin');
create type artist_status      as enum ('pending','verified','suspended');
create type artwork_type       as enum ('physical','digital');
create type artwork_status     as enum ('draft','pending_review','published','sold','archived','rejected');
create type listing_kind       as enum ('artwork','supply','course','service');
create type order_status       as enum ('pending','paid','processing','shipped','delivered','cancelled','refunded','partially_refunded');
create type fulfillment_status as enum ('unfulfilled','packed','shipped','in_transit','delivered','returned');
create type payment_status     as enum ('requires_payment','processing','succeeded','failed','refunded');
create type payout_status      as enum ('pending','onboarding_required','processing','paid','failed');
create type subscription_tier  as enum ('free','premium');
create type subscription_state as enum ('active','trialing','past_due','canceled','incomplete');
create type enrollment_status  as enum ('active','completed','refunded');

-- ── Helpers (security definer) ───────────────────────────────────
create or replace function public.is_admin() returns boolean
  language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.owns_artist(a uuid) returns boolean
  language sql security definer set search_path = '' stable as $$
  select a = (select auth.uid());
$$;

-- ── Identidad ────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  handle text unique,
  avatar_url text,
  locale text default 'es',
  country text default 'SV',
  role user_role not null default 'buyer',
  created_at timestamptz default now()
);

create table public.artist_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  statement text,
  website text,
  social jsonb default '{}',
  region text,
  status artist_status not null default 'pending',
  kyc_verified_at timestamptz,
  payout_provider text,
  payout_account_id text,
  payout_status payout_status default 'onboarding_required',
  commission_rate_bps int default 1500,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Trigger: crea profile al registrarse
create or replace function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Catálogo ─────────────────────────────────────────────────────
create table public.artworks (
  id bigint generated always as identity primary key,
  artist_id uuid not null references public.artist_profiles(id) on delete cascade,
  slug text unique not null,
  title text not null,
  description text,
  type artwork_type not null default 'physical',
  status artwork_status not null default 'draft',
  price_cents bigint not null default 0,
  currency text default 'usd',
  width_cm numeric, height_cm numeric, depth_cm numeric,
  medium text, movement text, region text, year int,
  edition_type text default 'unique',
  edition_size int, edition_number int,
  framing_available boolean default false,
  digital_asset_path text,
  inventory_qty int default 1,
  authenticity_cert_id text,
  metadata jsonb default '{}',
  view_count bigint default 0,
  published_at timestamptz,
  created_at timestamptz default now()
);
create index on public.artworks(artist_id);
create index on public.artworks(status);
create index on public.artworks(type);

create table public.artwork_media (
  id bigint generated always as identity primary key,
  artwork_id bigint not null references public.artworks(id) on delete cascade,
  kind text default 'image',          -- image | image_hd | video | model_3d
  storage_path text not null,
  width int, height int, alt text, blurhash text,
  position int default 0
);
create index on public.artwork_media(artwork_id);

create table public.supplies (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null, description text,
  category text,
  price_cents bigint not null default 0, currency text default 'usd',
  cost_cents bigint, inventory_qty int default 0,
  sku text, brand text, image_path text,
  active boolean default true,
  created_at timestamptz default now()
);

create table public.collections (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null, description text,
  kind text default 'collection',     -- collection | exhibition | pavilion
  curator_id uuid references public.profiles(id),
  cover_path text,
  starts_at timestamptz, ends_at timestamptz,
  published boolean default false
);
create table public.collection_items (
  collection_id bigint references public.collections(id) on delete cascade,
  artwork_id bigint references public.artworks(id) on delete cascade,
  position int default 0,
  primary key (collection_id, artwork_id)
);

-- ── Comercio ─────────────────────────────────────────────────────
create table public.carts (
  id bigint generated always as identity primary key,
  profile_id uuid unique references public.profiles(id) on delete cascade,
  updated_at timestamptz default now()
);
create table public.cart_items (
  id bigint generated always as identity primary key,
  cart_id bigint not null references public.carts(id) on delete cascade,
  kind listing_kind not null,
  ref_id bigint not null,
  qty int default 1,
  unit_price_cents bigint not null,
  metadata jsonb default '{}'
);
create index on public.cart_items(cart_id);

create table public.orders (
  id bigint generated always as identity primary key,
  order_number text unique,
  identificador_enlace_comercio text unique,
  buyer_id uuid not null references public.profiles(id),
  status order_status not null default 'pending',
  subtotal_cents bigint default 0,
  shipping_cents bigint default 0,
  total_cents bigint default 0,
  currency text default 'usd',
  wompi_id_enlace text,
  wompi_id_transaccion text,
  created_at timestamptz default now(),
  paid_at timestamptz
);
create index on public.orders(buyer_id);
create index on public.orders(status);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  kind listing_kind not null,
  ref_id bigint not null,
  title text, qty int default 1,
  unit_price_cents bigint, line_total_cents bigint,
  seller_artist_id uuid references public.artist_profiles(id),
  commission_cents bigint default 0,
  seller_net_cents bigint default 0,
  fulfillment_status fulfillment_status default 'unfulfilled',
  tracking_number text, shipping_carrier text,
  digital_download_granted boolean default false
);
create index on public.order_items(order_id);
create index on public.order_items(seller_artist_id);

create table public.payments (
  id bigint generated always as identity primary key,
  order_id bigint references public.orders(id) on delete cascade,
  provider text default 'wompi',
  provider_ref text unique,
  forma_pago text, codigo_autorizacion text,
  amount_cents bigint, currency text default 'usd',
  status payment_status default 'requires_payment',
  raw jsonb,
  created_at timestamptz default now()
);

create table public.payouts (
  id bigint generated always as identity primary key,
  artist_id uuid not null references public.artist_profiles(id),
  order_id bigint references public.orders(id),
  amount_cents bigint not null, currency text default 'usd',
  provider text, provider_ref text,
  status payout_status not null default 'pending',
  available_after timestamptz,
  paid_at timestamptz, raw jsonb,
  created_at timestamptz default now()
);
create index on public.payouts(artist_id);

create table public.webhook_events (
  id text primary key,
  provider text, type text,
  processed_at timestamptz default now(),
  payload jsonb
);

-- ── Academy ──────────────────────────────────────────────────────
create table public.courses (
  id bigint generated always as identity primary key,
  artist_id uuid references public.artist_profiles(id) on delete cascade,
  slug text unique not null, title text not null,
  summary text, description text,
  price_cents bigint default 0, currency text default 'usd',
  cover_path text, level text, category text,
  status artwork_status default 'draft',
  published_at timestamptz,
  created_at timestamptz default now()
);
create table public.enrollments (
  id bigint generated always as identity primary key,
  course_id bigint references public.courses(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete cascade,
  status enrollment_status default 'active',
  progress jsonb default '{}',
  enrolled_at timestamptz default now(),
  unique (course_id, buyer_id)
);

-- ── Suscripciones (Wompi recurrente) ─────────────────────────────
create table public.subscriptions (
  id bigint generated always as identity primary key,
  profile_id uuid unique references public.profiles(id) on delete cascade,
  tier subscription_tier default 'free',
  state subscription_state,
  wompi_recurring_id text,
  wompi_token text,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  raw jsonb,
  updated_at timestamptz default now()
);

-- ── Social / descubrimiento ──────────────────────────────────────
create table public.favorites (
  profile_id uuid references public.profiles(id) on delete cascade,
  kind listing_kind, ref_id bigint,
  created_at timestamptz default now(),
  primary key (profile_id, kind, ref_id)
);
create table public.reviews (
  id bigint generated always as identity primary key,
  author_id uuid references public.profiles(id) on delete cascade,
  kind listing_kind, ref_id bigint,
  rating int check (rating between 1 and 5),
  body text, verified_purchase boolean default false,
  status text default 'visible',
  created_at timestamptz default now(),
  unique (author_id, kind, ref_id)
);
create table public.map_locations (
  id bigint generated always as identity primary key,
  name text not null, kind text,       -- gallery | studio | hub | event | landmark
  description text, lat numeric, lng numeric, address text,
  region text, artist_id uuid references public.artist_profiles(id),
  image_path text, active boolean default true
);
create table public.hub_events (
  id bigint generated always as identity primary key,
  title text not null, description text, kind text,
  starts_at timestamptz, ends_at timestamptz,
  location text, cover_path text,
  collection_id bigint references public.collections(id),
  published boolean default false
);

-- ── Controlled vocabularies ──────────────────────────────────────
create table public.vocab (
  domain text not null,                -- medium | movement | region | material | course_category
  key text not null,
  label_es text not null, label_en text,
  position int default 0,
  primary key (domain, key)
);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  RLS                                                          ║
-- ╚══════════════════════════════════════════════════════════════╝
alter table public.profiles          enable row level security;
alter table public.artist_profiles   enable row level security;
alter table public.artworks          enable row level security;
alter table public.artwork_media     enable row level security;
alter table public.supplies          enable row level security;
alter table public.collections       enable row level security;
alter table public.collection_items  enable row level security;
alter table public.carts             enable row level security;
alter table public.cart_items        enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.payments          enable row level security;
alter table public.payouts           enable row level security;
alter table public.webhook_events    enable row level security;
alter table public.courses           enable row level security;
alter table public.enrollments       enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.favorites         enable row level security;
alter table public.reviews           enable row level security;
alter table public.map_locations     enable row level security;
alter table public.hub_events        enable row level security;
alter table public.vocab             enable row level security;

-- Lectura pública
create policy "públicas: vocab"          on public.vocab          for select using (true);
create policy "públicas: supplies"       on public.supplies       for select using (active);
create policy "públicas: map"            on public.map_locations  for select using (active);
create policy "públicas: events"         on public.hub_events     for select using (published);
create policy "públicas: artworks pub"   on public.artworks       for select using (status = 'published' or owns_artist(artist_id) or is_admin());
create policy "públicas: media"          on public.artwork_media  for select using (true);
create policy "públicas: artists"        on public.artist_profiles for select using (true);
create policy "públicas: collections"    on public.collections    for select using (published or is_admin());
create policy "públicas: courses"        on public.courses        for select using (status = 'published' or owns_artist(artist_id) or is_admin());
create policy "públicas: reviews"        on public.reviews        for select using (status = 'visible');

-- Perfiles
create policy "perfil propio: select"    on public.profiles for select using (true);
create policy "perfil propio: update"    on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Artista gestiona lo suyo
create policy "artista: artworks write"  on public.artworks for all
  using (owns_artist(artist_id) or is_admin()) with check (owns_artist(artist_id) or is_admin());
create policy "artista: courses write"   on public.courses for all
  using (owns_artist(artist_id) or is_admin()) with check (owns_artist(artist_id) or is_admin());
create policy "artista: perfil"          on public.artist_profiles for update
  using (owns_artist(id) or is_admin()) with check (owns_artist(id) or is_admin());

-- Carrito propio
create policy "carrito propio"           on public.carts for all
  using ((select auth.uid()) = profile_id) with check ((select auth.uid()) = profile_id);
create policy "carrito items"            on public.cart_items for all
  using (exists (select 1 from public.carts c where c.id = cart_id and c.profile_id = (select auth.uid())))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.profile_id = (select auth.uid())));

-- Órdenes: comprador ve las suyas; artista ve sus order_items; nadie escribe desde cliente
create policy "orden: comprador select"  on public.orders for select
  using (buyer_id = (select auth.uid()) or is_admin());
create policy "order_items: visibilidad" on public.order_items for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = (select auth.uid()))
    or owns_artist(seller_artist_id) or is_admin()
  );
create policy "payouts: artista select"  on public.payouts for select
  using (owns_artist(artist_id) or is_admin());

-- Inscripciones / favoritos / reviews / suscripción del usuario
create policy "enroll: propio"           on public.enrollments for select using (buyer_id = (select auth.uid()) or is_admin());
create policy "fav: propio"              on public.favorites for all using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "review: autor write"      on public.reviews for insert with check (author_id = (select auth.uid()));
create policy "sub: propio select"       on public.subscriptions for select using (profile_id = (select auth.uid()) or is_admin());

-- (orders/payments/payouts/enrollments INSERT/UPDATE se hacen server-side con service role)
