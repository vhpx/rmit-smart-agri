import { ReactElement } from 'react';
import { PageWithLayoutProps } from '../types/PageWithLayoutProps';
import Layout from '../components/layout/Layout';
import { Organization } from '../types/primitives/Organization';
import { PencilIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import OrgEditForm from '../components/forms/OrgEditForm';
import { Project } from '../types/primitives/Project';
import ProjectEditForm from '../components/forms/ProjectEditForm';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useOrgs } from '../hooks/useOrganizations';

export const getServerSideProps = withPageAuth({ redirectTo: '/login' });

const Home: PageWithLayoutProps = () => {
  const { orgs, createOrg, updateOrg, deleteOrg } = useOrgs();

  const maxOrgs = 3;

  const addOrg = (org: Organization) => createOrg(org);

  const editOrg = (org: Organization) => updateOrg(org);

  const removeOrg = (id: string) => deleteOrg(id);

  const showDeleteOrgConfirmation = (orgId: string) => {
    openConfirmModal({
      title: 'Delete organization',
      centered: true,
      children: (
        <div className="text-center">
          <p className="mb-4">
            Are you sure you want to delete this organization?
          </p>
        </div>
      ),
      labels: {
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      onConfirm: () => {
        removeOrg(orgId);
        closeAllModals();
      },
    });
  };

  const showEditOrgModal = (org?: Organization) => {
    openModal({
      title: org?.id ? 'Edit organization' : 'New organization',
      centered: true,
      children: (
        <OrgEditForm
          org={org}
          onSubmit={org?.id ? editOrg : addOrg}
          onDelete={
            org?.id ? () => showDeleteOrgConfirmation(org.id) : undefined
          }
        />
      ),
    });
  };

  const showEditProjectModal = (orgId: string, project?: Project) => {
    openModal({
      title: project?.id ? 'Edit project' : 'New project',
      centered: true,
      children: (
        <ProjectEditForm
          orgId={orgId}
          project={project}
          // onSubmit={
          //   project?.id
          //     ? editProject
          //     : (getOrg(orgId)?.projects?.length || 0) < maxProjects
          //     ? addProject
          //     : showMaxProjectsReached
          // }
        />
      ),
    });
  };

  return (
    <>
      {orgs.length > 0 ? (
        <div className="grid gap-4">
          {orgs.map((org) => (
            <div key={org.id}>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-blue-200 text-2xl font-semibold">
                  {org?.name || `Unnamed organization`}{' '}
                  {org?.id === '00000000-0000-0000-0000-000000000000' && (
                    <SparklesIcon className="inline-block w-5 h-5 text-yellow-300" />
                  )}
                </div>
                {org?.id === '00000000-0000-0000-0000-000000000000' || (
                  <button
                    className="p-2 hover:bg-zinc-700/80 rounded transition duration-150"
                    onClick={() => showEditOrgModal(org)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {/* {org?.projects?.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 h-32 flex bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 font-semibold text-xl rounded transition duration-150 cursor-pointer"
                    onClick={() => showEditProjectModal(org.id, project)}
                  >
                    {project?.name || `Unnamed project`}
                  </div>
                ))} */}
                <div
                  className="p-2 h-32 flex justify-center items-center font-semibold text-xl rounded bg-blue-300/20 hover:bg-blue-300/30 text-blue-300 cursor-pointer transition duration-300"
                  onClick={() => showEditProjectModal(org.id)}
                >
                  New project
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row">
            You are not a member of any organizations.
          </div>
        </div>
      )}

      <button
        className={`mt-8 font-semibold px-6 py-4 rounded ${
          orgs.length < maxOrgs
            ? 'bg-blue-300/20 hover:bg-blue-300/30 text-blue-300'
            : 'bg-gray-500/10 text-gray-500/50 cursor-not-allowed'
        } transition duration-300`}
        onClick={() => (orgs.length < maxOrgs ? showEditOrgModal() : null)}
      >
        {orgs.length < maxOrgs
          ? 'New organization'
          : 'Maximum organizations reached'}
      </button>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout label="Home">{page}</Layout>;
};

export default Home;
