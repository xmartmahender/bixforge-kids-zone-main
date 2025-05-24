"use client"; // Mark this component as a Client Component

import React from 'react';
import { motion } from 'framer-motion'; // Import framer-motion

const Hero1 = () => {
  // Animation variants for text and buttons
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between child animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  // Star animation variants
  const starVariants = {
    twinkle: {
      opacity: [0, 1, 0], // Twinkle effect
      scale: [1, 1.1, 1], // Slight scaling
      transition: {
        duration: 2, // Animation duration
        repeat: Infinity, // Repeat infinitely
        repeatType: "mirror" as const, // Correct type for repeatType
      },
    },
    float: {
      y: [0, -10, 0], // Floating up and down
      x: [0, 5, 0], // Floating left and right
      transition: {
        duration: 4, // Animation duration
        repeat: Infinity, // Repeat infinitely
        repeatType: "mirror" as const, // Correct type for repeatType
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-100 to-indigo-100 py-8 overflow-hidden min-h-[34vh] flex items-center">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src="https://www.abcbooksmarket.com/image/cache/catalog/Books/Shanti/Shanti25-500x500.jpg"
          alt="Kids Reading"
          className="w-full h-full object-cover opacity-20" // Reduced opacity
        />
        {/* Subtle Overlay to Improve Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50"></div>
      </motion.div>

      {/* Animated Stars */}
      {[...Array(15)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          variants={starVariants} // Pass the variants object
          animate={["twinkle", "float"]} // Animate both twinkle and float
        />
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10">
        {/* Text Content */}
        <motion.div
          className="w-full max-w-2xl space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900"
            variants={itemVariants}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Reading for all!
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-800"
            variants={itemVariants}
            style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)' }}
          >
            Discover the world of books and stories with Epic. Perfect for educators, families, and kids alike.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center"
            variants={itemVariants}
          >
            <motion.a
              href="/educators"
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              whileHover={{ scale: 1.1 }} // Increased hover effect
              whileTap={{ scale: 0.95 }} // Button click animation
            >
              For Educators
            </motion.a>
            <motion.a
              href="/families"
              className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              whileHover={{ scale: 1.1 }} // Increased hover effect
              whileTap={{ scale: 0.95 }} // Button click animation
            >
              For Families
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero1;