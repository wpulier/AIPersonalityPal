import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';

const parseXml = promisify(parseString) as (xml: string) => Promise<any>;

interface LetterboxdRating {
  title: string;
  rating: string;
  year: string;
  genres: string[];
}

interface LetterboxdItem {
  title: [string];
  letterboxd: [{
    $: {
      rating: string;
    };
  }];
  filmYear: [string];
  'letterboxd:filmGenres': [string];
}

interface LetterboxdFeed {
  rss: {
    channel: [{
      item: LetterboxdItem[];
    }];
  };
}

interface LetterboxdSuccess {
  status: 'success';
  recentRatings: LetterboxdRating[];
  favoriteGenres: string[];
  favoriteFilms: string[];
}

interface LetterboxdError {
  status: 'error';
  error: string;
}

interface LetterboxdNotProvided {
  status: 'not_provided';
}

type LetterboxdResult = LetterboxdSuccess | LetterboxdError | LetterboxdNotProvided;

function validateLetterboxdUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'letterboxd.com' && parsed.pathname.split('/').length >= 2;
  } catch {
    return false;
  }
}

function extractUsername(url: string): string {
  const path = new URL(url).pathname;
  return path.split('/')[1];
}

export async function getLetterboxdProfile(url: string): Promise<LetterboxdResult> {
  console.log('Starting Letterboxd profile fetch for URL:', url);

  try {
    if (!validateLetterboxdUrl(url)) {
      console.error('Invalid Letterboxd URL:', url);
      return {
        status: 'error',
        error: 'Invalid Letterboxd URL format'
      };
    }

    const username = extractUsername(url);
    const rssUrl = `https://letterboxd.com/${username}/rss/`;
    console.log('Fetching RSS feed from:', rssUrl);

    const response = await axios.get(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      timeout: 10000
    });

    let result;
    try {
      result = await parseXml(response.data);
    } catch (parseError) {
      console.error('Failed to parse XML:', parseError);
      return {
        status: 'error',
        error: 'Invalid XML response from Letterboxd'
      };
    }

    const feed = result as unknown as LetterboxdFeed;

    if (!feed?.rss?.channel?.[0]) {
      console.error('Invalid RSS structure:', JSON.stringify(result, null, 2));
      return {
        status: 'error',
        error: 'Invalid RSS data structure'
      };
    }

    const channel = feed.rss.channel[0];
    const items = channel.item || [];

    if (items.length === 0) {
      console.error('No items found in RSS feed');
      return {
        status: 'error',
        error: 'No activity found in profile'
      };
    }

    const genreFrequency: Record<string, number> = {};

    const recentRatings = items
      .slice(0, 20)
      .map((item: LetterboxdItem): LetterboxdRating | null => {
        try {
          const filmTitle = item.title[0];
          const filmYear = item.filmYear[0];
          const rating = item.letterboxd[0].$.rating;
          const genres = item['letterboxd:filmGenres']?.[0]?.split(',').map((genre: string) => genre.trim()) || [];

          genres.forEach(genre => {
            genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
          });

          if (!filmTitle) return null;

          return {
            title: filmTitle,
            rating: rating ? `${rating}/5` : 'Watched',
            year: filmYear || '',
            genres
          };
        } catch (itemError) {
          console.error('Error processing item:', itemError);
          return null;
        }
      })
      .filter((rating): rating is LetterboxdRating => rating !== null);

    if (recentRatings.length === 0) {
      console.error('No valid ratings found in profile');
      return {
        status: 'error',
        error: 'No valid ratings found in profile'
      };
    }

    const favoriteFilms = recentRatings
      .filter(rating => parseFloat(rating.rating) >= 4.5)
      .map(rating => rating.title)
      .slice(0, 5);

    const favoriteGenres = Object.entries(genreFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre);

    return {
      status: 'success',
      recentRatings: recentRatings.slice(0, 10),
      favoriteGenres,
      favoriteFilms
    };

  } catch (error) {
    console.error('Failed to fetch Letterboxd RSS:', error);
    const errorMessage = error instanceof Error ? 
      `${error.message} (${error.name})` : 
      'Unknown error occurred';

    return {
      status: 'error',
      error: errorMessage
    };
  }
}

export async function parseLetterboxdData(xml: string): Promise<LetterboxdSuccess | LetterboxdError> {
  try {
    const result = await parseXml(xml);
    const feed = result as unknown as LetterboxdFeed;

    if (!feed?.rss?.channel?.[0]?.item) {
      return {
        status: 'error',
        error: 'Invalid RSS data structure'
      };
    }

    const items = feed.rss.channel[0].item;
    const genreFrequency: Record<string, number> = {};

    const recentRatings = items
      .slice(0, 20)
      .map((item: LetterboxdItem): LetterboxdRating | null => {
        try {
          const filmTitle = item.title[0];
          const filmYear = item.filmYear[0];
          const rating = item.letterboxd[0].$.rating;
          const genres = item['letterboxd:filmGenres']?.[0]?.split(',').map((genre: string) => genre.trim()) || [];

          genres.forEach(genre => {
            genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
          });

          if (!filmTitle) return null;

          return {
            title: filmTitle,
            rating: rating ? `${rating}/5` : 'Watched',
            year: filmYear || '',
            genres
          };
        } catch (error) {
          console.error('Error processing item:', error);
          return null;
        }
      })
      .filter((rating): rating is LetterboxdRating => rating !== null);

    if (recentRatings.length === 0) {
      return {
        status: 'error',
        error: 'No valid ratings found'
      };
    }

    const favoriteFilms = recentRatings
      .filter(r => parseFloat(r.rating) >= 4.5)
      .map(r => r.title)
      .slice(0, 5);

    const favoriteGenres = Object.entries(genreFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre);

    return {
      status: 'success',
      recentRatings: recentRatings.slice(0, 10),
      favoriteGenres,
      favoriteFilms
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      status: 'error',
      error: errorMessage
    };
  }
}