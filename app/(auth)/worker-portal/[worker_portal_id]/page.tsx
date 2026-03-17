import WorkerPortalRender from "@/app/features/main/worker-portal/[id]/Index";

interface WorkerPortalPageProps {
  params: Promise<{
    worker_portal_id: string;
  }>;
}

const page = async ({ params }: WorkerPortalPageProps) => {
  const { worker_portal_id } = await params;
  return (
    <div>
      <WorkerPortalRender worker_portal_id={worker_portal_id} />
    </div>
  );
};

export default page;