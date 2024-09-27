const Footer = () => {
  return (
    <div className="bg-blue-800 py-10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <span className="md:text-3xl text-2xl text-white font-bold tracking-tight">
          MernHoliday.Com
        </span>
        <span className="text-white text-xl font-bold tracking-tight flex flex-col md:flex-row md:text-3xl">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Term of Services</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
