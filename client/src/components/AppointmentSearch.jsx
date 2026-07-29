import { useState } from 'react';

function AppointmentSearch({ onSearch, onClear }) {
  const [keyword, setKeyword] = useState('');

  function submitSearch(event) {
    event.preventDefault();
    if (keyword.trim()) onSearch(keyword.trim());
  }

  function clearSearch() {
    setKeyword('');
    onClear();
  }

  return <form className="flex gap-2" onSubmit={submitSearch}><input className="w-full rounded border p-2" placeholder="Search title, venue, or description" value={keyword} onChange={(event) => setKeyword(event.target.value)} /><button className="rounded bg-slate-800 px-4 text-white">Search</button><button type="button" className="rounded border px-4" onClick={clearSearch}>Clear</button></form>;
}

export default AppointmentSearch;
