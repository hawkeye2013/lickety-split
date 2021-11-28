import { DataType, Parser } from '../interfaces/Parser.interface';
import { JSONParser } from './JSON.parser';

const getParser = (dataType: DataType): Parser => {
  switch (dataType) {
    case 'application/json':
      return new JSONParser();
      break;

    default:
      throw new Error('Unknown Parser Type');
      break;
  }
};
