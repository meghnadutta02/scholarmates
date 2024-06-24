const page = ({ params }) => {
  const { id } = params;

  return (
    <div className="w-full flex flex-col br items-center">
      <h2 className="text-center"> Discussion Details</h2>

      <div className="w-[70%] br">{id}</div>
    </div>
  );
};

export default page;
