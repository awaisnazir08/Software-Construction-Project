// import React, { useState } from 'react';
// import {
//   Book,
//   CreditCard,
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   CheckCircle,
//   DollarSign
// } from 'lucide-react';

// const CourseEnrollmentPage = ({ course }) => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     paymentId: ''
//   });

//   const [paymentVerification, setPaymentVerification] = useState({
//     status: null,
//     message: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handlePersonalInfoSubmit = (e) => {
//     e.preventDefault();
//     setStep(2);
//   };

//   const verifyPayment = (e) => {
//     e.preventDefault();
//     // Simulated payment verification logic
//     if (formData.paymentId.trim().length === 10) {
//       setPaymentVerification({
//         status: true,
//         message: 'Payment verified successfully!'
//       });
//       setTimeout(() => setStep(3), 1500);
//     } else {
//       setPaymentVerification({
//         status: false,
//         message: 'Invalid Payment ID. Please check and try again.'
//       });
//     }
//   };

//   const renderPersonalInfoStep = () => (
//     <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
//       <h2 className="text-2xl font-bold text-indigo-700 mb-4">Personal Information</h2>

//       <div className="mb-4">
//         <label className="block mb-2 flex items-center">
//           <User size={16} className="mr-2 text-indigo-600" />
//           Full Name
//         </label>
//         <input
//           type="text"
//           name="fullName"
//           value={formData.fullName}
//           onChange={handleInputChange}
//           required
//           className="w-full p-2 border rounded"
//           placeholder="Enter your full name"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-2 flex items-center">
//           <Mail size={16} className="mr-2 text-indigo-600" />
//           Email
//         </label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           required
//           className="w-full p-2 border rounded"
//           placeholder="Enter your email"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-2 flex items-center">
//           <Phone size={16} className="mr-2 text-indigo-600" />
//           Phone Number
//         </label>
//         <input
//           type="tel"
//           name="phone"
//           value={formData.phone}
//           onChange={handleInputChange}
//           required
//           className="w-full p-2 border rounded"
//           placeholder="Enter your phone number"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-2 flex items-center">
//           <MapPin size={16} className="mr-2 text-indigo-600" />
//           Address
//         </label>
//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleInputChange}
//           required
//           className="w-full p-2 border rounded"
//           placeholder="Enter your address"
//           rows={3}
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center"
//       >
//         Continue to Payment
//       </button>
//     </form>
//   );

//   const renderPaymentStep = () => (
//     <form onSubmit={verifyPayment} className="space-y-4">
//       <h2 className="text-2xl font-bold text-indigo-700 mb-4">Payment Verification</h2>

//       <div className="bg-green-100 p-4 rounded-xl mb-4">
//         <p className="text-green-700 flex items-center">
//           <DollarSign size={20} className="mr-2" />
//           Please make a payment of{' '}
//           <span className="font-bold text-green-900 ml-1">5000 PKR</span>
//         </p>
//       </div>

//       <div className="mb-4">
//         <label className="block mb-2 flex items-center">
//           <CreditCard size={16} className="mr-2 text-indigo-600" />
//           Payment Transaction ID
//         </label>
//         <input
//           type="text"
//           name="paymentId"
//           value={formData.paymentId}
//           onChange={handleInputChange}
//           required
//           className="w-full p-2 border rounded"
//           placeholder="Enter 10-digit payment ID"
//           maxLength={10}
//         />
//       </div>

//       {paymentVerification.status !== null && (
//         <div className={`p-3 rounded-xl text-center mb-4 ${
//           paymentVerification.status
//             ? 'bg-green-100 text-green-700'
//             : 'bg-red-100 text-red-700'
//         }`}>
//           {paymentVerification.message}
//         </div>
//       )}

//       <button
//         type="submit"
//         className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center"
//       >
//         Verify Payment
//       </button>
//     </form>
//   );

//   const renderConfirmationStep = () => (
//     <div className="text-center">
//       <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
//       <h2 className="text-2xl font-bold text-indigo-700 mb-4">Enrollment Successful!</h2>
//       <p className="text-gray-600 mb-4">
//         You have been successfully enrolled in the course.
//         We'll send further details to your email.
//       </p>
//       <button
//         onClick={() => window.location.href = '/courses'}
//         className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center"
//       >
//         Back to Courses
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 font-noto-nastaliq relative">
//       <header className="bg-indigo-700 text-white p-6 shadow-md">
//         <div className="container mx-auto">
//           <h1 className="text-2xl font-bold flex items-center">
//             <Book className="mr-3" /> امید | Course Enrollment
//           </h1>
//         </div>
//       </header>

//       <div className="grid md:grid-cols-4 gap-6 py-12 px-4">
//         {/* Sidebar with Course Details */}
//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <h2 className="font-bold text-xl mb-4 flex items-center">
//             <CreditCard size={20} className="mr-2" /> Course Details
//           </h2>

//           <div className="space-y-3">
//             <div className="flex items-center space-x-2">
//               <Book size={16} className="text-indigo-600" />
//               <span className="text-sm">Web Development Bootcamp</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <DollarSign size={16} className="text-blue-600" />
//               <span className="text-sm">5000 PKR</span>
//             </div>

//             {/* Enrollment Progress Indicator */}
//             <div className="flex space-x-2 mt-4">
//               {[1, 2, 3].map((item) => (
//                 <span
//                   key={item}
//                   className={`h-2 w-2 rounded-full ${
//                     step >= item ? 'bg-indigo-600' : 'bg-gray-300'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Main Enrollment Area */}
//         <div className="col-span-3 bg-white rounded-xl shadow-md p-6">
//           {step === 1 && renderPersonalInfoStep()}
//           {step === 2 && renderPaymentStep()}
//           {step === 3 && renderConfirmationStep()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseEnrollmentPage;