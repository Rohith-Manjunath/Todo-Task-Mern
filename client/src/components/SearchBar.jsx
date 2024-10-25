import React from "react";

const SearchBar = ({
  FaArrowLeft,
  debouncedQuery,
  handleClearSearch,
  setSearchQuery,
  searchQuery,
  CiSearch,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border w-full border-gray-300 rounded-md px-4 py-2">
      {debouncedQuery && (
        <FaArrowLeft
          className="cursor-pointer active:scale:90 transition-all duration-300"
          onClick={handleClearSearch}
        />
      )}
      <input
        type="text"
        className="outline-none border-none w-full"
        placeholder="Search for a task"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <CiSearch className="text-gray-700 text-xl" />
    </div>
  );
};

export default SearchBar;
