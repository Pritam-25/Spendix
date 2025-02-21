interface AccountPageProps {
  params: { id: string };
}

const Page = async({ params }: AccountPageProps) => {
  return <div>Account ID: {params.id}</div>;
};

export default Page;
