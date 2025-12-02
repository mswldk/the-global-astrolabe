/**
 * All valid numerical weather codes from the table.
 * Used as a type guard for the keys of WEATHER_CODE_MAP.
 */
export type WeatherCode =
    | 0 | 1 | 2 | 3
    | 45 | 48
    | 51 | 53 | 55
    | 56 | 57
    | 61 | 63 | 65
    | 66 | 67
    | 71 | 73 | 75
    | 77
    | 80 | 81 | 82
    | 85 | 86
    | 95 | 96 | 99;

/**
 * A map from the numerical weather code (as a number or string) to its description.
 * Using `Record<WeatherCode, string>` ensures all valid codes have a description.
 */
export const WEATHER_CODE_MAP: Record<WeatherCode, string> = {
    // Clear and Cloudy
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    // Fog and Drizzle
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light intensity",
    53: "Drizzle: Moderate intensity",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light intensity",
    57: "Freezing Drizzle: Dense intensity",

    // Rain
    61: "Rain: Slight intensity",
    63: "Rain: Moderate intensity",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light intensity",
    67: "Freezing Rain: Heavy intensity",

    // Snow
    71: "Snow fall: Slight intensity",
    73: "Snow fall: Moderate intensity",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",

    // Showers
    80: "Rain showers: Slight intensity",
    81: "Rain showers: Moderate intensity",
    82: "Rain showers: Violent intensity",
    85: "Snow showers: Slight intensity",
    86: "Snow showers: Heavy intensity",

    // Thunderstorm
    95: "Thunderstorm: Slight or moderate", // Note: The table has a single entry for 95
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
};

/**
 * Utility function to safely get the description from a code.
 * It uses the WeatherCode type to ensure the input is valid.
 */
export function getWeatherDescription(code: WeatherCode): string {
    return WEATHER_CODE_MAP[code] || "Unknown Weather Code";
}