import React from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';

const RecipesPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-900 mb-8 text-center">מתכונים</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={recipe.heroImage.src}
                  alt={recipe.heroImage.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-purple-900 mb-2">{recipe.title}</h2>
                <p className="text-purple-700 line-clamp-3">{recipe.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
