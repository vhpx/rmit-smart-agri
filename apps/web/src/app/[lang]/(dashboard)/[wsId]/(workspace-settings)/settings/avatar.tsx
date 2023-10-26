'use client';

import useTranslation from 'next-translate/useTranslation';
import { Workspace } from '@/types/primitives/Workspace';
import AvatarInput from './avatar-input';

interface Props {
  workspace: Workspace | null;
  allowEdit?: boolean;
}

export default function WorkspaceAvatarSettings({
  workspace,
  allowEdit,
}: Props) {
  const { t } = useTranslation('ws-settings');

  if (!workspace) return null;

  return (
    <div className="border-foreground/10 bg-foreground/5 flex flex-col rounded-lg border p-4">
      <div className="mb-1 text-2xl font-bold">{t('workspace_avatar')}</div>
      <div className="mb-4 font-semibold text-zinc-500">
        {t('workspace_avatar_description')}
      </div>

      <AvatarInput
        workspace={workspace}
        defaultValue={workspace.name}
        disabled={!allowEdit}
      />
    </div>
  );
}
