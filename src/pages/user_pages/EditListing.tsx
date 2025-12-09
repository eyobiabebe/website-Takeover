// src/pages/EditListing.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import DatePicker from "@/components/DatePicker";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import LocationPicker from "@/components/LocationPicker";

interface Section {
  id: number;
  name: string;
  images: (File | string)[];
}

const carSections = ["Exterior", "Interior", "Engine", "Wheels"];
const apartmentSections = ["Living Room", "Kitchen", "Bedroom", "Bathroom"];

const EditListing: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [deletedImages, setDeletedImages] = useState<{ [key: string]: string[] }>({});
 axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState<any>({
    userId: String(userId),
    title: "",
    lat: "",
    lng: "",
    location: "",
    monthlyPrice: "",
    description: "",
    type: "apartment",
    startDate: new Date(),
    endDate: new Date(),
    incentive: "",
    currentMiles: "",
    remainingMiles: "",
    milesPerMonth: "",
    saleId: "",
    vin_no: "",
    leasingCompany: { name: "", email: "" },
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    landlordInfo: { name: "", phone: "", email: "" },
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSection, setNewSection] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch existing listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/listings/${id}`, { withCredentials: true });
        const listing = res.data;

        setFormData({
          userId: String(listing.userId),
          title: listing.title,
          lat: listing.lat,
          lng: listing.lng,
          location: listing.location,
          monthlyPrice: listing.monthlyPrice,
          description: listing.description,
          type: listing.type,
          startDate: new Date(listing.startDate),
          endDate: new Date(listing.endDate),
          incentive: listing.incentive,
          currentMiles: listing.currentMiles || "",
          remainingMiles: listing.remainingMiles || "",
          milesPerMonth: listing.milesPerMonth || "",
          saleId: listing.saleId || "",
          vin_no: listing.vin_no || "",
          leasingCompany: listing.leasingCompany || { name: "", email: "" },
          bedrooms: listing.bedrooms || "",
          bathrooms: listing.bathrooms || "",
          sqft: listing.sqft || "",
          landlordInfo: listing.landlordInfo || { name: "", phone: "", email: "" },
        });

        const imagesBySection = listing.images || {};
        const initialSections =
          listing.type === "apartment"
            ? apartmentSections.map((name, idx) => ({
                id: idx + 1,
                name,
                images: imagesBySection[name] || [],
              }))
            : carSections.map((name, idx) => ({
                id: idx + 1,
                name,
                images: imagesBySection[name] || [],
              }));
        setSections(initialSections);

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load listing");
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  const handleSelectLocation = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=45fee84be7024e7283835fc1606f9aad`
      );
      const data = await res.json();
      setFormData((prev: any) => ({
        ...prev,
        lat: String(lat),
        lng: String(lng),
        location: data.features[0].properties.formatted || "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("landlordInfo.")) {
      const key = name.split(".")[1];
      setFormData((prev: any) => ({
        ...prev,
        landlordInfo: { ...prev.landlordInfo, [key]: value },
      }));
    } else if (name.startsWith("leasingCompany.")) {
      const key = name.split(".")[1];
      setFormData((prev: any) => ({
        ...prev,
        leasingCompany: { ...prev.leasingCompany, [key]: value },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    const updatedSections =
      value === "apartment"
        ? apartmentSections.map((name, idx) => ({ id: idx + 1, name, images: [] }))
        : carSections.map((name, idx) => ({ id: idx + 1, name, images: [] }));
    setSections(updatedSections);
  };

  const handleDateSelect = (date: Date | undefined, isStartDate: boolean) => {
    if (!date) return;
    const today = startOfDay(new Date());
    if (isStartDate && isAfter(date, today)) {
      toast.error("Start date must be before today!");
      return;
    }
    if (!isStartDate && isBefore(date, today)) {
      toast.error("End date must be after today!");
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      [isStartDate ? "startDate" : "endDate"]: date,
    }));
  };

  const handleImageUpload = (id: number, files: FileList | null) => {
    if (!files) return;
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, images: [...section.images, ...Array.from(files)] }
          : section
      )
    );
  };

  const handleRemoveImage = (sectionId: number, index: number) => {
  setSections(prev =>
    prev.map(section => {
      if (section.id !== sectionId) return section;

      const removed = section.images[index];

      if (typeof removed === "string") {
        // this was an existing image from DB
        setDeletedImages(prevDeleted => ({
          ...prevDeleted,
          [section.name]: [...(prevDeleted[section.name] || []), removed],
        }));
      }

      return {
        ...section,
        images: section.images.filter((_, i) => i !== index),
      };
    })
  );
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          form.append(`${key}[${subKey}]`, subValue as string);
        });
      } else {
        form.append(key, value as string);
      }
    });

    Object.entries(deletedImages).forEach(([sectionName, images]) => {
  images.forEach(url => {
    form.append(`deletedImages[${sectionName}][]`, url);
  });
});


    form.append("startDate", formData.startDate as any);
    form.append("endDate", formData.endDate as any);

    sections.forEach((section) => {
      section.images.forEach((file: any) => {
        if (file instanceof File) {
          form.append(`images[${section.name}]`, file);
        }
      });
    });

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/listings/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Listing updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update listing");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 pt-12">
      <h1 className="mt-20 mb-6 text-xl font-bold md:text-2xl">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleSelectChange}
            className="border rounded-lg p-2"
          >
            <option value="apartment">Apartment</option>
            <option value="car">Car</option>
          </select>
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Start Date</label>
          <DatePicker
            selectedDate={formData.startDate}
            onDateChange={(date: Date) => handleDateSelect(date, true)}
          />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">End Date</label>
                        <DatePicker
              selectedDate={formData.endDate}
              onDateChange={(date: Date) => handleDateSelect(date, false)}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Monthly Price</label>
          <input
            type="text"
            name="monthlyPrice"
            value={formData.monthlyPrice}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
        </div>

        {/* Incentive */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Incentive</label>
          <input
            type="text"
            name="incentive"
            value={formData.incentive}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg p-2"
            rows={4}
          />
        </div>

        {/* Type-specific fields */}
{formData.type === "car" && (
  <>
    {/* Car fields */}
    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">VIN Number</label>
      <input
        type="text"
        name="vin_no"
        value={formData.vin_no}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Current Miles</label>
      <input
        type="number"
        name="currentMiles"
        value={formData.currentMiles}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Remaining Miles</label>
      <input
        type="number"
        name="remainingMiles"
        value={formData.remainingMiles}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Miles per Month</label>
      <input
        type="number"
        name="milesPerMonth"
        value={formData.milesPerMonth}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Leasing Company Name</label>
      <input
        type="text"
        name="leasingCompany.name"
        value={formData.leasingCompany.name}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Leasing Company Email</label>
      <input
        type="email"
        name="leasingCompany.email"
        value={formData.leasingCompany.email}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>
  </>
)}

{formData.type === "apartment" && (
  <>
    {/* Apartment fields */}
    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Bedrooms</label>
      <input
        type="number"
        name="bedrooms"
        value={formData.bedrooms}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Bathrooms</label>
      <input
        type="number"
        name="bathrooms"
        value={formData.bathrooms}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Square Feet</label>
      <input
        type="number"
        name="sqft"
        value={formData.sqft}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Landlord Name</label>
      <input
        type="text"
        name="landlordInfo.name"
        value={formData.landlordInfo.name}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Landlord Phone</label>
      <input
        type="text"
        name="landlordInfo.phone"
        value={formData.landlordInfo.phone}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 mb-1">Landlord Email</label>
      <input
        type="email"
        name="landlordInfo.email"
        value={formData.landlordInfo.email}
        onChange={handleChange}
        className="border rounded-lg p-2"
      />
    </div>
  </>
)}


        {/* Location */}
        <div className="relative z-0">
          <p className="text-gray-400 pb-1 pl-1">Location</p>
          <LocationPicker onSelectLocation={handleSelectLocation} />
          {location && (
            <p className="text-sm text-gray-600">
              Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)} <br />
              Address: {formData.location}
            </p>
          )}
        </div>

        {/* Sections for images */}
        <h1 className="text-lg font-bold">Upload Images</h1>
        <AnimatePresence>
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
              className="border rounded-lg p-4 shadow-sm bg-white text-sm"
            >
              <h2 className="text- font-semibold mb-2">{section.name}</h2>

              <label className="flex items-center gap-2 border-dashed border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <Upload size={20} />
                <span className="text-gray-600">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(section.id, e.target.files)}
                  className="hidden"
                />
              </label>

              {section.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {section.images.map((img: any, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden">
                      <img
                        src={typeof img === "string" ? img : URL.createObjectURL(img)}
                        alt="section"
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(section.id, index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add new section */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Add new section"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            className="border rounded-lg p-2 pl-4 w-full text-sm"
          />
          <button
            type="button"
            onClick={() => {
              if (!newSection.trim()) return;
              setSections((prev) => [...prev, { id: Date.now(), name: newSection, images: [] }]);
              setNewSection("");
            }}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditListing;
