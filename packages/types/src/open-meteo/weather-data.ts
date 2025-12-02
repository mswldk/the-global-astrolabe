export type WeatherData = {
    time: Date;
    is_day: number;
    weather_code: number;
    weather_code_text?: string;
    temperature_2m: number;
    rain: number;
    showers: number;
    snowfall: number;
    cloud_cover: number;
}