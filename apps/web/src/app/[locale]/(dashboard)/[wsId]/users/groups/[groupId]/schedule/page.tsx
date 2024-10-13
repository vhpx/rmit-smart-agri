import { cn } from '@/lib/utils';
import { UserGroup } from '@/types/primitives/UserGroup';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@repo/ui/components/ui/button';
import { YearCalendar } from '@repo/ui/components/ui/custom/calendar/year-calendar';
import FeatureSummary from '@repo/ui/components/ui/custom/feature-summary';
import { Separator } from '@repo/ui/components/ui/separator';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { CalendarIcon, ChartColumn, FileUser, UserCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    locale: string;
    wsId: string;
    groupId: string;
  }>;
}

export default async function UserGroupDetailsPage({ params }: Props) {
  const t = await getTranslations();
  const { locale, wsId, groupId } = await params;

  const group = await getData(wsId, groupId);

  return (
    <>
      <FeatureSummary
        title={
          <>
            <h1 className="w-full text-2xl font-bold">
              {group.name || t('ws-user-groups.singular')}
            </h1>
            <Separator className="my-2" />
          </>
        }
        description={
          <>
            <div className="flex flex-wrap gap-2">
              <Link href={`/${wsId}/users/groups/${groupId}`}>
                <Button
                  type="button"
                  variant="secondary"
                  className={cn(
                    'border font-semibold',
                    'border-foreground/20 bg-foreground/10 text-foreground hover:bg-foreground/20'
                  )}
                >
                  <CalendarIcon className="mr-1 h-5 w-5" />
                  {t('infrastructure-tabs.overview')}
                </Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                className={cn(
                  'border font-semibold',
                  'border-dynamic-blue/20 bg-dynamic-blue/10 text-dynamic-blue hover:bg-dynamic-blue/20'
                )}
                disabled
              >
                <CalendarIcon className="mr-1 h-5 w-5" />
                {t('ws-user-group-details.schedule')}
              </Button>
              <Link href={`/${wsId}/users/groups/${groupId}/attendance`}>
                <Button
                  type="button"
                  variant="secondary"
                  className={cn(
                    'border font-semibold',
                    'border-dynamic-purple/20 bg-dynamic-purple/10 text-dynamic-purple hover:bg-dynamic-purple/20'
                  )}
                >
                  <UserCheck className="mr-1 h-5 w-5" />
                  {t('ws-user-group-details.attendance')}
                </Button>
              </Link>
              <Link href={`/${wsId}/users/groups/${groupId}/reports`}>
                <Button
                  type="button"
                  variant="secondary"
                  className={cn(
                    'border font-semibold',
                    'border-dynamic-green/20 bg-dynamic-green/10 text-dynamic-green hover:bg-dynamic-green/20'
                  )}
                >
                  <FileUser className="mr-1 h-5 w-5" />
                  {t('ws-user-group-details.reports')}
                </Button>
              </Link>
              <Link href={`/${wsId}/users/groups/${groupId}/metrics`}>
                <Button
                  type="button"
                  variant="secondary"
                  className={cn(
                    'border font-semibold',
                    'border-dynamic-red/20 bg-dynamic-red/10 text-dynamic-red hover:bg-dynamic-red/20'
                  )}
                >
                  <ChartColumn className="mr-1 h-5 w-5" />
                  {t('ws-user-group-details.metrics')}
                </Button>
              </Link>
            </div>
          </>
        }
        createTitle={t('ws-user-groups.add_user')}
        createDescription={t('ws-user-groups.add_user_description')}
      />
      <Separator className="my-4" />
      <YearCalendar
        locale={locale}
        attendanceData={
          group.sessions?.map((s) => ({
            date: s,
            status: 'PRESENT',
            groups: [
              {
                id: s,
                name: dayjs(s).locale(locale).format('D MMMM YYYY'),
              },
            ],
          })) || []
        }
      />
    </>
  );
}

async function getData(wsId: string, groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('workspace_user_groups')
    .select('*')
    .eq('ws_id', wsId)
    .eq('id', groupId)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  return data as UserGroup;
}
