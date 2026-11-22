import { useSiteSettings } from '@/components/SiteShell';

export function CompanyDetails() {
  const st = useSiteSettings();
  if (!st?.company_name) return null;
  return (
    <section className="container-x max-w-3xl py-10">
      <h2 className="font-display text-2xl font-semibold">Company information</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div><dt className="text-muted-foreground">Registered company</dt><dd>{st.company_name}{st.trading_name ? ` trading as ${st.trading_name}` : ''}</dd></div>
        {st.company_number && <div><dt className="text-muted-foreground">Company number</dt><dd>{st.company_number}</dd></div>}
        {st.registered_address && <div><dt className="text-muted-foreground">Registered office</dt><dd>{st.registered_address}</dd></div>}
        {st.fca_status && <div><dt className="text-muted-foreground">Regulatory status</dt><dd>{st.fca_status}{st.fca_number ? ` · FCA firm reference ${st.fca_number}` : ''}{st.principal_firm ? ` · Principal firm: ${st.principal_firm}` : ''}</dd></div>}
        {(st.email || st.phone) && <div><dt className="text-muted-foreground">Contact</dt><dd>{[st.email, st.phone].filter(Boolean).join(' · ')}</dd></div>}
      </dl>
    </section>
  );
}