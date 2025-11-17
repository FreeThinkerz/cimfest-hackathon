import { useParams, useNavigate } from 'react-router-dom';
import { mockArtists } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, TrendingUp, Users, Zap } from 'lucide-react';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = mockArtists.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Artist Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/nmd')}>Back to Directory</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/nmd')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>

        {/* Artist Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-4xl mb-4">{artist.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="default" className="text-base px-3 py-1">
                    {artist.genre}
                  </Badge>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {artist.region}
                  </Badge>
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6">
                <div className="text-5xl font-bold">{artist.performanceScore}</div>
                <div className="text-sm font-semibold">Performance Score</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Engagement</CardTitle>
                  <CardDescription>Audience interaction</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{artist.engagement}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${artist.engagement}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Virality</CardTitle>
                  <CardDescription>Content spread</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">{artist.virality}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${artist.virality}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Growth</CardTitle>
                  <CardDescription>Trend trajectory</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{artist.growth}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${artist.growth}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Promotional Strengths</CardTitle>
            <CardDescription>Key factors driving their success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {artist.strengths.map((strength) => (
                <Badge key={strength} variant="secondary" className="text-sm px-4 py-2">
                  {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why They're Succeeding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed">{artist.successNotes}</p>
          </CardContent>
        </Card>

        {/* External Links */}
        <Card>
          <CardHeader>
            <CardTitle>External Links</CardTitle>
            <CardDescription>Follow and explore their content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artist.youtubeLink && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={artist.youtubeLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube
                  </a>
                </Button>
              )}
              {artist.tiktokLink && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={artist.tiktokLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    TikTok
                  </a>
                </Button>
              )}
              {artist.spotifyLink && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={artist.spotifyLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Spotify
                  </a>
                </Button>
              )}
              {artist.boomplayLink && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={artist.boomplayLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Boomplay
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
