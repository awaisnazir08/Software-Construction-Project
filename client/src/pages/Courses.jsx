import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Star,
  DollarSign,
  Clock,
  User,
  Book,
  Bookmark,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// Expanded and More Diverse Course Catalog


const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState('all');
  const [skillLevel, setSkillLevel] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState('rating');
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);


  // Static duration list
  const durations = ["1week", "2weeks", "1month", "2months", "all"];

  // Static skill levels list
  const skillLevels = ["beginner", "intermediate", "advanced", "all"];

  // const placeholderImage = 'https://s3-alpha-sig.figma.com/img/a25d/266a/dc3c77058f886344ea0e6d70f086a23e?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AnmkLf5rwu4a-PaaQD0dni3iadBWjtzspkWzaNdzbDCJtB-dKcUmMRo53BXKa0d81jJK5h5EwIlxaIB-7EVkuUrwyhuQ0mdjiiAoAaD~jPh6A44NDyJNFDSf0rjOcLTLH1Uke2K7zyep2FhduKmeuLdtkGbZknSDTSZ1FjhJq-yrdkE2AwR~WmhvmGsUypn-Botj7dw0z5UYRU386NPdONesgLgg6QQrvNVtW6qJbUlxNNFVQrHy6Gy1F-FFE5iTBgHKKrBC9h35a4kE9M5s50yr9ShCUrGDaTCEE2~-HalSQhkTJvpnUh3E6~K1oWT3xDK2uTh-HrWI1-W-R1sgxQ__'; // Dummy image URL

  // Sophisticated Filtering Setup



  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/sell/course'); // Update the API endpoint for courses
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Courses Data: ", data);
        const fetchedCourses = Array.isArray(data.courses) ? data.courses.map(course => ({
          ...course,
        })) : [];
        setAllCourses(fetchedCourses);
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);


  useEffect(() => {
    let filteredCourses = allCourses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDuration =
        duration === 'all' || course.duration === duration;

      const matchesSkillLevel =
        skillLevel === 'all' || course.skillLevel === skillLevel;

      const matchesPrice =
        course.price >= priceRange[0] && course.price <= priceRange[1];

      return matchesSearch && matchesDuration && matchesSkillLevel && matchesPrice;

    });

    // Enhanced Sorting Logic
    filteredCourses.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

    setCourses(filteredCourses);
  }, [searchTerm, duration, skillLevel, priceRange, sortBy, allCourses]);

  const renderCourse = (course, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-indigo-700 group-hover:text-indigo-900 transition">
          {course.title}
        </h3>
        
      </div>

      <p className="text-gray-600 text-sm mb-4">{course.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <User size={16} className="text-indigo-600" />
          {/* <span className="text-sm">{course.instructor}</span> */}
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-green-600" />
          <span className="text-sm">{course.duration}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign size={16} className="text-blue-600" />
          <span className="text-sm">{course.price} PKR</span>
        </div>
        
      </div>

      

      <div className="flex space-x-2">
        
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
          {course.skillLevel}
        </span>
      </div>

      <button className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center">
        <BookOpen size={16} className="mr-2" onClick={()=>navigate("/enroll")} />
        Enroll Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq relative">

      <Header/>
      <div className="grid md:grid-cols-4 gap-6 py-12 px-4">
        {/* Advanced Sidebar Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="font-bold text-xl mb-4 flex items-center">
            <Filter size={20} className="mr-2" /> Course Filters
          </h2>

        

          <div className="mb-4">
            <label className="block mb-2">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {durations.map((dur) => (
                <option key={dur} value={dur}>
                  {dur.charAt(0).toUpperCase() + dur.slice(1)} {/* Capitalize the first letter */}
                </option>
              ))}
            </select>
          </div>


          {/* Skill Level Dropdown */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Skill Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)} {/* Capitalize the first letter */}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Inputs */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price Range (PKR)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div>
            <label className="block mb-2 font-semibold">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="rating">Highest Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="students">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Course Listings */}
        <div className="col-span-3 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border rounded-full shadow-sm"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.length > 0 ? (
              courses.map(renderCourse)
            ) : (
              <div className="col-span-2 text-center text-gray-600 py-8">
                No courses found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;