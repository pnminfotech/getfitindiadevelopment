import { useEffect, useState } from "react";
import { courtOwnerApi } from "../../api/courtOwnerApi";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

export default function CourtOwnerVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenues = async () => {
      const data = await courtOwnerApi.getVenues();
      setVenues(data || []);
      setLoading(false);
    };
    loadVenues();
  }, []);

  return (
    <div className="flex">
      <CourtOwnerSidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">My Venues</h1>

        {loading ? (
          <p>Loading venues...</p>
        ) : venues.length === 0 ? (
          <p className="text-gray-600">No venues found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue._id} className="bg-white rounded shadow p-4">
                <img
                  src={`http://localhost:8000/uploads/${venue.image}`}
                  alt={venue.name}
                  className="h-40 w-full object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-2">{venue.name}</h2>
                <p className="text-gray-500 text-sm">{venue.city}</p>
                <p className="text-sm mt-1">{venue.description}</p>
                <p className="text-blue-600 font-medium mt-2">
                  ₹{venue.pricing}/hour
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
