import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    IExecuteFunctions,
} from "n8n-workflow";

import { weatherAlertDescription } from "./WeatherAlert.description";
import {
    fetchCurrent,
    fetchForecastOneDay,
    checkConditions,
} from "./WeatherAlert.functions";

import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY;

export class WeatherAlert implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Weather Alert",
        name: "weatherAlert",
        icon: "file:weather.svg",
        group: ["transform"],
        version: 1,
        description: "Checks weather and triggers alerts",
        defaults: {
            name: "Weather Alert",
            color: "#77AAFF",
        },
        credentials: [
            {
                name: "openWeatherApi",
                required: true,
            },
        ],
        inputs: ["main"],
        outputs: ["main"],
        properties: weatherAlertDescription as any,
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        if (!apiKey) {
            throw new Error("OpenWeather API key is missing in credentials.");
        }

        // Node params
        const mode = this.getNodeParameter("mode", 0) as string;
        const locationType = this.getNodeParameter("locationType", 0) as string;
        const units = this.getNodeParameter("units", 0) as string;
        const returnMode = this.getNodeParameter("returnMode", 0) as string;
        const conditionsCollection = this.getNodeParameter(
            "conditions.conditionValues",
            0,
            []
        ) as Array<{ type: string; threshold?: number }>;

        // support multiple items: run for each input item or once if no input
        const runItems = items && items.length ? items : [{ json: {} }];

        for (let i = 0; i < runItems.length; i++) {
            const item = runItems[i];
            let city: string | null = null;
            let lat: number | null = null;
            let lon: number | null = null;

            if (locationType === "city") {
                city = this.getNodeParameter("city", i) as string;
            } else {
                lat = this.getNodeParameter("lat", i) as number;
                lon = this.getNodeParameter("lon", i) as number;
            }

            try {
                let weatherData: any = null;

                if (mode === "current") {
                    weatherData = await fetchCurrent(
                        city,
                        lat,
                        lon,
                        apiKey,
                        units
                    );
                } else {
                    // forecast: need lat/lon; if city provided, do one call to get coords then forecast
                    if (locationType === "city") {
                        const current = await fetchCurrent(
                            city,
                            null,
                            null,
                            apiKey,
                            units
                        );
                        lat = current.coord?.lat ?? null;
                        lon = current.coord?.lon ?? null;
                    }
                    if (lat === null || lon === null) {
                        throw new Error(
                            "Latitude and longitude are required for forecast mode."
                        );
                    }
                    const forecast = await fetchForecastOneDay(
                        lat,
                        lon,
                        apiKey,
                        units
                    );
                    const day =
                        Array.isArray(forecast.daily) &&
                        forecast.daily.length > 0
                            ? forecast.daily[0]
                            : (forecast.daily && forecast.daily[1]) || {};
                    weatherData = {
                        weather: day.weather || [],
                        main: { temp: day.temp?.day ?? day.temp ?? null },
                        wind: { speed: day.wind_speed ?? null },
                        rawForecast: forecast,
                    };
                }

                const conds = Array.isArray(conditionsCollection)
                    ? conditionsCollection
                    : [];
                const { alert, reasons } = checkConditions(weatherData, conds);

                const out: IDataObject = {
                    alert,
                    reasons,
                    weather: weatherData,
                };

                if (returnMode === "boolean") {
                    out.weather = undefined;
                }

                returnData.push({ json: out });
            } catch (err) {
                returnData.push({ json: { error: (err as Error).message } });
            }
        }

        return this.prepareOutputData(returnData);
    }
}
