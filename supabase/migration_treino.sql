-- Central No Mistakes Consultoria — migração incremental: app de treino
-- Rode este arquivo no SQL Editor do Supabase SE seu projeto já existia antes
-- da funcionalidade de treino (plano de exercícios + progressão de carga).
-- Projetos novos não precisam rodar este arquivo: basta usar o schema.sql
-- completo, que já inclui este bloco.

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  muscle_group text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.workout_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  sets int not null default 3,
  reps text not null default '10-12',
  target_weight numeric(6,2),
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.load_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  date date not null,
  weight numeric(6,2) not null default 0,
  reps int,
  sets int,
  created_at timestamptz not null default now()
);

create index if not exists exercises_user_id_idx on public.exercises(user_id);
create index if not exists workout_items_student_id_idx on public.workout_items(student_id);
create index if not exists load_logs_student_id_idx on public.load_logs(student_id);
create index if not exists load_logs_exercise_id_idx on public.load_logs(exercise_id);

alter table public.exercises enable row level security;
alter table public.workout_items enable row level security;
alter table public.load_logs enable row level security;

drop policy if exists "exercises_owner_all" on public.exercises;
create policy "exercises_owner_all" on public.exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_items_owner_all" on public.workout_items;
create policy "workout_items_owner_all" on public.workout_items
  for all using (
    auth.uid() = (select user_id from public.students where id = student_id)
  ) with check (
    auth.uid() = (select user_id from public.students where id = student_id)
  );

drop policy if exists "load_logs_owner_all" on public.load_logs;
create policy "load_logs_owner_all" on public.load_logs
  for all using (
    auth.uid() = (select user_id from public.students where id = student_id)
  ) with check (
    auth.uid() = (select user_id from public.students where id = student_id)
  );
