import { removeLeadingSlash } from '../../../src/utils/removeLeadingSlash';

describe('Success', () => {
  test('Slash exists', () => {
    const path = '/testing';
    expect(removeLeadingSlash(path)).toEqual('testing');
  });

  test('Slash exists: Long Path', () => {
    const path = '/testing/test123';
    expect(removeLeadingSlash(path)).toEqual('testing/test123');
  });

  test('Slash does not exists', () => {
    const path = 'testing';
    expect(removeLeadingSlash(path)).toEqual('testing');
  });
});
