import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed via npm install axios
import {
  User,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
const ProfileSetupPage = () => {
  const [profile, setProfile] = useState({
    username: "",
    gender: "",
    age: "",
    location: "",
    description: "",
    skills: [],
    mentorAvailable: false,
  });
  const { account,token, id } = useAuth();

  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        skills: [...prevProfile.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      skills: prevProfile.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
profile.id= id;
      // Replace URL with your backend API endpoint
      const response = await axios.put("http://localhost:8080/setup/", profile);
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq">
      {/* <header className="bg-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold flex items-center">
            <User className="mr-3" /> امید | Profile Setup
          </h1>
        </div>
      </header> */}

      <Header/>

      <main className="container mx-auto py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Edit className="mr-3 text-indigo-600" />
            Set Up Your Profile
          </h2>

          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Gender and Age Row */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Gender Selection */}
            <div>
              <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer Not to Say</option>
              </select>
            </div>

            {/* Age Input */}
            <div>
              <label htmlFor="age" className="block text-gray-700 font-semibold mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={profile.age}
                onChange={handleInputChange}
                min="18"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your age"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">
              Location
            </label>
            <div className="flex items-center">
              <MapPin className="mr-2 text-indigo-600" />
              <input
                type="text"
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                required
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="City, Province"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
              Brief Description
            </label>
            <textarea
              id="description"
              name="description"
              value={profile.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us a bit about yourself, your professional journey, and aspirations"
            ></textarea>
          </div>

          {/* Skills Management */}
          <div className="mb-4">
            <label htmlFor="skills" className="block text-gray-700 font-semibold mb-2">
              Professional Skills
            </label>
            <div className="flex">
              <input
                type="text"
                id="skillInput"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a skill (Press Enter to add)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            {/* Displayed Skills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.skills.map(skill => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Mentor Availability */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="mentorAvailable"
                checked={profile.mentorAvailable}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                I'm interested in being a mentor
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
          >
            <Save className="mr-2" />
            Save Profile
          </button>
        </form>
      </main>
    </div>
    <Footer />
    </>
  );
};

export default ProfileSetupPage;