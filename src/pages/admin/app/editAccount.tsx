import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Camera,
  Check,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { BACKEND_DOMAIN } from "../../../configs/config";
import type { IUser } from "../../../@types/interface";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { Menu } from "lucide-react";

interface EditFormData {
  firstname: string;
  surname: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  address: string;
  maritalStatus: string;
  profile_url: string;
}

function EditAccount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );

  const [form, setForm] = useState<EditFormData>({
    firstname: "",
    surname: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    address: "",
    maritalStatus: "",
    profile_url: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordError(null);

      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/users/${id}/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true },
      );

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(
          err.response?.data?.message || "Failed to update password.",
        );
      } else if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError("Something went wrong.");
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_DOMAIN}/api/v1/users/${id}`, {
        withCredentials: true,
      });
      const data = response.data.data;
      setUser(data);
      setForm({
        firstname: data.firstname || "",
        surname: data.surname || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "",
        birthDate: data.birthDate
          ? new Date(data.birthDate).toISOString().split("T")[0]
          : "",
        address: data.address || "",
        maritalStatus: data.maritalStatus || "",
        profile_url: data.profile_url || "",
      });
      setPreviewImage(data.profile_url || null);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setError("Failed to load account details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));

    // Upload image immediately
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("profile", file);

      const res = await axios.post(
        `${BACKEND_DOMAIN}/api/v1/users/${id}/upload-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setForm((prev) => ({ ...prev, profile_url: res.data.data.profile_url }));
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Failed to upload image.");
      setPreviewImage(user?.profile_url || null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setImageUploading(true);
      await axios.delete(
        `${BACKEND_DOMAIN}/api/v1/users/${id}/remove-profile`,
        {
          withCredentials: true,
        },
      );
      setPreviewImage(null);
      setForm((prev) => ({ ...prev, profile_url: "" }));
    } catch (err) {
      console.error("Failed to remove image", err);
      setError("Failed to remove image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstname.trim() || !form.surname.trim() || !form.email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await axios.patch(`${BACKEND_DOMAIN}/api/v1/users/${id}`, form, {
        withCredentials: true,
      });

      setSuccess(true);
      // Navigate back after a short delay
      setTimeout(() => navigate(`/users/${id}`), 1500);
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ──────────── LOADING ────────────
  if (loading) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        <Sidebar
          page="patients"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
        <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
          <div className="flex items-center gap-1 w-full">
            <Menu
              onClick={() => setOpenSidebar(true)}
              className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
            />
            <Header headline="Edit Account" />
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400 dark:text-zinc-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading account details...
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ──────────── NOT FOUND ────────────
  if (!user) {
    return (
      <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
        <Sidebar
          page="patients"
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
        <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
          <div className="flex items-center gap-1 w-full">
            <Menu
              onClick={() => setOpenSidebar(true)}
              className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
            />
            <Header headline="Edit Account" />
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400 dark:text-zinc-600">
              Account not found
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ──────────── MAIN RENDER ────────────
  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      <Sidebar
        page="patients"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-y-auto">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Edit Account" />
        </div>

        {/* Toast Messages */}
        {error && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-md animate-slide-in">
            <X className="w-4 h-4 shrink-0" />
            <p className="text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {success && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg shadow-md animate-slide-in">
            <Check className="w-4 h-4 shrink-0" />
            <p className="text-sm">Account updated successfully!</p>
          </div>
        )}

        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">
          {/* Profile Image */}
          <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Profile Photo
            </h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Preview */}
              <div className="relative group">
                <img
                  src={previewImage || "/assets/images/user-profile.jpg"}
                  alt="Profile preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-zinc-200 dark:border-zinc-700"
                />

                {/* Overlay on hover */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>

                {imageUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Upload a square photo. Max 5MB, PNG/JPG supported.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-4 h-4" />
                    {previewImage ? "Change Photo" : "Upload Photo"}
                  </button>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={imageUploading}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150 cursor-pointer"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              {/* Marital Status */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={form.maritalStatus}
                  onChange={handleChange}
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150 cursor-pointer"
                >
                  <option value="" disabled>
                    Select marital status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+63 XXX XXX XXXX"
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              {/* Address (full width) */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address, city, province"
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/patients/${id}`)}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
            >
              <X className="w-4 h-4" />
              <span className="font-medium">Cancel</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="font-medium">
                {saving ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-system-white dark:bg-system-black rounded-xl border border-zinc-300 dark:border-zinc-700 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              Change Password
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Enter your current password to set a new one.
            </p>

            {passwordError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg mb-4">
                <X className="w-4 h-4 shrink-0" />
                <p className="text-sm">{passwordError}</p>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg mb-4">
                <Check className="w-4 h-4 shrink-0" />
                <p className="text-sm">Password updated successfully!</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Min. 6 characters"
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Re-enter new password"
                  className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-lg px-3 py-2 text-sm bg-transparent text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-600 transition-colors duration-150"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={
                passwordSaving ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmPassword
              }
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="font-medium">
                {passwordSaving ? "Updating..." : "Update Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditAccount;
