import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { getRecipe } from '../data/recipes';
import type { RecipeImage } from '../types';

const Figure: React.FC<{ image: RecipeImage; className?: string }> = ({ image, className }) => (
  <figure className={className}>
    <img
      src={image.src}
      alt={image.alt}
      className="w-full rounded-xl border border-purple-100"
      loading="lazy"
    />
    {image.caption && (
      <figcaption className="text-sm text-purple-600 text-center mt-2">{image.caption}</figcaption>
    )}
  </figure>
);

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = id ? getRecipe(id) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!recipe) {
    return (
      <div className="min-h-screen pt-20 px-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">מתכון לא נמצא</h1>
        <Link to="/recipes" className="text-purple-700 hover:text-purple-800 underline">
          לכל המתכונים
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold mb-6 transition-colors"
        >
          <ArrowRight size={18} />
          לכל המתכונים
        </Link>

        {/* Hero */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8 pb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">{recipe.title}</h1>
            <p className="text-lg text-purple-700 pb-6 border-b border-purple-100">
              {recipe.description}
            </p>
          </div>
          <div className="p-8 pt-6">
            <Figure image={recipe.heroImage} />
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">מקורות</h2>
          <div className="space-y-4 text-purple-800 [&_a]:text-purple-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-purple-900">
            {recipe.sources.map((source, index) => (
              <p key={index}>{source}</p>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-2">לוח זמנים מומלץ</h2>
          <p className="text-purple-700 mb-6">{recipe.scheduleIntro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.schedule.map((phase) => (
              <div key={phase.title} className="bg-purple-50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-magenta-500 mb-3">{phase.title}</h3>
                <ul className="space-y-2 list-disc pr-4 text-purple-800 [&_strong]:text-purple-900">
                  {phase.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">רכיבים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipe.ingredientGroups.map((group) => (
              <div key={group.title} className="bg-purple-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-purple-900 mb-3">{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline justify-between gap-3 py-1.5 border-b border-purple-100 last:border-b-0"
                    >
                      <span className="text-purple-800">{item.name}</span>
                      <span className="font-bold text-purple-900 whitespace-nowrap">
                        {item.amount}
                      </span>
                    </li>
                  ))}
                </ul>
                {group.note && <p className="text-sm text-purple-600 mt-3">{group.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Method */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">אופן ההכנה</h2>
          <div className="space-y-10">
            {recipe.sections.map((section) => (
              <section key={section.title}>
                <h3 className="text-xl font-bold text-purple-900 mb-1">{section.title}</h3>
                {section.timeLabel && (
                  <p className="text-sm font-bold text-magenta-500 mb-4">{section.timeLabel}</p>
                )}
                <ol className="space-y-4">
                  {section.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-700 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 text-purple-800 [&_strong]:text-purple-900">
                        {step.text}
                        {step.image && <Figure image={step.image} className="mt-4" />}
                      </div>
                    </li>
                  ))}
                </ol>
                {section.warning && (
                  <div className="mt-6 bg-orange-400/10 border border-orange-400/40 border-r-4 border-r-orange-400 rounded-xl p-5">
                    <p className="flex items-center gap-2 font-bold text-purple-900 mb-3">
                      <AlertTriangle size={18} className="text-orange-400 flex-shrink-0" />
                      {section.warning.title}
                    </p>
                    <div className="space-y-3 text-purple-800 [&_strong]:text-purple-900">
                      {section.warning.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                    {section.warning.image && (
                      <Figure image={section.warning.image} className="mt-4" />
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
          {recipe.finalImage && <Figure image={recipe.finalImage} className="mt-10" />}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
