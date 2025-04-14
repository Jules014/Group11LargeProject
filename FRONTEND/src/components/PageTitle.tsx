function PageTitle()
{
    return(
     <div className="h-screen flex items-center justify-center bg-transparent">
      <div className="bg-gray/70 rounded-lg p-6 md:p-5 shadow-xl backdrop-blur-sm max-w-2xl w-full text-center flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center drop-shadow-lg">
          Welcome to the <span className="text-emerald-300">CatAI-logue</span>!
        </h1>
      </div>
     </div>
    );
};

export default PageTitle;
