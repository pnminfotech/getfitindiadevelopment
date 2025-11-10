import { useEffect, useState } from "react";
import { courtOwnerApi } from "../../api/courtOwnerApi";
import CourtOwnerSidebar from "../../components/courtowner/CourtOwnerSidebar";

export default function CourtOwnerProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    courtOwnerApi.getProfile().then(setProfile);
  }, []);

  if (!profile)
    return (
      <div className="flex">
        <CourtOwnerSidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <p>Loading profile...</p>
        </div>
      </div>
    );

  return (
    <div className="flex">
      <CourtOwnerSidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="bg-white shadow p-6 rounded w-2/3">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Business Name:</strong> {profile.businessName}</p>
          <p><strong>Status:</strong> {profile.status}</p>
          <p className="text-sm text-gray-500 mt-3">
            Created: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
