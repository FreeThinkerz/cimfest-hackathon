import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockArtists, genres, regions } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Database, ArrowLeft, ExternalLink } from "lucide-react";

export default function ArtistDirectoryPage() {
  const navigate = useNavigate();
  const [filterGenre, setFilterGenre] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  const filteredArtists = mockArtists.filter((artist) => {
    if (filterGenre && artist.genre !== filterGenre) return false;
    if (filterRegion && artist.region !== filterRegion) return false;
    return true;
  });

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">National Music Database</h1>
              <p className="text-muted-foreground">
                Discover Cameroon's top and rising artists
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 text-background">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredArtists.length} artists
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <Card
              key={artist.id}
              className="group hover:shadow-2xl text-background transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => navigate(`${artist.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {artist.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{artist.genre}</Badge>
                      <Badge>{artist.region}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {artist.performanceScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                      <div className="text-sm font-bold text-blue-600">
                        {artist.engagement}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Engagement
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                      <div className="text-sm font-bold text-purple-600">
                        {artist.virality}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Virality
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                      <div className="text-sm font-bold text-green-600">
                        {artist.growth}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Growth
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {artist.youtubeLink && (
                      <ExternalLink className="w-4 h-4 text-red-600" />
                    )}
                    {artist.tiktokLink && (
                      <ExternalLink className="w-4 h-4 text-black dark:text-white" />
                    )}
                    {artist.spotifyLink && (
                      <ExternalLink className="w-4 h-4 text-green-600" />
                    )}
                    {artist.boomplayLink && (
                      <ExternalLink className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
