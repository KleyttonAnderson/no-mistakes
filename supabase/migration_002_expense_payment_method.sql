-- Adiciona forma de pagamento aos gastos (PIX, Transferência, Crédito Nubank, Crédito Inter)
-- Rode este arquivo no SQL Editor do seu projeto Supabase.

alter table public.expenses
  add column if not exists payment_method text;

alter table public.expenses
  drop constraint if exists expenses_payment_method_check;

alter table public.expenses
  add constraint expenses_payment_method_check
  check (payment_method is null or payment_method in ('PIX', 'Transferência', 'Crédito Nubank', 'Crédito Inter'));
