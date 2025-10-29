import { INodeProperties } from 'n8n-workflow';

export const weatherAlertDescription: INodeProperties[] = [
  {
    displayName: 'Mode',
    name: 'mode',
    type: 'options',
    options: [
      { name: 'Current weather', value: 'current' },
      { name: 'Forecast (next day)', value: 'forecast' },
    ],
    default: 'forecast',
    description: 'Use current weather or next-day forecast',
  },
  {
    displayName: 'Location Type',
    name: 'locationType',
    type: 'options',
    options: [
      { name: 'City name', value: 'city' },
      { name: 'Coordinates', value: 'coords' },
    ],
    default: 'city',
  },
  {
    displayName: 'City',
    name: 'city',
    type: 'string',
    displayOptions: { show: { locationType: ['city'] } },
    default: '',
    description: 'City name, e.g., "Baku" or "New York,US"',
  },
  {
    displayName: 'Latitude',
    name: 'lat',
    type: 'number',
    displayOptions: { show: { locationType: ['coords'] } },
    default: 0,
  },
  {
    displayName: 'Longitude',
    name: 'lon',
    type: 'number',
    displayOptions: { show: { locationType: ['coords'] } },
    default: 0,
  },
  {
    displayName: 'Units',
    name: 'units',
    type: 'options',
    options: [
      { name: 'Metric', value: 'metric' },
      { name: 'Imperial', value: 'imperial' },
    ],
    default: 'metric',
  },
  {
    displayName: 'Conditions',
    name: 'conditions',
    type: 'fixedCollection',
    placeholder: 'Add Condition',
    typeOptions: { multipleValues: true },
    default: {},
    options: [
      {
        displayName: 'Condition',
        name: 'conditionValues',
        values: [
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            options: [
              { name: 'rain', value: 'rain' },
              { name: 'snow', value: 'snow' },
              { name: 'temp_below', value: 'temp_below' },
              { name: 'temp_above', value: 'temp_above' },
              { name: 'wind_above', value: 'wind_above' },
            ],
            default: 'rain',
          },
          {
            displayName: 'Threshold',
            name: 'threshold',
            type: 'number',
            default: 0,
            description: 'Used for temp and wind checks',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Return Mode',
    name: 'returnMode',
    type: 'options',
    options: [
      { name: 'Boolean (alert)', value: 'boolean' },
      { name: 'Boolean + Data', value: 'both' },
    ],
    default: 'both',
  },
];
