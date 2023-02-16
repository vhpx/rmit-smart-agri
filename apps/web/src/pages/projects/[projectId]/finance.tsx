import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import useSWR from 'swr';
import NestedLayout from '../../../components/layouts/NestedLayout';
import { useAppearance } from '../../../hooks/useAppearance';
import HeaderX from '../../../components/metadata/HeaderX';
import { Divider } from '@mantine/core';
import { PlusIcon } from '@heroicons/react/24/solid';
import { openModal } from '@mantine/modals';
import { Wallet } from '../../../types/primitives/Wallet';
import WalletEditForm from '../../../components/forms/WalletEditForm';
import { useWallets } from '../../../hooks/useWallets';
import WalletTab from '../../../components/finance/wallets/WalletTab';

const ProjectFinancePage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const { data: project } = useSWR(
    projectId ? `/api/projects/${projectId}` : null
  );

  const [walletId, setWalletId] = useState<string | null>();

  const { data: wallets, error: walletsError } = useSWR<Wallet[] | null>(
    projectId ? `/api/projects/${projectId}/wallets` : null
  );

  const isWalletsLoading = !wallets && !walletsError;

  const { setRootSegment } = useAppearance();

  useEffect(() => {
    setRootSegment(
      project?.orgs?.id
        ? [
            {
              content: project?.orgs?.name || 'Unnamed Workspace',
              href: `/orgs/${project.orgs.id}`,
            },
            {
              content: 'Projects',
              href: `/orgs/${project?.orgs?.id}/projects`,
            },
            {
              content: project?.name || 'Untitled Project',
              href: `/projects/${projectId}`,
            },
            { content: 'Finance', href: `/projects/${projectId}/finance` },
          ]
        : []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, project?.orgs?.id, project?.orgs?.name, project?.name]);

  const { createWallet, updateWallet, deleteWallet } = useWallets();

  const showEditWalletModal = (wallet?: Wallet) => {
    openModal({
      title: (
        <div className="font-semibold">
          {wallet ? 'Edit wallet' : 'Create wallet'}
        </div>
      ),
      centered: true,
      children: (
        <WalletEditForm
          projectId={(projectId || '') as string}
          wallet={wallet}
          onSubmit={wallet ? updateWallet : createWallet}
          onDelete={
            wallet ? () => deleteWallet(projectId as string, wallet) : undefined
          }
        />
      ),
    });
  };

  return (
    <>
      <HeaderX label={`Finance – ${project?.name || 'Untitled Project'}`} />

      {projectId && (
        <>
          <div className="rounded-lg bg-zinc-900 p-4">
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-zinc-400">
              Track financial progress and budget.
            </p>
          </div>
        </>
      )}

      <Divider className="my-4" />

      <button
        onClick={() => showEditWalletModal()}
        className="flex items-center gap-1 rounded bg-blue-300/20 px-4 py-2 font-semibold text-blue-300 transition hover:bg-blue-300/10"
      >
        New wallet <PlusIcon className="h-4 w-4" />
      </button>

      <div className="my-5 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {wallets &&
          wallets.map((wallet, index) => (
            <WalletTab
              key={index}
              wallet={wallet}
              onClick={() => setWalletId(wallet.id)}
            />
          ))}
      </div>
    </>
  );
};

ProjectFinancePage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout mode="project">{page}</NestedLayout>;
};

export default ProjectFinancePage;
