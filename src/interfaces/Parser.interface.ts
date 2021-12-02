export type DataType = 'application/json';
// | 'application/javascript'
// | 'application/octet-stream'
// | 'application/ogg'
// | 'application/pdf'
// | 'application/xhtml+xml'
// | 'application/x-shockwave-flash'
// | 'application/json'
// | 'application/ld+json'
// | 'application/xml'
// | 'application/zip'
// | 'application/x-www-form-urlencoded'
// | 'audio/mpeg'
// | 'audio/x-ms-wma'
// | 'audio/x-wav'
// | 'image/gif'
// | 'image/jpeg'
// | 'image/png'
// | 'image/tiff'
// | 'image/svg+xml'
// | 'multipart/mixed'
// | 'multipart/alternative'
// | 'multipart/form-data'
// | 'text/css'
// | 'text/csv'
// | 'text/html'
// | 'text/plain'
// | 'text/xml';

export interface Parser {
  acceptedDataType: DataType;
  parse: (body: string) => any;
}
