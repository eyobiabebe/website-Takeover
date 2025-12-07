// src/pages/AddLeaseListing.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import DatePicker from "@/components/DatePicker";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import LocationPicker from "@/components/LocationPicker";


interface Section {
  id: number;
  name: string;
  images: File[];
}

const carSections = ["Exterior", "Interior", "Engine", "Wheels"];
const apartmentSections = ["Living Room", "Kitchen", "Bedroom", "Bathroom"];

const AddListing: React.FC = () => {
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);



  const handleSelectLocation = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    console.log("location handling ..");

    try {
      const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=45fee84be7024e7283835fc1606f9aad`)

      const data = await res.json();

      console.log("readable address: ", data.features[0].properties.formatted);
      setFormData((prev) => ({
        ...prev,
        lat: String(lat),
        lng: String(lng),
        location: data.features[0].properties.formatted || "",
      }));

    } catch (error) {
      console.log(error)
    }
  };

  const [formData, setFormData] = useState({
    userId: String(userId),
    title: "",
    lat: location ? String(location.lat) : "",
    lng: location ? String(location.lng) : "",
    location: location ? "" : "",
    monthlyPrice: "",
    description: "",
    type: 'apartment',
    startDate: new Date(),
    endDate: new Date(),
    incentive: '',

    //for cars
    currentMiles: '',
    remainingMiles: '',
    milesPerMonth: '',
    saleId: '',
    vin_no: '',
    leasingCompany: {
      name: '',
      email: '',
    },

    //for apartments
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    landlordInfo: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const [sections, setSections] = useState<Section[]>(
    apartmentSections.map((name, idx) => ({
      id: idx + 1,
      name,
      images: [],
    }))
  );
  const [step, setStep] = useState(1); // 1 = form, 2 = payment
  const [listingId, setListingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const navigate = useNavigate();

  
    


  useEffect(() => {
    setSections(
      formData.type === 'apartment'
        ? apartmentSections.map((name, idx) => ({
          id: idx + 1,
          name,
          images: [],
        }))
        : carSections.map((name, idx) => ({
          id: idx + 1,
          name,
          images: [],
        }))
    );
  }, [formData.type]);

  const [newSection, setNewSection] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("landlordInfo.")) {
      const key = name.split(".")[1] as keyof typeof formData.landlordInfo;
      setFormData((prev) => ({
        ...prev,
        landlordInfo: {
          ...prev.landlordInfo,
          [key]: value,
        },
      }));
    } else if (name.startsWith("leasingCompany.")) {
      const key = name.split(".")[1] as keyof typeof formData.leasingCompany;
      setFormData((prev) => ({
        ...prev,
        leasingCompany: {
          ...prev.leasingCompany,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form select change
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined, isStartDate: boolean) => {
    if (!date) return;

    const today = startOfDay(new Date()); // ensures time is ignored

    if (isStartDate && isAfter(date, today)) {
      toast.error("Start date must be before today!");
      return;
    }

    if (!isStartDate && isBefore(date, today)) {
      toast.error("End date must be after today!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [isStartDate ? "startDate" : "endDate"]: date,
    }));
  };

  // Handle image upload
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

  const handleAddSection = () => {
    if (newSection.trim() === "") return;
    setSections((prev) => [
      ...prev,
      { id: Date.now(), name: newSection.trim(), images: [] },
    ]);
    setNewSection("");
  };

  const handleRemoveSection = (id: number) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleRemoveImage = (sectionId: number, index: number) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            images: section.images.filter((_, i) => i !== index),
          }
          : section
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);

    const form = new FormData();
    
    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        // for landlordInfo or leasingCompany
        Object.entries(value).forEach(([subKey, subValue]) => {
          form.append(`${key}[${subKey}]`, subValue as string);
        });
      } else {
        form.append(key, value as string);
      }
    });

    form.append("startDate", formData.startDate as any);
    form.append("endDate", formData.endDate as any);

    // Append images by section
    sections.forEach((section) => {
      section.images.forEach((file) => {
        form.append(`images[${section.name}]`, file);
      });
    });

    try {
      const res = await axios.post('/api/listings', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // toast.success('Listing added successfuly!');
      console.log(res.data);

      setListingId(res.data.id);
      setLoading2(false);
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong 😬');
    }
  };

  const saveDraft = async (e: React.FormEvent) => {
    setLoading3(true);
    e.preventDefault();

    const form = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        // for landlordInfo or leasingCompany
        Object.entries(value).forEach(([subKey, subValue]) => {
          form.append(`${key}[${subKey}]`, subValue as string);
        });
      } else {
        form.append(key, value as string);
      }
    });

    // Append images by section
    sections.forEach((section) => {
      section.images.forEach((file) => {
        form.append(`images[${section.name}]`, file);
      });
    });

    try {
      const res = await axios.post('/api/listings/draft', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // toast.success('Listing added successfuly!');
      console.log(res.data);

      // Reset form and images
      setFormData({
        userId: String(userId),
        title: "",
        lat: "",
        lng: "",
        location: "",
        monthlyPrice: "",
        description: "",
        type: 'apartment',
        startDate: new Date(),
        endDate: new Date(),
        incentive: '',

        //for cars
        currentMiles: '',
        remainingMiles: '',
        milesPerMonth: '',
        saleId: '',
        vin_no: '',
        leasingCompany: {
          name: '',
          email: '',
        },

        //for apartments
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        landlordInfo: {
          name: '',
          phone: '',
          email: '',
        },
      });

      setSections(
        apartmentSections.map((name, idx) => ({
          id: idx + 1,
          name,
          images: [],
        }))
      )
      setLoading3(false);
      toast.success('Draft saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong 😬');
    }
  };

  // ✅ Animations for step transitions
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // ✅ Step 2: Handle payment
  const handlePayment = async () => {
    if (!listingId) return toast.error("Missing listing ID.");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/payments/create-listing-checkout", {
        listingId,
        price: 10, // fixed or dynamic fee
        title: 'Listing Fee',
        type: 'listing_fee',
      });

      window.location.href = data.url; // redirect to Stripe
    } catch (err) {
      toast.error("Payment initialization failed.");
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('./assets/white-bg3.jpg')] bg-cover bg-center min-h-screen pt-12">
      
      {/* ===== Progress Indicator ===== */}
      <div className="flex items-center justify-center mb-3 relative pt-20">
        <div className="flex items-center w-full max-w-md">
          {/* Step 1 */}
          <div className="flex-1 relative">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                }`}
            >
              1
            </div>
            <p className="text-center mt-2 text-sm font-medium">
              Listing Details
            </p>
          </div>

          {/* Line between steps */}
          <div
            className={`flex-1 h-1 mx-2 rounded ${step === 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
          ></div>

          {/* Step 2 */}
          <div className="flex-1 relative">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                }`}
            >
              2
            </div>
            <p className="text-center mt-2 text-sm font-medium">
              Payment & Confirm
            </p>
          </div>
        </div>
      </div>
      <a href=""></a>

      {step === 2 && listingId ? (
        <motion.div
          key="payment-step"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <div className="text-center space-y-4 pt-10">

            <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Review & Confirm
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              Listing Fee Payment
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              To continue with your listing, a one-time <b>$10</b> listing fee
              is required. Secure payments are processed via{" "}
              <span className="text-blue-600 font-semibold">Stripe</span>.
            </p>
            <p className="text-gray-600">
              Listing: <strong>{formData.title}</strong>
            </p>
            <p className="text-gray-600">
              Fee: <strong>$10.00</strong>
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
              >
                ← Back
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                {loading ? "Processing..." : "Pay & Publish"}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-5xl mx-auto p-6 ">
          <h1 className="mb-6  text-xl font-bold tracking-tight bg-gradient-to-l from-[#1a78f3] via-[#f3951a] to-[#11b159] bg-clip-text text-transparent md:text-2xl">Add New Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Lease Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 pb-1 pl-1">Type</p>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  className="border rounded-lg p-2 w-full"
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div>
                <p className="text-gray-400 pb-1 pl-1">Title</p>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>

              <div>
                <p className="text-gray-400 pb-1 pl-1">Lease Start Date</p>
                <DatePicker
                  selectedDate={formData.startDate}
                  onDateChange={(date) => handleDateSelect(date, true)}
                  placeholder="Select start date"
                />
              </div>

              <div>
                <p className="text-gray-400 pb-1 pl-1">Lease End Date</p>
                <DatePicker
                  selectedDate={formData.endDate}
                  onDateChange={(date) => handleDateSelect(date, false)}
                  placeholder="Select end date"
                />
              </div>

              {/* <div>
                <p className="text-gray-400 pb-1 pl-1">Term Left</p>
                <input
                  type="number"
                  name="termLeft"
                  placeholder="Term Left (Remaining months)"
                  value={formData.termLeft}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div> */}

              <div>
                <p className="text-gray-400 pb-1 pl-1">Monthly Price</p>
                <input
                  type="number"
                  name="monthlyPrice"
                  placeholder="Monthly Price"
                  value={formData.monthlyPrice}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>

              <div>
                <p className="text-gray-400 pb-1 pl-1">Incentive amount you offer</p>
                <input
                  type="number"
                  name="incentive"
                  placeholder="Incentive amount you offer"
                  value={formData.incentive}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>


              {formData.type === 'car' ? (
                <>
                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Sale ID</p>
                    <input
                      type="text"
                      name="saleId"
                      placeholder="Sale ID"
                      value={formData.saleId}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Miles Per Month</p>
                    <input
                      type="text"
                      name="milesPerMonth"
                      placeholder="Miles Per Month"
                      value={formData.milesPerMonth}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Current Miles</p>
                    <input
                      type="text"
                      name="currentMiles"
                      placeholder="Current Miles"
                      value={formData.currentMiles}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Remaining Miles</p>
                    <input
                      type="text"
                      name="remainingMiles"
                      placeholder="Remaining Miles"
                      value={formData.remainingMiles}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">VIN Number</p>
                    <input
                      type="text"
                      name="vin_no"
                      placeholder="VIN Number"
                      value={formData.vin_no}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                </>
              ) : (
                <>
                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Bedrooms</p>
                    <input
                      type="text"
                      name="bedrooms"
                      placeholder="Bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Bathrooms</p>
                    <input
                      type="text"
                      name="bathrooms"
                      placeholder="Bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Square Footage</p>
                    <input
                      type="text"
                      name="sqft"
                      placeholder="Square Footage"
                      value={formData.sqft}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="relative z-0">
              <p className="text-gray-400 pb-1 pl-1">Location</p>
              {/* <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="border rounded-lg p-2 w-full"
                  required
                /> */}
              <LocationPicker onSelectLocation={handleSelectLocation} />

              {location && (
                <p className="text-sm text-gray-600">
                  Selected Location: {location.lat.toFixed(5)}, {location.lng.toFixed(5)} <br />
                  Address: {formData.location}
                </p>

              )}
            </div>
            {formData.type === 'apartment' ? (
              <div className="flex flex-col gap-4 text-sm p-4 border rounded bg-slate-100/80">
                <h1 className="text-lg font-semibold italic">Landlord Information</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Landlord Name</p>
                    <input
                      type="text"
                      name="landlordInfo.name"
                      placeholder="Landlord Name"
                      value={formData.landlordInfo.name}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Landlord Email</p>
                    <input
                      type="text"
                      name="landlordInfo.email"
                      placeholder="Landlord email"
                      value={formData.landlordInfo.email}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Landlord Phone</p>
                    <input
                      type="text"
                      name="landlordInfo.phone"
                      placeholder="Landlord Phone"
                      value={formData.landlordInfo.phone}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                </div>
              </div>

            ) : (
              <div className="flex flex-col gap-4 text-sm p-4 border rounded bg-slate-100/80">
                <h1 className="text-lg font-semibold italic">Leasing Company Information</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Leasing Company Name</p>
                    <input
                      type="text"
                      name="leasingCompany.name"
                      placeholder="Leasing Company Name"
                      value={formData.leasingCompany.name}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>

                  <div>
                    <p className="text-gray-400 pb-1 pl-1">Leasing Company Email</p>
                    <input
                      type="text"
                      name="leasingCompany.email"
                      placeholder="Leasing Company Email"
                      value={formData.leasingCompany.email}
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="text-gray-400 pb-1 pl-1 italic">Description</p>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="border rounded-lg p-2 w-full text-sm"
              />
            </div>




            {/* Image Sections */}
            <h1 className="text-lg font-bold">Upload {formData.type === 'apartment' ? 'Apartment' : 'Car'} Images</h1>
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
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text- font-semibold">{section.name}</h2>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(section.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Upload Images */}
                  <label className="flex items-center gap-2 border-dashed border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <Upload size={20} />
                    <span className="text-gray-600">Upload Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleImageUpload(section.id, e.target.files)
                      }
                      className="hidden"
                    />
                  </label>

                  {/* Preview */}
                  {section.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {section.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative group border rounded-lg overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt={img.name}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImage(section.id, index)
                            }
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

            {/* Add Section Input */}
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder={`Add new ${formData.type === 'apartment' ? 'Apartment' : 'Car'} Feature`}
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="border rounded-lg p-2 pl-4 w-full text-sm"
              />
              <button
                type="button"
                onClick={handleAddSection}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                onClick={saveDraft}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                disabled={loading2 || loading3}
              >
                {loading3 ? 'Saving Draft...' : 'Save Draft'}
              </button>
              <button
                type="submit"
                className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                disabled={loading2 || loading3}
              >
                {loading2 ? 'Submitting...' : 'Submit Listing'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default AddListing;
