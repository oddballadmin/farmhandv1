import { useEffect, useMemo, useState } from 'react';
import './animals.css';

interface Animal {
  id: string;
  farmId: string;
  name: string;
  type: string; // goat, cattle, sheep, poultry, other (backend uses goat|cow|sheep|pig|horse|chicken)
  gender: string; // male | female | Unknown (local Unknown for newly created)
  status?: string; // open | bred | pregnant | fresh | dry
}

type Category = 'goat' | 'cattle' | 'sheep' | 'poultry' | 'other';

const CATEGORY_LABELS: Record<Category, string> = {
  goat: 'Goats',
  cattle: 'Cattle',
  sheep: 'Sheep',
  poultry: 'Poultry',
  other: 'Other'
};

type SortKey = 'name' | 'gender';
type SortDir = 'asc' | 'desc';

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [massEdit, setMassEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBreedingForm, setShowBreedingForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/animals');
        const data = await res.json();
        setAnimals(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load animals');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories: Category[] = ['goat', 'cattle', 'sheep', 'poultry', 'other'];

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of categories) map[c] = 0;
    animals.forEach(a => { if (map[a.type] !== undefined) map[a.type]++; });
    return map as Record<Category, number>;
  }, [animals]);

  const filteredAnimals = useMemo(() => {
    let list = selectedCategory ? animals.filter(a => a.type === selectedCategory) : [];
    if (list.length) {
      list = [...list].sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else if (sortKey === 'gender') {
          cmp = a.gender.localeCompare(b.gender);
        }
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [animals, selectedCategory, sortKey, sortDir]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allVisibleSelected = filteredAnimals.length > 0 && filteredAnimals.every(a => selectedIds.has(a.id));
  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredAnimals.forEach(a => next.delete(a.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredAnimals.forEach(a => next.add(a.id));
        return next;
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} animals? This cannot be undone.`)) return;
    // Optimistic: remove from UI first
    const ids = Array.from(selectedIds);
    setAnimals(a => a.filter(an => !selectedIds.has(an.id)));
    setSelectedIds(new Set());
    for (const id of ids) {
      try { await fetch(`/api/animals/${id}`, { method: 'DELETE' }); } catch {/* ignore */}
    }
  };

  const cycleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
    setSortDir(d => d === 'asc' ? 'desc' : 'asc');
  };

  const headerButton = (label: string, onClick: () => void, active = false) => (
    <button onClick={onClick} className={"animals-btn" + (active ? ' active' : '')}>{label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}</button>
  );

  return (
    <section className="module-panel" aria-labelledby="animals-heading">
      <h2 id="animals-heading">Animals</h2>
      {!selectedCategory && (
        <div>
          <h3>Select a Category</h3>
          <div className="animals-categories-grid">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className="animals-category-card">
                <strong>{CATEGORY_LABELS[cat]}</strong><br />
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{categoryCounts[cat]} animals</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCategory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="animals-header-row">
            <div className="animals-header-left">
              <button onClick={() => setSelectedCategory(null)} className="animals-btn">← Categories</button>
              <h3 style={{ margin: 0 }}>{CATEGORY_LABELS[selectedCategory]} ({filteredAnimals.length})</h3>
            </div>
            <div className="animals-header-actions">
              {headerButton('Add Animal', () => setShowAddForm(true))}
              {headerButton('Mass Edit', () => { setMassEdit(m => !m); if (massEdit) setSelectedIds(new Set()); }, massEdit)}
              {headerButton('Add Breeding', () => setShowBreedingForm(true))}
              {headerButton('Sort Name', () => cycleSort('name'), sortKey === 'name')}
              {headerButton('Sort Gender', () => cycleSort('gender'), sortKey === 'gender')}
            </div>
          </div>

          {massEdit && (
            <div className="animals-mass-edit-bar">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} /> Select All
              </label>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{selectedIds.size} selected</span>
              <button disabled={!selectedIds.size} onClick={handleDeleteSelected} className="animals-delete-btn">Delete Selected</button>
            </div>
          )}

          {loading && <div>Loading animals...</div>}
          {error && <div style={{ color: 'var(--danger-fg, #f55)' }}>{error}</div>}
          {!loading && !error && !filteredAnimals.length && (
            <div style={{ opacity: 0.8 }}>No animals in this category yet.</div>
          )}

            <div className="animals-grid">
              {filteredAnimals.map(animal => {
                const selected = selectedIds.has(animal.id);
                return (
                  <div key={animal.id} className={'animal-card' + (selected ? ' selected' : '')}>
                    {massEdit && (
                      <label style={{ position: 'absolute', top: '0.4rem', right: '0.4rem' }}>
                        <input type="checkbox" checked={selected} onChange={() => toggleSelect(animal.id)} />
                      </label>
                    )}
                    <h4>{animal.name}</h4>
                    <div className="animal-card-id">{animal.id}</div>
                    <div className="animal-card-meta">
                      <span><strong>Gender:</strong> {animal.gender}</span>
                      <span><strong>Type:</strong> {animal.type}</span>
                      {animal.status && (
                        <span className={"animal-status " + animal.status}>{animal.status}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      )}

      {showAddForm && (
        <div className="overlay">
          <AddAnimalModal onClose={() => setShowAddForm(false)} onCreated={(a) => { setAnimals(prev => [...prev, a]); }} />
        </div>
      )}
      {showBreedingForm && (
        <div className="overlay">
          <AddBreedingModal 
            animals={animals}
            category={selectedCategory}
            onClose={() => setShowBreedingForm(false)}
            onCreated={(record, updatedFemale) => {
              // If we need local breeding records integration later, handle here.
              setAnimals(prev => prev.map(a => a.id === updatedFemale.id ? updatedFemale : a));
            }}
          />
        </div>
      )}
    </section>
  );
};

interface AddAnimalModalProps {
  onClose: () => void;
  onCreated: (a: Animal) => void;
}

const AddAnimalModal = ({ onClose, onCreated }: AddAnimalModalProps) => {
  const [form, setForm] = useState({ name: '', type: 'goat', gender: 'Unknown', breed: '', birthDate: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/animals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const created = await res.json();
      onCreated(created);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ background: 'var(--card-bg)', color: 'var(--fg)', border: '1px solid var(--card-border)', padding: '2rem', borderRadius: '0.75rem', width: 'min(90%, 480px)', maxHeight: '80vh', overflowY: 'auto' }}>
      <h3 style={{ marginTop: 0 }}>Add Animal</h3>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Name</span>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Type</span>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
            <option value="goat">Goat</option>
            <option value="cattle">Cattle</option>
            <option value="sheep">Sheep</option>
            <option value="poultry">Poultry</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Gender</span>
          <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
            <option>Male</option>
            <option>Female</option>
            <option>Unknown</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Breed</span>
            <input value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }} />
        </label>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span>Birth Date</span>
          <input type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ padding: '0.5rem 0.9rem', background: 'var(--panel-bg)', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }}>Cancel</button>
        <button disabled={saving} type="submit" style={{ padding: '0.5rem 0.9rem', background: 'var(--nav-link-active-bg)', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
};

export default AnimalsPage;

interface AddBreedingModalProps {
  animals: Animal[];
  category: Category | null;
  onClose: () => void;
  onCreated: (record: any, updatedFemale: Animal) => void; // simplified for now
}

const AddBreedingModal = ({ animals, category, onClose, onCreated }: AddBreedingModalProps) => {
  const females = animals.filter(a => a.gender === 'female' && (!category || a.type === category));
  const males = animals.filter(a => a.gender === 'male' && (!category || a.type === category));
  const [form, setForm] = useState({ maleId: males[0]?.id || '', femaleId: females[0]?.id || '', breedingDate: new Date().toISOString().substring(0,10), dueMonth: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.maleId || !form.femaleId) { setError('Select both a male and a female.'); return; }
    setSaving(true);
    setError(null);
    try {
      // Build expectedDueDate using dueMonth (YYYY-MM) if provided (set to first day of month)
      const expectedDueDate = form.dueMonth ? `${form.dueMonth}-01T00:00:00.000Z` : undefined;
      const female = animals.find(a => a.id === form.femaleId);
      const male = animals.find(a => a.id === form.maleId);
      if (!female || !male) { setError('Selected animals not found.'); setSaving(false); return; }
      // POST breeding record
      const recordRes = await fetch('/api/breeding-records', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({
        farmId: female.farmId,
        maleAnimalId: male.id,
        femaleAnimalId: female.id,
        breedingDate: new Date(form.breedingDate).toISOString(),
        expectedDueDate,
        status: 'planned'
      })});
      const record = await recordRes.json();
      // PATCH female to status bred
      const patchRes = await fetch(`/api/animals/${female.id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ status: 'bred' }) });
      const updatedFemale = await patchRes.json();
      onCreated(record, updatedFemale);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create breeding record');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="add-animal-modal" aria-label="Add Breeding Record">
      <h3 style={{ marginTop: 0 }}>Add Breeding</h3>
      <div className="add-animal-form">
        <label>
          <span>Female</span>
          <select value={form.femaleId} onChange={e => setForm(f => ({ ...f, femaleId: e.target.value }))} className="" style={{ padding: '.4rem', background:'transparent', color:'var(--fg)', border:'1px solid var(--border-color)', borderRadius:6 }} required>
            <option value="">Select female</option>
            {females.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <label>
          <span>Male</span>
          <select value={form.maleId} onChange={e => setForm(f => ({ ...f, maleId: e.target.value }))} style={{ padding: '.4rem', background:'transparent', color:'var(--fg)', border:'1px solid var(--border-color)', borderRadius:6 }} required>
            <option value="">Select male</option>
            {males.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label>
          <span>Breeding Date</span>
          <input type="date" value={form.breedingDate} onChange={e => setForm(f => ({ ...f, breedingDate: e.target.value }))} style={{ padding: '.4rem', background:'transparent', color:'var(--fg)', border:'1px solid var(--border-color)', borderRadius:6 }} required />
        </label>
        <label>
          <span>Estimated Due (Month)</span>
          <input type="month" value={form.dueMonth} onChange={e => setForm(f => ({ ...f, dueMonth: e.target.value }))} style={{ padding: '.4rem', background:'transparent', color:'var(--fg)', border:'1px solid var(--border-color)', borderRadius:6 }} />
        </label>
        {error && <div style={{ color: 'var(--danger-fg, #f55)', fontSize: '.8rem' }}>{error}</div>}
      </div>
      <div className="add-animal-actions">
        <button type="button" onClick={onClose} style={{ padding: '0.5rem 0.9rem', background: 'var(--panel-bg)', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }}>Cancel</button>
        <button disabled={saving} type="submit" style={{ padding: '0.5rem 0.9rem', background: 'var(--nav-link-active-bg)', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: 6 }}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
};
