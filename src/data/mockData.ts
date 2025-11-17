export interface Artist {
  id: string;
  name: string;
  genre: string;
  region: string;
  image?: string;
  performanceScore: number;
  youtubeLink?: string;
  tiktokLink?: string;
  boomplayLink?: string;
  spotifyLink?: string;
  engagement: number;
  virality: number;
  growth: number;
  strengths: string[];
  successNotes: string;
}

export interface Mentor {
  id: string;
  name: string;
  city: string;
  genres: string[];
  successRating: number;
  image?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  passingScore: number;
}

export const genres = [
  'Afrobeats',
  'Makossa',
  'Bikutsi',
  'Hip Hop',
  'R&B',
  'Gospel',
  'Traditional',
  'Afro-Pop',
];

export const regions = [
  'Douala',
  'Yaounde',
  'Bamenda',
  'Buea',
  'Garoua',
  'Bafoussam',
  'Limbe',
  'Other',
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Stanley Enow',
    genre: 'Hip Hop',
    region: 'Douala',
    performanceScore: 92,
    youtubeLink: 'https://youtube.com/@stanleyenow',
    tiktokLink: 'https://tiktok.com/@stanleyenow',
    spotifyLink: 'https://spotify.com/artist/stanleyenow',
    engagement: 88,
    virality: 95,
    growth: 85,
    strengths: ['Social Media Presence', 'Consistent Releases', 'Cross-border Appeal'],
    successNotes: 'Pioneered Cameroonian hip hop on international stage with "Hein Pere". Strong TikTok engagement with dance challenges.',
  },
  {
    id: '2',
    name: 'Blanche Bailly',
    genre: 'Afro-Pop',
    region: 'Douala',
    performanceScore: 89,
    youtubeLink: 'https://youtube.com/@blanchebailly',
    tiktokLink: 'https://tiktok.com/@blanchebailly',
    boomplayLink: 'https://boomplay.com/artist/blanchebailly',
    engagement: 90,
    virality: 87,
    growth: 92,
    strengths: ['Visual Aesthetics', 'Female Empowerment Themes', 'YouTube Strategy'],
    successNotes: 'Built massive following through high-quality music videos and relatable content. Strong connection with female audience.',
  },
  {
    id: '3',
    name: 'Tenor',
    genre: 'Afrobeats',
    region: 'Yaounde',
    performanceScore: 87,
    youtubeLink: 'https://youtube.com/@tenor',
    spotifyLink: 'https://spotify.com/artist/tenor',
    engagement: 85,
    virality: 89,
    growth: 88,
    strengths: ['Melodic Hooks', 'Radio-Friendly Production', 'Pan-African Collaborations'],
    successNotes: 'Success through catchy melodies and strategic collaborations with Nigerian artists. Strong Boomplay presence.',
  },
  {
    id: '4',
    name: 'Ko-C',
    genre: 'Hip Hop',
    region: 'Bamenda',
    performanceScore: 85,
    tiktokLink: 'https://tiktok.com/@kocofficial',
    youtubeLink: 'https://youtube.com/@kocofficial',
    engagement: 82,
    virality: 88,
    growth: 86,
    strengths: ['Bilingual Flow', 'Street Credibility', 'TikTok Virality'],
    successNotes: 'Mastered both English and French rap. Creates viral moments through relatable street narratives.',
  },
  {
    id: '5',
    name: 'Daphne',
    genre: 'Afro-Pop',
    region: 'Buea',
    performanceScore: 90,
    youtubeLink: 'https://youtube.com/@daphne',
    spotifyLink: 'https://spotify.com/artist/daphne',
    boomplayLink: 'https://boomplay.com/artist/daphne',
    engagement: 91,
    virality: 89,
    growth: 90,
    strengths: ['Vocal Range', 'Stage Presence', 'Brand Partnerships'],
    successNotes: 'International recognition through powerful vocals and professional brand image. Multiple awards and endorsements.',
  },
  {
    id: '6',
    name: 'Salatiel',
    genre: 'Afrobeats',
    region: 'Douala',
    performanceScore: 93,
    youtubeLink: 'https://youtube.com/@salatiel',
    spotifyLink: 'https://spotify.com/artist/salatiel',
    engagement: 87,
    virality: 91,
    growth: 89,
    strengths: ['Production Skills', 'Songwriting', 'International Collaborations'],
    successNotes: 'Success as both artist and producer. Beyoncé collaboration brought international spotlight. Focus on quality over quantity.',
  },
  {
    id: '7',
    name: 'Locko',
    genre: 'Afro-Pop',
    region: 'Yaounde',
    performanceScore: 86,
    youtubeLink: 'https://youtube.com/@locko',
    boomplayLink: 'https://boomplay.com/artist/locko',
    engagement: 84,
    virality: 86,
    growth: 88,
    strengths: ['Emotional Storytelling', 'Acoustic Sessions', 'YouTube Consistency'],
    successNotes: 'Built fanbase through emotional love songs and acoustic performances. Regular YouTube releases maintain engagement.',
  },
  {
    id: '8',
    name: 'Mr Leo',
    genre: 'Afrobeats',
    region: 'Buea',
    performanceScore: 84,
    youtubeLink: 'https://youtube.com/@mrleo',
    spotifyLink: 'https://spotify.com/artist/mrleo',
    engagement: 83,
    virality: 85,
    growth: 84,
    strengths: ['Melodic Versatility', 'Live Performances', 'Fan Engagement'],
    successNotes: 'Strong connection with fans through consistent live shows. Versatile style appeals to broad audience.',
  },
  {
    id: '9',
    name: 'Montess',
    genre: 'Afro-Pop',
    region: 'Douala',
    performanceScore: 82,
    youtubeLink: 'https://youtube.com/@montess',
    tiktokLink: 'https://tiktok.com/@montess',
    engagement: 80,
    virality: 84,
    growth: 83,
    strengths: ['Youth Appeal', 'Dance Content', 'TikTok Strategy'],
    successNotes: 'Rising star leveraging TikTok dance trends. Young demographic connection through relatable content.',
  },
  {
    id: '10',
    name: 'Kameni',
    genre: 'Makossa',
    region: 'Yaounde',
    performanceScore: 88,
    youtubeLink: 'https://youtube.com/@kameni',
    engagement: 86,
    virality: 87,
    growth: 85,
    strengths: ['Cultural Authenticity', 'Traditional Fusion', 'Diaspora Connection'],
    successNotes: 'Successfully modernized Makossa for contemporary audience. Strong diaspora following through cultural authenticity.',
  },
];

export const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Jovi Le Monstre',
    city: 'Buea',
    genres: ['Hip Hop', 'Afrobeats'],
    successRating: 95,
  },
  {
    id: '2',
    name: 'Salatiel',
    city: 'Douala',
    genres: ['Afrobeats', 'Afro-Pop'],
    successRating: 98,
  },
  {
    id: '3',
    name: 'Reniss',
    city: 'Yaounde',
    genres: ['Afro-Pop', 'R&B'],
    successRating: 90,
  },
  {
    id: '4',
    name: 'Maahlox Le Vibeur',
    city: 'Douala',
    genres: ['Traditional', 'Makossa'],
    successRating: 88,
  },
  {
    id: '5',
    name: 'Magasco',
    city: 'Bamenda',
    genres: ['Afrobeats', 'Hip Hop'],
    successRating: 87,
  },
  {
    id: '6',
    name: 'Nabila',
    city: 'Yaounde',
    genres: ['Gospel', 'R&B'],
    successRating: 85,
  },
  {
    id: '7',
    name: 'Daphne',
    city: 'Buea',
    genres: ['Afro-Pop'],
    successRating: 92,
  },
  {
    id: '8',
    name: 'Pascal Dion',
    city: 'Douala',
    genres: ['Gospel', 'Traditional'],
    successRating: 89,
  },
];

export const lessons: Lesson[] = [
  {
    id: 'vocal-warmup',
    title: 'Vocal Warmup',
    description: 'Master basic vocal control and breath support',
    instructions: [
      'Find a quiet space',
      'Sit or stand with good posture',
      'Record yourself singing "Ah" for 5-10 seconds',
      'Maintain steady volume and pitch',
      'Our AI will analyze your vocal control',
    ],
    passingScore: 70,
  },
  {
    id: 'pitch-drill',
    title: 'Pitch Drill',
    description: 'Develop accurate pitch matching abilities',
    instructions: [
      'Listen carefully to the reference pitch',
      'Wait for the recording signal',
      'Sing the same pitch back clearly',
      'Hold the note steady for 3 seconds',
      'AI will measure your pitch accuracy',
    ],
    passingScore: 75,
  },
  {
    id: 'rhythm-clapping',
    title: 'Rhythm Clapping',
    description: 'Build strong rhythmic timing and consistency',
    instructions: [
      'Listen to the beat pattern',
      'When ready, clap along with the beat',
      'Maintain consistent timing',
      'Complete the full pattern',
      'AI will assess your rhythm stability',
    ],
    passingScore: 70,
  },
];

export const promotionalStrategies = {
  'Hip Hop': {
    platforms: ['TikTok', 'YouTube', 'Boomplay'],
    contentStrategy: ['Freestyles', 'Behind-the-scenes', 'Lyric videos'],
    postingFrequency: '3-4 times per week',
    keyTactics: [
      'Create viral freestyle challenges',
      'Collaborate with local producers',
      'Focus on relatable street narratives',
      'Use bilingual content (French/English)',
    ],
  },
  'Afrobeats': {
    platforms: ['Boomplay', 'Spotify', 'TikTok'],
    contentStrategy: ['Dance challenges', 'Live sessions', 'Original tracks'],
    postingFrequency: '4-5 times per week',
    keyTactics: [
      'Create danceable hooks',
      'Partner with dancers for content',
      'Target pan-African audience',
      'Invest in quality production',
    ],
  },
  'Afro-Pop': {
    platforms: ['YouTube', 'Spotify', 'TikTok'],
    contentStrategy: ['Music videos', 'Acoustic sessions', 'Original tracks'],
    postingFrequency: '3-4 times per week',
    keyTactics: [
      'High-quality visuals are essential',
      'Tell stories through videos',
      'Build emotional connection',
      'Engage with fan comments',
    ],
  },
  'R&B': {
    platforms: ['Spotify', 'YouTube', 'Boomplay'],
    contentStrategy: ['Acoustic sessions', 'Live performances', 'Covers'],
    postingFrequency: '2-3 times per week',
    keyTactics: [
      'Showcase vocal abilities',
      'Create intimate acoustic content',
      'Cover popular songs',
      'Focus on audio quality',
    ],
  },
  'Gospel': {
    platforms: ['YouTube', 'Boomplay', 'Spotify'],
    contentStrategy: ['Live worship', 'Original tracks', 'Testimonials'],
    postingFrequency: '2-3 times per week',
    keyTactics: [
      'Authentic spiritual message',
      'Church partnerships',
      'Live worship sessions',
      'Community engagement',
    ],
  },
  'Makossa': {
    platforms: ['YouTube', 'Boomplay', 'Facebook'],
    contentStrategy: ['Traditional fusion', 'Live performances', 'Cultural content'],
    postingFrequency: '2-3 times per week',
    keyTactics: [
      'Honor traditional roots',
      'Modern production techniques',
      'Target diaspora audience',
      'Cultural festival performances',
    ],
  },
  'Traditional': {
    platforms: ['YouTube', 'Facebook', 'Boomplay'],
    contentStrategy: ['Cultural performances', 'Educational content', 'Live sessions'],
    postingFrequency: '2-3 times per week',
    keyTactics: [
      'Preserve cultural heritage',
      'Modern interpretations',
      'Educational storytelling',
      'Community events',
    ],
  },
  'Bikutsi': {
    platforms: ['YouTube', 'Boomplay', 'TikTok'],
    contentStrategy: ['Dance content', 'Traditional fusion', 'Original tracks'],
    postingFrequency: '3-4 times per week',
    keyTactics: [
      'High-energy performances',
      'Dance challenges',
      'Cultural authenticity',
      'Modern production',
    ],
  },
};

export const recordLabels = [
  { name: 'New Bell Music', region: 'Douala', focus: ['Afrobeats', 'Hip Hop'] },
  { name: 'Alpha Better Records', region: 'Yaounde', focus: ['Afro-Pop', 'R&B'] },
  { name: 'Empire Company', region: 'Douala', focus: ['Hip Hop', 'Afrobeats'] },
  { name: 'Big Dreams Entertainment', region: 'Bamenda', focus: ['Hip Hop', 'Afro-Pop'] },
  { name: 'Stevens Music Entertainment', region: 'Buea', focus: ['Afrobeats', 'Afro-Pop'] },
];
