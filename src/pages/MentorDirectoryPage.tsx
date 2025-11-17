import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMentors, genres } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Users, ArrowLeft, MapPin, Award, Send } from 'lucide-react';
import { toast } from 'sonner';

const cities = ['All Cities', 'Buea', 'Douala', 'Yaounde', 'Bamenda'];

export default function MentorDirectoryPage() {
  const navigate = useNavigate();
  const [filterCity, setFilterCity] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  const filteredMentors = mockMentors.filter((mentor) => {
    if (filterCity && filterCity !== 'All Cities' && mentor.city !== filterCity) return false;
    if (filterGenre && !mentor.genres.includes(filterGenre)) return false;
    return true;
  });

  const handleRequestMentor = (mentorName: string) => {
    toast.success(`Mentor request sent to ${mentorName}!`, {
      description: 'They will contact you within 48 hours.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/label-portal/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Label Dashboard
        </Button>

        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">Mentor Directory</CardTitle>
                <CardDescription className="text-base">
                  Connect with experienced music professionals across Cameroon
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
                  {cities.map((city) => (
                    <option key={city} value={city === 'All Cities' ? '' : city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Genre Expertise</label>
                <Select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <div className="text-center w-full">
                  <div className="text-2xl font-bold text-orange-600">{filteredMentors.length}</div>
                  <div className="text-sm text-muted-foreground">Available Mentors</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="group hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{mentor.name}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{mentor.city}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-xl font-bold text-yellow-600">{mentor.successRating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Expertise:</div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Success Rating Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rating</span>
                      <span className="font-medium">{mentor.successRating}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full transition-all"
                        style={{ width: `${mentor.successRating}%` }}
                      />
                    </div>
                  </div>

                  {/* Request Button */}
                  <Button
                    className="w-full"
                    variant={mentor.successRating >= 90 ? 'default' : 'outline'}
                    onClick={() => handleRequestMentor(mentor.name)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Request Mentor
                  </Button>

                  {mentor.successRating >= 90 && (
                    <Badge variant="success" className="w-full justify-center">
                      Highly Recommended
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Mentors Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to find mentors in your area
              </p>
              <Button
                onClick={() => {
                  setFilterCity('');
                  setFilterGenre('');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
