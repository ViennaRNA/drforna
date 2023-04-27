import {describe, expect, test} from '@jest/globals';
const { parseFasta } = require('./utils');

// Unit tests using Jest
describe('parseFasta', () => {
  test('returns the correct ID and sequence', () => {
    const fasta = '>seq1\nATCG\n';
    const result = parseFasta(fasta);
    expect(result).toEqual({ id: 'seq1', sequence: 'ATCG' });
  });

  test('returns the correct ID and sequence (with extra linebreaks)', () => {
    const fasta = '\n>seq1\n\nATCG\n\n';
    const result = parseFasta(fasta);
    expect(result).toEqual({ id: 'seq1', sequence: 'ATCG' });
  });

  test('returns the correct ID and sequence (with many names)', () => {
    const fasta = '\n>seq1 # and some other stuff\nATCG\n';
    const result = parseFasta(fasta);
    expect(result).toEqual({ id: 'seq1', sequence: 'ATCG' });
  });

  test('returns the empty ID and sequence', () => {
    const fasta = '';
    const result = parseFasta(fasta);
    expect(result).toEqual({ id: null, sequence: "" });
  });

  test('returns single sequence on multiple lines', () => {
    const fasta = 'seq\nATCG\n';
    const result = parseFasta(fasta);
    expect(result).toEqual({ id: null, sequence: "seqATCG" });
  });

  test('throws an error if the FASTA file contains multiple sequences', () => {
    const fasta = '>seq1\nATCG\n>seq2\nCGTA\n';
    expect(() => { parseFasta(fasta); }).toThrow('Multiple sequence IDs found.');
  });

  test('throws an error if a sequence contains not only letters', () => {
    const fasta = 'seq1\nATCG';
    expect(() => { parseFasta(fasta); }).toThrow('Sequences must contain only letters.');
  });

});

