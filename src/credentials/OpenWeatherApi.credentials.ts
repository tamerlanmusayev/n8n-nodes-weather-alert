import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OpenWeatherApi implements ICredentialType {
  name = 'openWeatherApi';
  displayName = 'OpenWeather API';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
    },
  ];
}
