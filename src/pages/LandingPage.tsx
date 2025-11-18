import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Building2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            CIMFEST
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Cameroon's Premier Music Development Platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-2xl transition-shadow cursor-pointer group"
                onClick={() => navigate('/musician/signup')}>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Musician</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Develop your musical talents</li>
                <li>• Access training programs</li>
                <li>• Get talent assessments</li>
                <li>• Connect with mentors</li>
                <li>• Track your progress</li>
              </ul>
              <Button className="w-full group-hover:bg-purple-700 transition-colors">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-shadow cursor-pointer group"
                onClick={() => navigate('/label/login')}>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Record Label</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Discover new talents</li>
                <li>• Access artist profiles</li>
                <li>• Review talent assessments</li>
                <li>• Connect with mentors</li>
                <li>• Manage your roster</li>
              </ul>
              <Button className="w-full group-hover:bg-orange-600 transition-colors">
                Access Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}