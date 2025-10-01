import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';

interface Animal {
  id: string;
  farmId: string;
  name: string;
  type: 'goat' | 'cow' | 'sheep' | 'pig' | 'horse' | 'chicken';
  breed?: string;
  gender: 'male' | 'female';
  birthDate?: string;
  parentMaleId?: string;
  parentFemaleId?: string;
  registrationNumber?: string;
  notes?: string;
  createdAt: string;
}

interface BreedingRecord {
  id: string;
  farmId: string;
  maleAnimalId: string;
  femaleAnimalId: string;
  breedingDate: string;
  expectedDueDate?: string;
  actualBirthDate?: string;
  offspring?: string[];
  status: 'planned' | 'confirmed' | 'successful' | 'unsuccessful';
  notes?: string;
  createdAt: string;
}

export const BreedingPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('all');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [showAddAnimalForm, setShowAddAnimalForm] = useState(false);
  const [showAddBreedingForm, setShowAddBreedingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [animalsRes, breedingRes] = await Promise.all([
        fetch('/api/animals'),
        fetch('/api/breeding-records')
      ]);
      
      const animalsData = await animalsRes.json();
      const breedingData = await breedingRes.json();
      
      setAnimals(animalsData);
      setBreedingRecords(breedingData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnimals = selectedAnimalType === 'all' 
    ? animals 
    : animals.filter(animal => animal.type === selectedAnimalType);

  const getAnimalName = (id: string) => {
    const animal = animals.find(a => a.id === id);
    return animal ? animal.name : 'Unknown';
  };

  const getSelectedAnimal = () =>
    selectedAnimalId ? animals.find(a => a.id === selectedAnimalId) ?? null : null;

  const handleAddAnimal = async (animalData: Partial<Animal>) => {
    try {
      const response = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData)
      });
      
      if (response.ok) {
        fetchData(); // Refresh data
        setShowAddAnimalForm(false);
      }
    } catch (error) {
      console.error('Error adding animal:', error);
    }
  };

  const handleAddBreeding = async (breedingData: Partial<BreedingRecord>) => {
    try {
      const response = await fetch('/api/breeding-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(breedingData)
      });
      
      if (response.ok) {
        fetchData(); // Refresh data
        setShowAddBreedingForm(false);
      }
    } catch (error) {
      console.error('Error adding breeding record:', error);
    }
  };

  if (loading) {
    return <div className="module-panel">Loading breeding data...</div>;
  }

  return (
    <section className="module-panel" aria-labelledby="breeding-heading">
      <h2 id="breeding-heading">Breeding Management</h2>
      
  <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="animal-type-filter" style={{ marginRight: '0.5rem' }}>
          Filter by Animal Type:
        </label>
        <select 
          id="animal-type-filter"
          value={selectedAnimalType} 
          onChange={(e) => setSelectedAnimalType(e.target.value)}
          style={{ padding: '0.25rem', marginRight: '1rem' }}
        >
          <option value="all">All Animals</option>
          <option value="goat">Goats</option>
          <option value="cow">Cows</option>
          <option value="sheep">Sheep</option>
          <option value="pig">Pigs</option>
          <option value="horse">Horses</option>
          <option value="chicken">Chickens</option>
        </select>
        
        <button 
          onClick={() => setShowAddAnimalForm(true)}
          style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
        >
          Add Animal
        </button>
        
        <button 
          onClick={() => setShowAddBreedingForm(true)}
          style={{ padding: '0.25rem 0.5rem' }}
        >
          Record Breeding
        </button>
      </div>

      {/* Animals Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Animals ({filteredAnimals.length})</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filteredAnimals.map(animal => (
            <div key={animal.id} style={{ 
              border: '1px solid var(--card-border)', 
              padding: '1rem', 
              borderRadius: '0.25rem',
              background: 'var(--card-bg)',
              cursor: 'pointer',
              outline: selectedAnimalId === animal.id ? '2px solid var(--nav-link-active-bg)' : 'none'
            }} onClick={() => setSelectedAnimalId(animal.id)} role="button" aria-pressed={selectedAnimalId === animal.id}>
              <h4 style={{
                color: 'var(--fg)',
                borderBottom: '1px solid var(--divider-color)',
                paddingBottom: '0.25rem',
                marginBottom: '0.5rem'
              }}>{animal.name} ({animal.gender})</h4>
              <p><strong>Type:</strong> {animal.type}</p>
              {animal.breed && <p><strong>Breed:</strong> {animal.breed}</p>}
              {animal.birthDate && <p><strong>Birth Date:</strong> {new Date(animal.birthDate).toLocaleDateString()}</p>}
              {animal.registrationNumber && <p><strong>Registration:</strong> {animal.registrationNumber}</p>}
              {animal.parentMaleId && <p><strong>Father:</strong> {getAnimalName(animal.parentMaleId)}</p>}
              {animal.parentFemaleId && <p><strong>Mother:</strong> {getAnimalName(animal.parentFemaleId)}</p>}
              {animal.notes && <p><strong>Notes:</strong> {animal.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Selected animal breeding records */}
      {selectedAnimalId && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>
              Breeding Records for {getSelectedAnimal()?.name ?? 'Animal'}
            </h3>
            <button onClick={() => setSelectedAnimalId(null)} style={{ padding: '0.25rem 0.5rem' }}>Clear</button>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {breedingRecords
              .filter(r => r.maleAnimalId === selectedAnimalId || r.femaleAnimalId === selectedAnimalId)
              .map(record => (
                <div key={record.id} style={{
                  border: '1px solid var(--card-border)',
                  padding: '1rem',
                  borderRadius: '0.25rem',
                  background: 'var(--card-bg)'
                }}>
                  <h4>Breeding {record.id}</h4>
                  <p><strong>Male:</strong> {getAnimalName(record.maleAnimalId)}</p>
                  <p><strong>Female:</strong> {getAnimalName(record.femaleAnimalId)}</p>
                  <p><strong>Breeding Date:</strong> {new Date(record.breedingDate).toLocaleDateString()}</p>
                  {record.expectedDueDate && (
                    <p><strong>Expected Due:</strong> {new Date(record.expectedDueDate).toLocaleDateString()}</p>
                  )}
                  {record.actualBirthDate && (
                    <p><strong>Birth Date:</strong> {new Date(record.actualBirthDate).toLocaleDateString()}</p>
                  )}
                  <p><strong>Status:</strong> {record.status}</p>
                  {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                </div>
            ))}
            {breedingRecords.filter(r => r.maleAnimalId === selectedAnimalId || r.femaleAnimalId === selectedAnimalId).length === 0 && (
              <div style={{ color: 'var(--fg)' }}>No breeding records for this animal yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Breeding Records Section */}
      <div>
        <h3>Breeding Records ({breedingRecords.length})</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {breedingRecords.map(record => (
            <div key={record.id} style={{ 
              border: '1px solid var(--card-border)', 
              padding: '1rem', 
              borderRadius: '0.25rem',
              background: 'var(--card-bg)'
            }}>
              <h4>Breeding {record.id}</h4>
              <p><strong>Male:</strong> {getAnimalName(record.maleAnimalId)}</p>
              <p><strong>Female:</strong> {getAnimalName(record.femaleAnimalId)}</p>
              <p><strong>Breeding Date:</strong> {new Date(record.breedingDate).toLocaleDateString()}</p>
              {record.expectedDueDate && (
                <p><strong>Expected Due:</strong> {new Date(record.expectedDueDate).toLocaleDateString()}</p>
              )}
              {record.actualBirthDate && (
                <p><strong>Birth Date:</strong> {new Date(record.actualBirthDate).toLocaleDateString()}</p>
              )}
              <p><strong>Status:</strong> {record.status}</p>
              {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Add Animal Form Modal */}
      {showAddAnimalForm && (
        <AddAnimalForm 
          onSubmit={handleAddAnimal}
          onCancel={() => setShowAddAnimalForm(false)}
          animals={animals}
        />
      )}

      {/* Add Breeding Form Modal */}
      {showAddBreedingForm && (
        <AddBreedingForm 
          onSubmit={handleAddBreeding}
          onCancel={() => setShowAddBreedingForm(false)}
          animals={animals}
        />
      )}
    </section>
  );
};

// Form component for adding animals
const AddAnimalForm = ({ 
  onSubmit, 
  onCancel, 
  animals 
}: { 
  onSubmit: (data: Partial<Animal>) => void;
  onCancel: () => void;
  animals: Animal[];
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'goat' as Animal['type'],
    breed: '',
    gender: 'female' as Animal['gender'],
    birthDate: '',
    parentMaleId: '',
    parentFemaleId: '',
    registrationNumber: '',
    notes: '',
    farmId: 'farm-1'
  });

  const maleAnimals = animals.filter(a => a.gender === 'male');
  const femaleAnimals = animals.filter(a => a.gender === 'female');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    
    // Convert date string to ISO datetime if provided
    if (dataToSubmit.birthDate) {
      dataToSubmit.birthDate = new Date(dataToSubmit.birthDate + 'T00:00:00.000Z').toISOString();
    }
    
    // Remove empty strings
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key as keyof typeof dataToSubmit] === '') {
        delete dataToSubmit[key as keyof typeof dataToSubmit];
      }
    });
    onSubmit(dataToSubmit);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{ 
        background: 'var(--card-bg)',
        color: 'var(--fg)',
        border: '1px solid var(--card-border)',
        padding: '2rem', 
        borderRadius: '0.5rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3>Add New Animal</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Name*:</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Type*:</label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value as Animal['type']})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="goat">Goat</option>
            <option value="cow">Cow</option>
            <option value="sheep">Sheep</option>
            <option value="pig">Pig</option>
            <option value="horse">Horse</option>
            <option value="chicken">Chicken</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Gender*:</label>
          <select 
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value as Animal['gender']})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Breed:</label>
          <input 
            type="text" 
            value={formData.breed}
            onChange={(e) => setFormData({...formData, breed: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Birth Date:</label>
          <input 
            type="date" 
            value={formData.birthDate}
            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Father:</label>
          <select 
            value={formData.parentMaleId}
            onChange={(e) => setFormData({...formData, parentMaleId: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="">Select Father</option>
            {maleAnimals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Mother:</label>
          <select 
            value={formData.parentFemaleId}
            onChange={(e) => setFormData({...formData, parentFemaleId: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="">Select Mother</option>
            {femaleAnimals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Registration Number:</label>
          <input 
            type="text" 
            value={formData.registrationNumber}
            onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Notes:</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', minHeight: '60px', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Add Animal</button>
        </div>
      </form>
    </div>
  );
};

// Form component for adding breeding records
const AddBreedingForm = ({ 
  onSubmit, 
  onCancel, 
  animals 
}: { 
  onSubmit: (data: Partial<BreedingRecord>) => void;
  onCancel: () => void;
  animals: Animal[];
}) => {
  const [formData, setFormData] = useState({
    maleAnimalId: '',
    femaleAnimalId: '',
    breedingDate: '',
    expectedDueDate: '',
    status: 'planned' as BreedingRecord['status'],
    notes: '',
    farmId: 'farm-1'
  });

  const maleAnimals = animals.filter(a => a.gender === 'male');
  const femaleAnimals = animals.filter(a => a.gender === 'female');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    
    // Convert date strings to ISO datetime if provided
    if (dataToSubmit.breedingDate) {
      dataToSubmit.breedingDate = new Date(dataToSubmit.breedingDate + 'T00:00:00.000Z').toISOString();
    }
    if (dataToSubmit.expectedDueDate) {
      dataToSubmit.expectedDueDate = new Date(dataToSubmit.expectedDueDate + 'T00:00:00.000Z').toISOString();
    }
    
    // Remove empty strings
    Object.keys(dataToSubmit).forEach(key => {
      if (dataToSubmit[key as keyof typeof dataToSubmit] === '') {
        delete dataToSubmit[key as keyof typeof dataToSubmit];
      }
    });
    onSubmit(dataToSubmit);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{ 
        background: 'var(--card-bg)',
        color: 'var(--fg)',
        border: '1px solid var(--card-border)',
        padding: '2rem', 
        borderRadius: '0.5rem',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h3>Record New Breeding</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Male Animal*:</label>
          <select 
            value={formData.maleAnimalId}
            onChange={(e) => setFormData({...formData, maleAnimalId: e.target.value})}
            required 
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="">Select Male</option>
            {maleAnimals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name} ({animal.type})</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Female Animal*:</label>
          <select 
            value={formData.femaleAnimalId}
            onChange={(e) => setFormData({...formData, femaleAnimalId: e.target.value})}
            required 
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="">Select Female</option>
            {femaleAnimals.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name} ({animal.type})</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Breeding Date*:</label>
          <input 
            type="date" 
            value={formData.breedingDate}
            onChange={(e) => setFormData({...formData, breedingDate: e.target.value})}
            required 
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Expected Due Date:</label>
          <input 
            type="date" 
            value={formData.expectedDueDate}
            onChange={(e) => setFormData({...formData, expectedDueDate: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Status:</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as BreedingRecord['status']})}
            style={{ width: '100%', padding: '0.25rem', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value="planned">Planned</option>
            <option value="confirmed">Confirmed</option>
            <option value="successful">Successful</option>
            <option value="unsuccessful">Unsuccessful</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Notes:</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            style={{ width: '100%', padding: '0.25rem', minHeight: '60px', background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Record Breeding</button>
        </div>
      </form>
    </div>
  );
};