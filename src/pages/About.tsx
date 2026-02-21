import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-900 mb-6 text-center">About SHANIZKI</h1>
          
          <div className="mb-12 flex justify-center">
            <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-magenta-500 rounded-full"></div>
          </div>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-purple-800 mb-6">
              SHANIZKI was born from a passion for color, geometry, and the beauty of visual expression. 
              Our journey began in 2022 when our founder started experimenting with geometric patterns 
              inspired by nature, architecture, and the vibrant tapestry of everyday life.
            </p>
            
            <p className="text-purple-800 mb-6">
              What started as a creative outlet quickly evolved into a distinctive artistic style 
              that combines bold colors, precise geometric forms, and playful arrangements. Each 
              design tells a story and creates an emotional connection that brightens spaces and lives.
            </p>
            
            <h2 className="text-2xl font-bold text-purple-900 mt-10 mb-4">Our Philosophy</h2>
            
            <p className="text-purple-800 mb-6">
              We believe that art should be accessible, joyful, and present in everyday life. Our 
              designs are created with the intention to bring color and positive energy into homes 
              and spaces, transforming the ordinary into something extraordinary.
            </p>
            
            <div className="my-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-magenta-500 p-1 rounded-2xl">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">Our Creative Process</h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center mr-3 font-bold">1</span>
                    <div>
                      <h4 className="font-bold text-purple-800">Inspiration</h4>
                      <p className="text-purple-700">We draw inspiration from everyday patterns, cultural symbols, and natural forms.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center mr-3 font-bold">2</span>
                    <div>
                      <h4 className="font-bold text-purple-800">Sketching</h4>
                      <p className="text-purple-700">Initial ideas are sketched by hand to capture the essence of the concept.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center mr-3 font-bold">3</span>
                    <div>
                      <h4 className="font-bold text-purple-800">Digital Development</h4>
                      <p className="text-purple-700">Sketches are transformed into digital designs, where we refine shapes and experiment with color.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center mr-3 font-bold">4</span>
                    <div>
                      <h4 className="font-bold text-purple-800">Production</h4>
                      <p className="text-purple-700">The final designs are carefully produced as physical objects or digital creations.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-purple-900 mt-10 mb-4">Our Vision</h2>
            
            <p className="text-purple-800 mb-6">
              We aim to continue exploring the infinite possibilities of geometric art and color theory,
              pushing boundaries and creating designs that resonate with people around the world. Our goal
              is to build a community that appreciates and celebrates the beauty of abstract geometric expression.
            </p>
            
            <p className="text-purple-800 mb-6">
              Thank you for visiting our website and exploring our creations. We hope our designs bring as 
              much joy to your life as they do to ours in creating them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;