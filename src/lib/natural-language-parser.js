/**
 * Natural Language Parser for VetPras Search
 * Parses natural language queries into structured filters without AI
 */

// Service name mappings (including common variations and synonyms)
const SERVICE_KEYWORDS = {
  exam: ['exam', 'examination', 'checkup', 'check-up', 'wellness', 'visit', 'consultation'],
  vaccine: ['vaccine', 'vaccination', 'shot', 'shots', 'da2pp', 'core vaccine', 'immunization'],
  spay: ['spay', 'spaying', 'female sterilization', 'female surgery'],
  neuter: ['neuter', 'neutering', 'male sterilization', 'castration', 'male surgery'],
};

// Rating keywords
const RATING_KEYWORDS = ['star', 'stars', 'rated', 'rating', 'review', 'reviews'];

// Location keywords that might appear
const LOCATION_PREFIXES = ['in', 'at', 'near', 'around', 'within'];

// Comparison operators
const COMPARISON_OPERATORS = {
  less: ['under', 'below', 'less than', 'cheaper than', 'lower than', '<', 'max', 'maximum', 'up to', 'at most'],
  greater: ['over', 'above', 'more than', 'greater than', '>', 'min', 'minimum', 'at least'],
  between: ['between', 'from', 'range'],
  exactly: ['exactly', 'equal to', '=', 'equals'],
};

// Price indicators
const PRICE_INDICATORS = ['$', 'dollar', 'dollars', 'bucks', 'cad'];

// Number words mapping
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  hundred: 100, thousand: 1000,
};

// Quality descriptors
const QUALITY_DESCRIPTORS = {
  high: ['best', 'top', 'excellent', 'great', 'highly rated', 'good', 'quality', 'premium'],
  low: ['cheap', 'affordable', 'budget', 'economical', 'inexpensive', 'lowest', 'cheapest'],
};

/**
 * Parse text number to numeric value
 */
function parseTextNumber(text) {
  const cleaned = text.toLowerCase().trim();

  // Check if it's already a number
  const directNum = parseFloat(cleaned.replace(/[^0-9.-]/g, ''));
  if (!isNaN(directNum)) return directNum;

  // Parse word numbers
  if (NUMBER_WORDS[cleaned]) return NUMBER_WORDS[cleaned];

  // Parse compound numbers like "twenty five"
  const words = cleaned.split(/[\s-]+/);
  let total = 0;
  let current = 0;

  for (const word of words) {
    if (NUMBER_WORDS[word]) {
      const value = NUMBER_WORDS[word];
      if (value === 100 || value === 1000) {
        current = (current || 1) * value;
      } else if (value < 100) {
        current += value;
      }
    }
  }

  total += current;
  return total > 0 ? total : null;
}

/**
 * Extract price values from query text
 */
function extractPriceInfo(query) {
  const result = {
    min: null,
    max: null,
    comparison: null,
  };

  const lowerQuery = query.toLowerCase();

  // Pattern for price ranges (e.g., "$500-$800", "$500 to $800", "between $500 and $800")
  const rangePatterns = [
    /\$?(\d+(?:\.\d+)?)\s*(?:-|to|and)\s*\$?(\d+(?:\.\d+)?)/i,
    /between\s+\$?(\d+(?:\.\d+)?)\s+and\s+\$?(\d+(?:\.\d+)?)/i,
    /from\s+\$?(\d+(?:\.\d+)?)\s+to\s+\$?(\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of rangePatterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      const value1 = parseFloat(match[1]);
      const value2 = parseFloat(match[2]);
      // Ensure min is always less than or equal to max (handle reversed ranges)
      result.min = Math.min(value1, value2);
      result.max = Math.max(value1, value2);
      result.comparison = 'between';
      return result;
    }
  }

  // Pattern for single price with comparison
  const singlePricePattern = /(?:under|below|less than|over|above|more than|at least|at most|up to|max|maximum|min|minimum)?\s*\$?(\d+(?:\.\d+)?)\s*(?:dollars?|bucks|cad)?/gi;
  const matches = [...lowerQuery.matchAll(singlePricePattern)];

  if (matches.length > 0) {
    const match = matches[0];
    const price = parseFloat(match[1]);
    const context = lowerQuery.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20);

    // Determine comparison operator
    for (const [type, keywords] of Object.entries(COMPARISON_OPERATORS)) {
      if (keywords.some(keyword => context.includes(keyword))) {
        result.comparison = type;
        break;
      }
    }

    // Set min/max based on comparison
    if (result.comparison === 'less') {
      result.max = price;
    } else if (result.comparison === 'greater') {
      result.min = price;
    } else {
      // Default to "up to" for phrases like "exam $80"
      result.max = price;
      result.comparison = 'less';
    }
  }

  return result;
}

/**
 * Extract rating requirements from query
 */
function extractRatingInfo(query) {
  const result = {
    min: null,
    max: null,
  };

  const lowerQuery = query.toLowerCase();

  // Patterns for ratings
  const patterns = [
    /(\d+(?:\.\d+)?)\s*\+?\s*stars?/i,
    /(\d+(?:\.\d+)?)\s*stars?\s*(?:and|or)?\s*(?:above|higher|more|better)/i,
    /(?:at least|minimum|min)\s*(\d+(?:\.\d+)?)\s*stars?/i,
    /(?:highly|well|top)\s+rated/i,
  ];

  for (const pattern of patterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      if (match[1]) {
        const rating = parseFloat(match[1]);
        result.min = rating;
        result.max = 5; // Max rating is always 5
      } else if (pattern.source.includes('highly')) {
        // "highly rated" means 4+ stars
        result.min = 4;
        result.max = 5;
      }
      return result;
    }
  }

  // Check for quality descriptors that might imply rating
  if (QUALITY_DESCRIPTORS.high.some(word => lowerQuery.includes(word)) &&
      RATING_KEYWORDS.some(word => lowerQuery.includes(word))) {
    result.min = 4;
    result.max = 5;
  }

  return result;
}

/**
 * Extract service type from query
 */
function extractServiceType(query) {
  const lowerQuery = query.toLowerCase();
  const services = [];

  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      services.push(service);
    }
  }

  return services;
}

/**
 * Extract location from query
 */
function extractLocation(query) {
  const lowerQuery = query.toLowerCase();

  // Common cities in Greater Vancouver
  // IMPORTANT: Sort by length (longest first) to match multi-word cities before single-word substrings
  const cities = [
    'north vancouver',
    'west vancouver',
    'new westminster',
    'port coquitlam',
    'port moody',
    'maple ridge',
    'white rock',
    'vancouver',
    'burnaby',
    'richmond',
    'surrey',
    'coquitlam',
    'langley',
    'delta',
  ];

  const foundCities = [];
  const matchedSubstrings = new Set();

  for (const city of cities) {
    if (lowerQuery.includes(city)) {
      // Check if this city overlaps with an already matched city
      let isSubstring = false;
      for (const matched of matchedSubstrings) {
        if (matched.includes(city) || city.includes(matched)) {
          isSubstring = true;
          break;
        }
      }

      if (!isSubstring) {
        // Capitalize properly
        const capitalizedCity = city.split(' ').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        foundCities.push(capitalizedCity);
        matchedSubstrings.add(city);
      }
    }
  }

  return foundCities;
}

/**
 * Main parser function
 */
export function parseNaturalLanguageQuery(query) {
  if (!query || typeof query !== 'string') {
    return null;
  }

  const result = {
    originalQuery: query,
    filters: {},
    searchText: '',
    confidence: 'high',
    suggestions: [],
  };

  // Extract service types
  const services = extractServiceType(query);

  // Extract price information for each service or generally
  const priceInfo = extractPriceInfo(query);

  // Extract rating information
  const ratingInfo = extractRatingInfo(query);

  // Extract location
  const locations = extractLocation(query);

  // Build filters based on extracted information
  if (services.length > 0) {
    // Apply price filter to specific services
    services.forEach(service => {
      if (priceInfo.min !== null || priceInfo.max !== null) {
        result.filters[service] = {
          min: priceInfo.min || 0,
          max: priceInfo.max || 9999,
        };
      }
    });

    // If user is looking for "cheap" or "affordable" services
    if (QUALITY_DESCRIPTORS.low.some(word => query.toLowerCase().includes(word))) {
      services.forEach(service => {
        // Set a reasonable "cheap" threshold (lower quartile)
        const cheapThresholds = {
          exam: 120,
          vaccine: 100,
          spay: 600,
          neuter: 400,
        };
        if (!result.filters[service]) {
          result.filters[service] = {
            min: 0,
            max: cheapThresholds[service] || 500,
          };
        }
      });
      result.confidence = 'medium';
      result.suggestions.push(`Showing ${services.join(', ')} services in the lower price range`);
    }
  } else if (priceInfo.min !== null || priceInfo.max !== null) {
    // No specific service mentioned, could apply to any
    result.confidence = 'medium';
    result.suggestions.push('No specific service mentioned. You may want to specify exam, vaccine, spay, or neuter.');
  }

  // Apply rating filter
  if (ratingInfo.min !== null) {
    result.filters.rating = {
      min: ratingInfo.min,
      max: ratingInfo.max || 5,
    };
  }

  // Apply location filter
  if (locations.length > 0) {
    result.filters.city = locations;
    result.searchText = locations[0]; // Use first location as search text
  }

  // Determine if we found meaningful patterns
  const hasFilters = Object.keys(result.filters).length > 0;

  if (!hasFilters) {
    // No patterns found, treat as regular text search
    result.searchText = query;
    result.confidence = 'low';
    return result;
  }

  // Generate human-readable interpretation
  result.interpretation = generateInterpretation(result.filters);

  return result;
}

/**
 * Generate human-readable interpretation of filters
 */
function generateInterpretation(filters) {
  const parts = [];

  // Service filters
  ['exam', 'vaccine', 'spay', 'neuter'].forEach(service => {
    if (filters[service]) {
      const { min, max } = filters[service];
      if (min && max && max < 9999) {
        parts.push(`${service} between $${min}-$${max}`);
      } else if (max && max < 9999) {
        parts.push(`${service} under $${max}`);
      } else if (min) {
        parts.push(`${service} over $${min}`);
      }
    }
  });

  // Rating filter
  if (filters.rating) {
    parts.push(`${filters.rating.min}+ star rating`);
  }

  // City filter
  if (filters.city && filters.city.length > 0) {
    parts.push(`in ${filters.city.join(', ')}`);
  }

  return parts.length > 0 ?
    'Showing clinics with ' + parts.join(', ') :
    'Showing all clinics';
}

/**
 * Get example queries for user guidance
 */
export function getExampleQueries() {
  return [
    'exam fees under $80',
    'spay between $500 and $800',
    'clinics with 4 stars and above',
    'cheap vaccine in Vancouver',
    'neuter under 400 dollars',
    'highly rated clinics in Richmond',
    'best exam prices in Burnaby',
    'affordable spay surgery',
  ];
}