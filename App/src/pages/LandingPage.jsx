// LandingPage.jsx
import React, { useEffect } from "react";

const LandingPage = (props) => {
  const {update} = props

  useEffect(()=>{
    update(false)
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-opacity-90 bg-blue-700 sticky top-0">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:text-blue-300">Home</a>
          <a href="#features" className="hover:text-blue-300">Features</a>
          <a href="#pricing" className="hover:text-blue-300">Pricing</a>
          <a href="#about" className="hover:text-blue-300">About Us</a>
        </nav>
        <a
          href="/login"
          className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          Get Started
        </a>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20">
        <h1 className="text-4xl font-bold mb-6">
          Manage Your Expenses Effortlessly
        </h1>
        <p className="text-lg mb-8">
          Track, analyze, and optimize your spending all in one place.
        </p>
        <a
          href="/signup"
          className="bg-blue-800 px-6 py-3 rounded-lg text-white hover:bg-blue-900"
        >
          Sign Up Now
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white text-blue-700">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Expense Tracking</h3>
            <p>Record and categorize your daily expenses with ease.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Monthly Insights</h3>
            <p>Analyze your spending patterns over time.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Secure Storage</h3>
            <p>All your data is stored securely with top-notch encryption.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
