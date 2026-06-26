import Logo from "../../../assets/Logo.png";

const SidebarHeader = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <img
          src={Logo}
          alt="Triply"
          className="w-14 h-14"
        />

        <div>
          <h1 className="font-bold text-2xl">
            Triply
          </h1>

          <p className="text-sm text-slate-500">
            Travel Expense Splitter
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;