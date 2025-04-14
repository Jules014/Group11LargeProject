import React from 'react';

const GreenBG = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#8BB887] flex justify-center px-4 py-12">
      <div className="w-full max-w-15xl">{children}</div>
    </div>
  );
};

export default GreenBG;
