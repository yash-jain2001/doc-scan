import React from "react";

const Header = () => {
  return (
    <div className="flex flex-col gap-2 mb-8 border-b-2 rounded px-20 py-2 border-gray-400">
      <h1 className="text-3xl font-bold text-black">DocScan</h1>
      <p className="text-xl text-gray-400">
        get your documents scanned and stored in one place
      </p>
    </div>
  );
};

export default Header;
