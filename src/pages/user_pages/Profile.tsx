
import {  Linkedin, Twitter, User, Upload, X, ImageUp, Facebook } from "lucide-react";
import profileAvatar from "../../assets/profile.jpg";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CompleteProfile from "./CompleteProfile";
import "react-day-picker/dist/style.css";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import DatePicker from "@/components/DatePicker";

interface UserProfile {
  phoneNumber: string;
  dateOfBirth: string;
  employmentStatus: string;
  currentAddress: string;
  emergencyContact: string;
  socialLinks: Record<string, string>;
  backgroundCheckConsent: { status: boolean; date: string | null };
  isCompleted: boolean;
}

const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5 },
  }),
}

const Profile = () => {
  const user = useSelector((state: any) => state.auth.user)
  const [openEditor, setOpenEditor] = useState(true);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [profile_img, setProfileImg] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  
axios.defaults.withCredentials = true;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<any>({
    phoneNumber: '',
    dateOfBirth: '',
    employmentStatus: '',
    currentAddress: '',
    emergencyContact: '',
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: ""
    },
  });
  const ref = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return; // Skip if already ran
    hasRunRef.current = true; // Set flag to true after first run

    const getProfile = async () => {
      setLoading(true);
      try {
        console.log(user.id);
        
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, { userId: user?.id }, {
           withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
         });
        setProfile(res.data.profile);
        setProfileImg(res.data.profile_image.image);
        setPreview(`${res.data.profile_image.image}`);

        console.log("Profile image URL:", res.data.profile_image.image);

        setForm({
          phoneNumber: res.data.profile.phoneNumber || '',
          dateOfBirth: res.data.profile.dateOfBirth || '',
          employmentStatus: res.data.profile.employmentStatus || '',
          currentAddress: res.data.profile.currentAddress || '',
          emergencyContact: res.data.profile.emergencyContact || '',
          socialLinks: res.data.profile.socialLinks || {},
        });

      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    // Check if profile is missing required fields
    if (profile?.isCompleted === false) {
      setIsWarningOpen(true);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setForm((prev: any) => ({
      ...prev,
      dateOfBirth: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      console.log("Profile update data:", { userId: user?.id, data: form });
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, 
        { userId: user?.id, data: form },
        { 
          withCredentials: true,
          headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}` // Safari Fix
        }
        });

      console.log("Profile update response:", res.data);

      

      // if (form.phoneNumber || form.dateOfBirth || form.employmentStatus || form.currentAddress || form.emergencyContact) {
      //   setOpenEditor(false);
      // }
      if (res.status === 200) {
        setOpenEditor(true);
        toast.success('Profile updated!', { className: "text-sm leading-loose" });

        setForm({
          phoneNumber: res.data.phoneNumber || '',
          dateOfBirth: res.data.dateOfBirth || '',
          employmentStatus: res.data.employmentStatus || '',
          currentAddress: res.data.currentAddress || '',
          emergencyContact: res.data.emergencyContact || '',
          socialLinks: res.data.socialLinks || {},
        });

        setProfile(res.data);
      }

    } catch (err) {
      toast.error('Update failed!', { className: "text-sm leading-loose" });
      console.log(err);

    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", user?.id || "");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profile/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("authToken")}` // Safari Fix
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Profile image uploaded successfully", { className: "text-sm leading-loose" });
        console.log("File uploaded successfully");
        setOpenUpload(false);
        setProfileImg(res.data.image);

      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      socialLinks: {
        ...form.socialLinks,
        [name]: value
      }
    });
  };

  if (loading) {
    return (<Spinner />);
  }

  return (
    <div className="min-h-screen bg-[background]">
      <CompleteProfile
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-bl from-background to-purply h-60 flex items-end">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-8">
          <div className="flex items-end gap-6">
            <div className="relative">
              <img
                src={profile_img ? `${profile_img}` : profileAvatar}
                alt="Profile Avatar"
                className="w-28 h-28 rounded-full border-4 border-background shadow-glow-primary object-cover"
              />
              <div className="absolute -top-0 -right-0 bg-green-500 text-primary-foreground rounded-full p-2 ">
                {/* <div className="w-1 h-1  bg-green-500 rounded-full"></div> */}
              </div>
              <div className="absolute -bottom-2 h-10 -right-4 bg-grey-300 text-primary-foreground rounded-full p-">
                <button onClick={() => setOpenUpload(true)}><ImageUp /></button>
              </div>
            </div>
            <div className="flex-1 text-foreground ml-2">
              <h1 className="text-2xl font-bold mb-">{user?.name}</h1>
              <p className=" text-foreground/80 mb-">{user?.email}</p>
              
            </div>
          </div>
        </div>
      </div>

      

      {openEditor ?
        <div className="flex- w-full md:px-12 px-4">
          <div className="md:max-w-6xl mx-auto px-2 md:px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-l from-[#3182ed] to-[#057e3b] bg-clip-text text-transparent">Profile Details</h2>
              <button className="bg-gradient-to-l mr-2 from-[#3182ed] to-[#56d28e] text-white px-2 py-1 text-sm rounded hover:scale-105 transition"
                onClick={() => { setOpenEditor(!openEditor) }}>Edit Profile</button>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              <div>
                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible"
                  className="border-l-teal-300">
                  <label className="block text-xs font-medium text-gray-400 ">User name</label>
                  <p className="w-full font-semibold">{user?.name}</p>
                  <hr className="my-1" />
                </motion.div>

                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-xs font-medium text-gray-400 pt-4">Email</label>
                  <p className="w-full font-semibold ">{user?.email}</p>
                  <hr className="my-1" />
                </motion.div>

                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-xs font-medium text-gray-400 pt-4">Phone Number</label>
                  <p className="w-full font-semibold ">{profile?.phoneNumber}</p>
                  {profile?.phoneNumber ? <hr className="my-1" /> : <hr className="mt-7 pt-[1px] bg-red-500 " />}
                </motion.div>

                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-xs font-medium text-gray-400 pt-4">Address</label>
                  <p className="w-full font-semibold ">{profile?.currentAddress}</p>
                  {profile?.currentAddress ? <hr className="my-1" /> : <hr className="mt-7 pt-[1px] bg-red-500 " />}
                </motion.div>
              </div>

              <div>
                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-xs font-medium text-gray-400 ">Date of Birth</label>
                  <p className="w-full font-semibold ">{profile?.dateOfBirth}</p>
                  {profile?.dateOfBirth ? <hr className="my-1" /> : <hr className="mt-7 pt-[1px] bg-red-500 " />}
                </motion.div>

                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-xs font-medium text-gray-400 pt-4">Employment Status</label>
                  <p className="w-full font-semibold ">{profile?.employmentStatus}</p>
                  {profile?.employmentStatus ? <hr className="my-1" /> : <hr className="mt-7 pt-[1px] bg-red-500 " />}
                </motion.div>

                <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible">
                  <label className="block text-xs font-medium text-gray-400 pt-4 ">Emergency Contact</label>
                  <p className="w-full font-semibold ">{profile?.emergencyContact}</p>
                  {profile?.emergencyContact ? <hr className="my-1" /> : <hr className="mt-7 pt-[1px] bg-red-500 " />}
                </motion.div>
              </div>
              

            </div>
            <motion.div custom={0.1} variants={fadeVariant} initial="hidden" animate="visible"
              className="mt-6 rounded-lg bg-gray-100 p-4 border shadow-sm">
              <label className="block text-xs font-medium text-gray-400 pb-2">Social Links</label>
              <div className="space-y-2">
                {Object.entries(profile?.socialLinks || {}).map(([platform, link]) => (
                  <div key={platform} className="flex items-center gap-3">
                    {platform === 'facebook' && <Facebook size={16} />}
                    {platform === 'twitter' && <Twitter size={16} />}
                    {platform === 'linkedin' && <Linkedin size={16} />}
                    <span className="text-sm italic font-semibold">{link}</span>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
        :
        <div className="w-full mb-4 max-w-6xl mx-auto md:px-12 px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold bg-gradient-to-l from-[#3182ed] via-red-500 to-[#56d28e] bg-clip-text text-transparent">Edit Your Profile</h2>
            <div>
              <button className="bg-gradient-to-l mr-2 from-[#3182ed] to-[#56d28e] text-white px-2 py-1 text-sm rounded hover:scale-105 transition"
                onClick={handleSubmit}>Save Changes</button>
              <button className="bg-gradient-to-l mr-2 from-[#3182ed] to-[#56d28e] text-white px-2 py-1 text-sm rounded hover:scale-105 transition"
                onClick={() => { setOpenEditor(!openEditor) }}>Cancel</button>
            </div>
          </div>
          <hr className="mb-6" />
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  type="number"
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div className="relative " ref={ref} >
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <DatePicker
                  selectedDate={form.dateOfBirth}
                  onDateChange={handleDateSelect}
                  placeholder="Select Date of Birth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                <select
                  name="employmentStatus"
                  value={form.employmentStatus}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Employment Status</option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Address</label>
                <input
                  name="currentAddress"
                  value={form.currentAddress}
                  onChange={handleChange}
                  placeholder="Enter your current address"
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              

              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <input
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  placeholder="Enter your emergency contact"
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
            </div>
          </form>
          <hr className="mt-6 mb-2 py-[1px] bg-green-500" />
          <div className="">
            <h3 className="text-lg font-semibold  bg-gradient-to-l from-[#3182ed] via-red-500 to-[#13ac58] bg-clip-text text-transparent">Social Links</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="url"
                  name="facebook"
                  value={form.socialLinks.facebook}
                  onChange={handleSocialChange}
                  className="mt-1 block w-full border border-gray-300 px-2 py-1 rounded-md"
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={form.socialLinks.twitter}
                  onChange={handleSocialChange}
                  className="mt-1 block w-full border border-gray-300 px-2 py-1 rounded-md"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={form.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  className="mt-1 block w-full border border-gray-300 px-2 py-1 rounded-md"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>
        </div>
      }

      {openUpload &&
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-3 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg p-6 w-96 shadow-lg relative"
            >
              {/* Close Button */}
              <button
                onClick={() => { setOpenUpload(false); setPreview(null); setFile(null); }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Update Profile Picture
              </h2>

              {/* Preview */}
              <div className="flex justify-center mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              

              {/* File Input */}
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition">
                <Upload className="w-4 h-4" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={!file || uploading}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Save"}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>}
    </div>
  );
};

export default Profile;