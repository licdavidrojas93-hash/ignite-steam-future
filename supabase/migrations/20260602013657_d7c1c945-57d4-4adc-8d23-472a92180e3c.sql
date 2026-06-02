
DROP VIEW IF EXISTS public.impulsa_public_stats;

CREATE OR REPLACE FUNCTION public.get_impulsa_public_stats()
RETURNS TABLE(total_raised numeric, sponsors_count integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(SUM(CASE WHEN payment_status IN ('paid','in_kind_confirmed') THEN amount ELSE 0 END), 0)::numeric AS total_raised,
    COUNT(*) FILTER (WHERE payment_status IN ('paid','in_kind_confirmed'))::int AS sponsors_count
  FROM public.impulsa_sponsors;
$$;

GRANT EXECUTE ON FUNCTION public.get_impulsa_public_stats() TO anon, authenticated;
