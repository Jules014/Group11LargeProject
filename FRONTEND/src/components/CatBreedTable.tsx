import { useEffect, useState } from 'react';

interface Cat {
  breed: string;
  size: string;
  weight: string;
  coat: string;
  color: string;
  link: string;
}

const CatBreedTable = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('http://cop4331-11.com:5000/api/catbreeds');
        const data = await res.json();
        if (data.error) setError(data.error);
        else setCats(data.cats);
      } catch (err) {
        setError('Failed to fetch cat breeds.');
      }
    };

    fetchCats();
  }, []);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="overflow-x-auto px-4 py-6">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700 uppercase">
            <th className="px-4 py-3">Breed</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Weight</th>
            <th className="px-4 py-3">Coat</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">More Info</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 text-sm">
              <td className="px-4 py-2">{cat.breed}</td>
              <td className="px-4 py-2">{cat.size}</td>
              <td className="px-4 py-2">{cat.weight}</td>
              <td className="px-4 py-2">{cat.coat}</td>
              <td className="px-4 py-2">{cat.color}</td>
              <td className="px-4 py-2">
                <a href={cat.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatBreedTable;
