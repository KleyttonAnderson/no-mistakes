-- Central No Mistakes Consultoria — schema do banco (Supabase/Postgres)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ========== TABELAS ==========

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  type text not null check (type in ('Online', 'Presencial')),
  status text not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
  avatar_url text,
  plan text not null,
  value numeric(10,2) not null default 0,
  start_date date not null,
  next_due_date date not null,
  pendente boolean not null default false,
  last_training_update date,
  next_training_update date,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null,
  value numeric(10,2) not null default 0,
  method text not null check (method in ('PIX', 'Cartão', 'Dinheiro', 'Outro')),
  status text not null default 'Pago',
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  value numeric(10,2) not null default 0,
  date date not null,
  category text not null,
  recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.plan_variants (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  detail text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists students_user_id_idx on public.students(user_id);
create index if not exists payments_student_id_idx on public.payments(student_id);
create index if not exists expenses_user_id_idx on public.expenses(user_id);
create index if not exists categories_user_id_idx on public.categories(user_id);
create index if not exists plans_user_id_idx on public.plans(user_id);
create index if not exists plan_variants_plan_id_idx on public.plan_variants(plan_id);

-- ========== ROW LEVEL SECURITY ==========

alter table public.students enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.categories enable row level security;
alter table public.plans enable row level security;
alter table public.plan_variants enable row level security;

create policy "students_owner_all" on public.students
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "payments_owner_all" on public.payments
  for all using (
    auth.uid() = (select user_id from public.students where id = student_id)
  ) with check (
    auth.uid() = (select user_id from public.students where id = student_id)
  );

create policy "expenses_owner_all" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories_owner_all" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "plans_owner_all" on public.plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "plan_variants_owner_all" on public.plan_variants
  for all using (
    auth.uid() = (select user_id from public.plans where id = plan_id)
  ) with check (
    auth.uid() = (select user_id from public.plans where id = plan_id)
  );

-- ========== SEED AUTOMÁTICO PARA NOVOS USUÁRIOS ==========
-- Ao criar uma conta (signup), popula categorias e planos padrão automaticamente.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_light uuid;
  v_premium uuid;
  v_presencial uuid;
begin
  insert into public.categories (user_id, name, sort_order) values
    (new.id, 'Academia', 0),
    (new.id, 'Ferramentas', 1),
    (new.id, 'Marketing', 2),
    (new.id, 'Transporte', 3),
    (new.id, 'Pessoal/Empresa', 4),
    (new.id, 'Outros', 5);

  insert into public.plans (user_id, name, sort_order) values (new.id, 'Plano Light', 0)
    returning id into v_light;
  insert into public.plan_variants (plan_id, name, price, detail, sort_order) values
    (v_light, 'Mensal', 347, null, 0),
    (v_light, 'Trimestral', 697, '3x R$ 232,33 no cartão · R$ 697,00 à vista no PIX', 1),
    (v_light, 'Semestral', 1200, '6x R$ 200,00 no cartão · R$ 1.200,00 à vista no PIX', 2);

  insert into public.plans (user_id, name, sort_order) values (new.id, 'Plano Premium', 1)
    returning id into v_premium;
  insert into public.plan_variants (plan_id, name, price, detail, sort_order) values
    (v_premium, 'Mensal', 516.90, null, 0),
    (v_premium, 'Trimestral', 1036.80, '3x R$ 371,65 no cartão · R$ 1.036,80 à vista no PIX', 1),
    (v_premium, 'Semestral', 1879.60, '6x R$ 346,82 no cartão · R$ 1.879,60 à vista no cartão', 2);

  insert into public.plans (user_id, name, sort_order) values (new.id, 'Plano Presencial', 2)
    returning id into v_presencial;
  insert into public.plan_variants (plan_id, name, price, detail, sort_order) values
    (v_presencial, 'Mensal', 347, null, 0),
    (v_presencial, 'Trimestral', 697, null, 1),
    (v_presencial, 'Semestral', 1200, null, 2);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========== STORAGE (fotos dos alunos) ==========

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_owner_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_owner_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
