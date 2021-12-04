import { DataType, Parser } from '../interfaces/Parser.interface';
import { JSONParser } from './JSON.parser';
import { MultipartFormDataParser } from './MultipartFormData.parser';

const getParser = (dataType: DataType): Parser => {
  switch (dataType) {
    case 'application/json':
      return new JSONParser();
      break; 
      
    case 'multipart/form-data':
      return new MultipartFormDataParser();
      break;

    default:
      throw new Error('Unknown Parser Type');
      break;
  }
};
