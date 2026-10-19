import React from 'react';
import { useStore } from '../context/StoreContext';
import { Smartphone, Laptop, Headphones, Watch, Keyboard, Layers } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Layers size={15} />,
  Mobiles: <Smartphone size={15} />,
  Computers: <Laptop size={15} />,
  Audio: <Headphones size={15} />,
  Wearables: <Watch size={15} />,
  Accessories: <Keyboard size={15} />,
  Electronics: <Smartphone size={15} />,
};

export const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, filteredProducts } = useStore();

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '0 24px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      {/* Category Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                background: isSelected ? 'var(--primary-blue)' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#334155',
                border: isSelected ? '1px solid var(--primary-blue)' : '1px solid #CBD5E1',
                padding: '6px 14px',
                fontSize: '0.82rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: isSelected ? 700 : 500,
                boxShadow: isSelected ? '0 2px 4px rgba(23, 105, 210, 0.25)' : 'none',
              }}
            >
              {CATEGORY_ICONS[cat] || <Layers size={15} />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count & Filter notice */}
      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
        Showing <strong>{filteredProducts.length}</strong> items {selectedCategory !== 'All' && <span>in <strong style={{ color: '#1769D2' }}>{selectedCategory}</strong></span>}
      </div>
    </div>
  );
};
