import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { mockArtists, genres, regions } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Building2,
  ArrowLeft,
  TrendingUp,
  Award,
  MapPin,
  LogOut,
} from "lucide-react";
import { AppLayout } from "@/layouts/app-layout";

export default function LabelDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sortBy, setSortBy] = useState("score");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  // Create mock artist talent data
  const artistsWithTalent = mockArtists.map((artist) => ({
    ...artist,
    talentScore: Math.floor(Math.random() * 30) + 70,
    level: ["basic", "intermediate", "advanced"][
      Math.floor(Math.random() * 3)
    ] as "basic" | "intermediate" | "advanced",
    strengthBadge: ["Pitch", "Rhythm", "Melody", "Harmony"][
      Math.floor(Math.random() * 4)
    ],
  }));

  let filteredArtists = artistsWithTalent.filter((artist) => {
    if (filterGenre && artist.genre !== filterGenre) return false;
    if (filterRegion && artist.region !== filterRegion) return false;
    return true;
  });

  // Sort artists
  if (sortBy === "score") {
    filteredArtists.sort((a, b) => b.talentScore - a.talentScore);
  } else if (sortBy === "level") {
    const levelOrder = { advanced: 3, intermediate: 2, basic: 1 };
    filteredArtists.sort((a, b) => levelOrder[b.level] - levelOrder[a.level]);
  }

  const topArtists = filteredArtists.slice(0, 5);

  return (
    <AppLayout>
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {user?.companyName || "Label"} Dashboard
                    </CardTitle>
                    <CardDescription className="text-base">
                      Discover and manage high-potential artists
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {filteredArtists.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Artists
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {
                      filteredArtists.filter((a) => a.level === "advanced")
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Advanced Level
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredArtists.filter((a) => a.talentScore >= 85).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    High Scores (85+)
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {genres.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Genres</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filters & Sorting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="score">Talent Score</option>
                    <option value="level">Level</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Genre
                  </label>
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
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
                  <label className="text-sm font-medium mb-2 block">
                    Region
                  </label>
                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFilterGenre("");
                      setFilterRegion("");
                      setSortBy("score");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Artists */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {sortBy === "score"
                ? "Top 5 High-Performing Artists"
                : "Artists by Level"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topArtists.map((artist, index) => (
                <Card
                  key={artist.id}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => navigate(`artist/${artist.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {index < 3 && sortBy === "score" && (
                            <Award className="w-5 h-5 text-yellow-600" />
                          )}
                          <CardTitle className="text-xl">
                            {artist.name}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{artist.genre}</Badge>
                          <Badge className="capitalize">{artist.level}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Talent Score
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                          {artist.talentScore}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                          <div className="text-sm font-bold text-blue-600">
                            {artist.performanceScore}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Performance
                          </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                          <div className="text-sm font-bold text-purple-600 capitalize">
                            {artist.strengthBadge}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Strength
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{artist.region}</span>
                      </div>

                      {artist.talentScore >= 85 && (
                        <Badge
                          variant="success"
                          className="w-full justify-center"
                        >
                          Recommended for Signing
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate("/label/mentors")}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div>
                    <CardTitle>Mentor Directory</CardTitle>
                    <CardDescription>
                      Connect artists with experienced mentors
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate("/nmd")}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-orange-600" />
                  <div>
                    <CardTitle>National Music Database</CardTitle>
                    <CardDescription>
                      Explore the full artist directory
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
