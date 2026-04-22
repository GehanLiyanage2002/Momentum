import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ handleLogout }) {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('Select Mood...');
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing

  // Helper to get authorization header
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
  });

  // 1. READ: Fetch entries on load
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://48.194.100.231/api/entries', getAuthHeader());
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  // 2. CREATE & UPDATE: Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || mood === 'Select Mood...') return alert('Please enter text and select a mood.');

    try {
      if (editingId) {
        // UPDATE existing entry
        const res = await axios.put(`http://48.194.100.231/api/entries/${editingId}`, { text, mood }, getAuthHeader());
        setEntries(entries.map(ent => ent._id === editingId ? res.data : ent));
        setEditingId(null);
      } else {
        // CREATE new entry
        const res = await axios.post('http://48.194.100.231/api/entries', { text, mood }, getAuthHeader());
        setEntries([res.data, ...entries]); // Add to top of list
      }
      // Reset form
      setText('');
      setMood('Select Mood...');
    } catch (err) {
      console.error("Failed to save entry", err);
    }
  };

  // 3. DELETE: Remove an entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this moment?")) return;
    try {
      await axios.delete(`http://48.194.100.231/api/entries/${id}`, getAuthHeader());
      setEntries(entries.filter(ent => ent._id !== id));
    } catch (err) {
      console.error("Failed to delete entry", err);
    }
  };

  // 4. Set up the Edit Form
  const handleEditSetup = (entry) => {
    setText(entry.text);
    setMood(entry.mood);
    setEditingId(entry._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see the form
  };

  const cancelEdit = () => {
    setText('');
    setMood('Select Mood...');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center font-bold">M</div>
          <h1 className="text-xl font-bold tracking-tight">Momentum</h1>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 rounded-lg transition-all">
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Your Journal</h2>
          <p className="text-slate-400 mt-1">Capture your daily moments and micro-wins.</p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className={`bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 shadow-lg transition-all ${editingId ? 'ring-2 ring-purple-500' : ''}`}>
          {editingId && <p className="text-purple-400 text-sm font-bold mb-2">Editing Moment...</p>}
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent text-lg placeholder-slate-500 border-none focus:ring-0 resize-none outline-none" 
            rows="2" 
            placeholder="What's on your mind right now?"
          ></textarea>
          <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-white/10 gap-4">
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 text-slate-300"
            >
              <option disabled>Select Mood...</option>
              <option>🚀 Productive</option>
              <option>🎉 Happy</option>
              <option>☕ Tired</option>
              <option>🌧️ Sad</option>
              <option>🔥 Motivated</option>
            </select>
            <div className="flex gap-2">
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                  Cancel
                </button>
              )}
              <button type="submit" className={`font-medium px-6 py-2 rounded-lg transition-colors ${editingId ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-sky-500 hover:bg-sky-400 text-white'}`}>
                {editingId ? 'Update Moment' : 'Post Moment'}
              </button>
            </div>
          </div>
        </form>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.length === 0 ? (
            <p className="text-slate-500 col-span-full text-center py-10">No moments recorded yet. Start writing!</p>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-transform group hover:border-white/20 relative flex flex-col justify-between">
                
                {/* Action Buttons (Hidden until hover) */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => handleEditSetup(entry)} className="p-1.5 bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white rounded-md transition-colors" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(entry._id)} className="p-1.5 bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white rounded-md transition-colors" title="Delete">
                    🗑️
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center rounded-md bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-sky-400 ring-1 ring-inset ring-slate-700/50">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                    "{entry.text}"
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}