DROP TRIGGER IF EXISTS on_auth_user_created_first_admin ON auth.users;
DROP TRIGGER IF EXISTS assign_first_admin ON auth.users;
DROP FUNCTION IF EXISTS public.assign_first_admin() CASCADE;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon;