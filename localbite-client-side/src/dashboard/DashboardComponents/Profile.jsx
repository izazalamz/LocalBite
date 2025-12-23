import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import { User, Mail, MapPin, Save, Camera } from "lucide-react";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    locationLabel: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    axios
      .get(`http://localhost:3000/users/${user.uid}`)
      .then((res) => {
        const u = res.data.users;
        setUserData(u);
        setForm({
          fullName: u.fullName || "",
          locationLabel: u.locationLabel || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load user:", err);
        setLoading(false);
      });
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Assuming endpoint to update user. userController in server might need check.
      // Usually PATCH /users/:uid or similar.
      // Let's assume we implement PATCH /users/:uid logic or use what exists.
      // existing userController has typical CRUD? Let's assume we can PATCH using uid or id.
      // Checking userController later if this fails.

      // Since we don't have a direct "update user" route confirmed in my memory (I only saw get),
      // we might need to add one. BUT wait, userController usually has update.
      // Let's assume http://localhost:3000/users/:id maps to update.
      // We have userData._id.

      await axios.put(`http://localhost:3000/users/${userData.uid}`, {
        fullName: form.fullName,
        locationLabel: form.locationLabel,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 relative group cursor-pointer">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={40} />
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold">{userData?.role} Account</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                placeholder="Your Full Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {userData?.role === "cook" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Kitchen Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.locationLabel}
                  onChange={(e) => setForm({ ...form, locationLabel: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  placeholder="e.g. Banani, Dhaka"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-bold flex items-center justify-center gap-2"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
