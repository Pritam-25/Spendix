interface accountPageProps {
  params: { id: string };
}

const page = ({ params }: accountPageProps) => {
  return <div>account id: {params.id}</div>;
};

export default page;
