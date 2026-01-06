import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading";
import {
  User,
  Mail,
  MapPin,
  Save,
  Camera,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Edit,
  Globe,
  Phone,
  Award,
  Star,
  ChefHat,
  Sparkles,
} from "lucide-react";
import useVerified from "../../hooks/useVerified";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { isVerified } = useVerified();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    locationLabel: "",
    phone: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${user.uid}`);
        const u = res.data.users;
        setUserData(u);
        setForm({
          fullName: u.fullName || "",
          locationLabel: u.locationLabel || "",
        });
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:3000/users/${userData.uid}`, {
        fullName: form.fullName,
        locationLabel: form.locationLabel,
      });
      setUserData((prev) => ({ ...prev, ...form }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      fullName: userData?.fullName || "",
      locationLabel: userData?.locationLabel || "",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Loading />;

  const isCook = userData?.role === "cook";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-6">
            <div className="text-center mb-6">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary-hover transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  {form.fullName || userData?.fullName}
                </h2>
                <p className="text-muted-foreground flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>

              {/* Verified Badge */}
              {isVerified && (
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Verified Account</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your identity has been verified. This builds trust in the
                    community.
                  </p>
                </div>
              )}

              {/* Role Badge */}
              <div className="mt-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isCook
                      ? "bg-secondary/10 text-secondary border border-secondary/20"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}
                >
                  {isCook ? (
                    <>
                      <ChefHat className="w-5 h-5" />
                      <span className="font-medium">Verified Cook</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      <span className="font-medium">Food Enthusiast</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Member Since
                </span>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(userData?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Read-only View */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Full Name
                    </p>
                    <p className="font-medium text-foreground">
                      {userData?.fullName || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Account Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Verification Status
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          isVerified
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Not Verified
                          </>
                        )}
                      </span>
                    </div>

                    {/* Quick action to request verification */}
                    {!isVerified && (
                      <div className="mt-3">
                        <button
                          onClick={() => navigate("/dashboard/verify")}
                          className="px-3 py-2 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition"
                        >
                          Request Verification
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Account Type
                      </span>
                      <span className="font-medium capitalize">
                        {userData?.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Member Since
                      </span>
                      <span className="font-medium">
                        {formatDate(userData?.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
