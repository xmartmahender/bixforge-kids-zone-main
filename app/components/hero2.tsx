import React from 'react';

const Hero2 = () => {
  // Sample data for trending stories (replace with actual data from the provided websites)
  const trendingStories = [
    {
      category: '0-3 years',
      stories: [
        { title: 'The Little Star', image: 'https://via.placeholder.com/150', link: 'https://www.readthetale.com/' },
        { title: 'Bunny’s Adventure', image: 'https://via.placeholder.com/150', link: 'https://www.freechildrenstories.com/' },
        { title: 'Rainbow Fish', image: 'https://via.placeholder.com/150', link: 'https://storyweaver.org.in/en/' },
      ],
    },
    {
      category: '3-6 years',
      stories: [
        { title: 'The Magic Tree', image: 'https://via.placeholder.com/150', link: 'https://www.getepic.com/' },
        { title: 'Dinosaur Day', image: 'https://via.placeholder.com/150', link: 'https://www.funbrain.com/' },
        { title: 'Pirate’s Treasure', image: 'https://via.placeholder.com/150', link: 'https://www.readthetale.com/' },
      ],
    },
    {
      category: '6-9 years',
      stories: [
        { title: 'Space Explorers', image: 'https://via.placeholder.com/150', link: 'https://www.freechildrenstories.com/' },
        { title: 'The Secret Garden', image: 'https://via.placeholder.com/150', link: 'https://storyweaver.org.in/en/' },
        { title: 'Robot Friends', image: 'https://via.placeholder.com/150', link: 'https://www.getepic.com/' },
      ],
    },
    {
      category: '9-12 years',
      stories: [
        { title: 'Mystery Island', image: 'https://via.placeholder.com/150', link: 'https://www.funbrain.com/' },
        { title: 'The Lost City', image: 'https://via.placeholder.com/150', link: 'https://www.readthetale.com/' },
        { title: 'Time Travelers', image: 'https://via.placeholder.com/150', link: 'https://www.freechildrenstories.com/' },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-900">Trending Stories</h2>
      {trendingStories.map((category, index) => (
        <div key={index} className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">{category.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.stories.map((story, idx) => (
              <a
                key={idx}
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img src={story.image} alt={story.title} className="w-full h-48 object-cover" />
                <p className="p-4 text-lg font-medium text-gray-800 text-center">{story.title}</p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero2;