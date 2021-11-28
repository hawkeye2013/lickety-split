import { HandlerMethods } from '../interfaces/Base.interface';

const convertMethodToEnum = (
  method: string | undefined,
): HandlerMethods | undefined => {
  switch (method) {
    case 'GET':
      return 'GET';
      break;
    case 'POST':
      return 'POST';
      break;
    case 'PUT':
      return 'PUT';
      break;
    case 'DELETE':
      return 'DELETE';
      break;
    default:
      return undefined;
      break;
  }
};

export { convertMethodToEnum };
