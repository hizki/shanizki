import React from 'react';
import { Instagram, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [teamImageUrl, setTeamImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const [profileImage, teamImage] = await Promise.all([
          supabase.storage
            .from('assets')
            .getPublicUrl('shany_and_guy.jpeg'),
          supabase.storage
            .from('assets')
            .getPublicUrl('team.jpeg')
        ]);
        
        setImageUrl(profileImage.data.publicUrl);
        setTeamImageUrl(teamImage.data.publicUrl);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchImageUrls();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-900 mb-6 text-center">אוהבים אתכם</h1>
          
          <div className="mb-12 flex justify-center">
            <div className="w-48 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-magenta-500 rounded-full"></div>
          </div>

          {imageUrl && (
            <div className="mb-12">
              <img
                src={imageUrl}
                alt="שני וגיא"
                className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}
          
          <div className="prose prose-lg mx-auto">
            <p className="text-purple-800 mb-6 text-lg">
              היי! אנחנו שני וגיא, זוג שאוהב לבשל, לאכול ולחלוק את האהבה שלנו לאוכל עם אחרים.
              התחלנו את המסע הזה מתוך תשוקה משותפת לטעמים מיוחדים ורצון ליצור משהו שהוא שלנו.
            </p>
            
            <p className="text-purple-800 mb-12 text-lg">
              כל צנצנת שאנחנו מכינים היא סיפור של אהבה - אהבה לאוכל, לתהליך, ובעיקר אהבה אחד לשנייה.
              אנחנו שמחים לחלוק איתכם את התשוקה שלנו ומזמינים אתכם ליצור איתנו קשר.
            </p>

            {teamImageUrl && (
              <div className="mb-12">
                <img
                  src={teamImageUrl}
                  alt="הצוות שלנו"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}

            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-magenta-500 p-1 rounded-2xl">
              <div className="bg-white p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-bold text-purple-900 mb-4 text-center">שמרו על קשר</h2>
                
                <div className="flex items-center justify-center space-x-8 space-x-reverse">
                  <div className="text-center">
                    <p className="font-bold text-purple-900 mb-2">גיא</p>
                    <a
                      href="tel:0544988133"
                      className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
                    >
                      <Phone size={20} className="ml-2" />
                      054-498-8133
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-bold text-purple-900 mb-2">שני</p>
                    <a
                      href="tel:0535322106"
                      className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
                    >
                      <Phone size={20} className="ml-2" />
                      053-532-2106
                    </a>
                  </div>
                </div>

                <div className="flex justify-center mt-6 pt-6 border-t border-purple-100">
                  <a
                    href="https://www.instagram.com/shanagin?igsh=MTgwOG9scWo1emhlZA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-800 transition-colors"
                  >
                    <Instagram size={20} className="ml-2" />
                    עקבו אחרינו באינסטגרם
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;