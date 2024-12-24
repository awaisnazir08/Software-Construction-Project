import React, { useState, useEffect } from 'react';
import {
  Users, MessageCircle, Award, Globe, Filter, Search,
  MapPin, Briefcase, Share2, CheckCircle, X, LogOut, UserCircle
} from 'lucide-react';
import io from 'socket.io-client';
import Footer from '../components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import Header from '../components/Header';
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const NetworkingPage = () => {
  const { logout, account, id } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: '',
    expertise: '',
    mentorOnly: false
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [networkData, setNetworkData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNetwork, setFilteredNetwork] = useState([]);
  const [socket, setSocket] = useState(null);

  // Chat state management
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState({});
  const [newMessage, setNewMessage] = useState('');

  // Fetch network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/network/get?id=${id}`);
        const fetchedData = response.data || [];
        console.log(fetchedData);
        // Combine with initial simulated data if needed
        const combinedData = [
          {
            id: 1,
            name: "Fatima Ahmed",
            role: "Textile Export Entrepreneur",
            location: "Karachi, Sindh",
            expertise: ["Export Marketing", "Textile Design"],
            mentorAvailable: true,
            connections: 42,
            verifiedSkills: ["International Trade", "Product Development"]
          },
          // Add other initial data if needed
          ...fetchedData
        ];

        setNetworkData(combinedData);
        setFilteredNetwork(combinedData);
      } catch (error) {
        console.error("Error fetching network data:", error);
        // Set some default data if fetch fails
        setNetworkData([]);
        setFilteredNetwork([]);
      }
    };

    fetchNetworkData();
  }, []);

  // Dynamic filtering logic
  useEffect(() => {
    if (!networkData) return;

    const results = networkData.filter(profile => {
      const matchesSearch =
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !filters.location ||
        profile.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesExpertise = !filters.expertise ||
        profile.expertise.some(exp =>
          exp.toLowerCase().includes(filters.expertise.toLowerCase())
        );

      const matchesMentorStatus = !filters.mentorOnly || profile.mentorAvailable;

      return matchesSearch && matchesLocation && matchesExpertise && matchesMentorStatus;
    });

    setFilteredNetwork(results);
  }, [searchTerm, filters, networkData]);

  // Socket connection
  useEffect(() => {
    if (!account?._id) return;

    // Establish socket connection
    const newSocket = io('http://localhost:8080', {
      query: { userId: account._id }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      // Join user's personal room
      newSocket.emit('join', account._id);
    });

    // Listen for incoming messages
    newSocket.on('receive_message', (messageData) => {
      const { senderId, content } = messageData;

      setChats(prevChats => {
        const senderProfile = networkData.find(p => p.id === senderId);
        return {
          ...prevChats,
          [senderId]: [
            ...(prevChats[senderId] || []),
            {
              id: Date.now(),
              sender: senderProfile ? senderProfile.name : 'Unknown',
              text: content
            }
          ]
        };
      });
    });

    setSocket(newSocket);

    // Cleanup socket on component unmount
    return () => newSocket.close();
  }, [account?._id, networkData]);

  // Function to start a chat
  const startChat = (profileId) => {
    setActiveChatId(profileId);

    if (socket) {
      // Fetch message history
      socket.emit('get_messages', {
        userId: account?._id,
        otherUserId: profileId
      });

      // Listen for message history
      socket.once('message_history', (messages) => {
        // Transform messages to match existing chat format
        const formattedMessages = messages.map(msg => ({
          id: msg._id,
          sender: msg.sender === account?._id ? 'You' :
            networkData.find(p => p.id === msg.sender)?.name || 'Unknown',
          text: msg.content
        }));

        setChats(prevChats => ({
          ...prevChats,
          [profileId]: formattedMessages || []
        }));
      });

      // Initialize empty chat if no history exists
      if (!chats[profileId]) {
        setChats(prevChats => ({
          ...prevChats,
          [profileId]: []
        }));
      }
    }
  };

  // Function to send a message
  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !activeChatId) return;

    // Emit message through socket
    socket.emit('send_message', {
      senderId: account?._id,
      receiverId: activeChatId,
      content: newMessage
    });

    // Optimistically update chat
    setChats(prevChats => ({
      ...prevChats,
      [activeChatId]: [
        ...(prevChats[activeChatId] || []),
        {
          id: Date.now(),
          sender: 'You',
          text: newMessage
        }
      ]
    }));


  };

  // Close chat window
  const closeChat = () => {
    setActiveChatId(null);
  };

  // Rest of the component remains the same as in the original code...
  // (Include the rest of the render method from the original code)

  return (
    <>
    <div className="min-h-screen bg-gray-50 font-noto-nastaliq relative">
      <Header/>

      <main className="container mx-auto py-12 px-4">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white shadow-md rounded-lg p-6">
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search entrepreneurs, skills, locations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setFilters(prev => ({...prev, mentorOnly: !prev.mentorOnly}))}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                filters.mentorOnly
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Award size={20} />
              <span>Mentors Only</span>
            </button>
          </div>
        </div>

        {/* Networking Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredNetwork.map(profile => (
            <div
              key={profile.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    {capitalizeFirstLetter(profile.name)}
                    {profile.mentorAvailable && (
                      <CheckCircle
                        size={20}
                        className="ml-2 text-green-500"
                        title="Mentor Available"
                      />
                    )}
                  </h2>
                  <p className="text-gray-600">{profile.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startChat(profile.id)}
                    className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200"
                  >
                    <MessageCircle size={20} />
                  </button>
                  <button className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin size={20} className="mr-2 text-indigo-600" />
                  <span>{profile.location}</span>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Verified Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.verifiedSkills.map(skill => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNetwork.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-xl">
              No entrepreneurs found matching your search criteria.
            </p>
          </div>
        )}
      </main>

      {/* Chat Window */}
      {activeChatId && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border">
          <div className="bg-indigo-700 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-bold">
              {networkData.find(p => p.id === activeChatId).name}
            </h3>
            <button onClick={closeChat} className="hover:bg-indigo-600 p-1 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 h-80 overflow-y-auto">
            {chats[activeChatId].map(message => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.sender === 'You'
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                <span className={`
                  inline-block px-4 py-2 rounded-xl max-w-[80%]
                  ${
                    message.sender === 'You'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }
                `}>
                  {message.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};
export default NetworkingPage;