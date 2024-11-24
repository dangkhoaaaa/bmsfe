import React, { useEffect, useState } from 'react';
import './PackageComponent.css'; // Import the CSS file

const PackageAdmin = () => {
  const [packages, setPackages] = useState([]); // State to store package list
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('https://bms-fs-api.azurewebsites.net/api/Package?isDesc=true&pageIndex=1&pageSize=5');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        setPackages(data.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Membership Packages</h1>
      <input
        type="text"
        placeholder="Search packages..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {filteredPackages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <ul>
          {filteredPackages.map(pkg => (
            <li key={pkg.id} className="package-box">
              <h2>{pkg.name}</h2>
              <p>Description: {pkg.description}</p>
              <p>Price: ${pkg.price.toFixed(2)}</p>
              <p>Duration: {pkg.duration} days</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PackageAdmin;
