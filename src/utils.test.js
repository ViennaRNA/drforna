import {describe, expect, test} from '@jest/globals';
const { parseFasta,
        writeRuler } = require('./utils');

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

// Unit tests using Jest
describe('writeRuler', () => {
  test('should generate ruler string for length 20', () => {
    expect(writeRuler(20)).toBe("....,....10...,....20");
  });

  test('should generate ruler string for length 21', () => {
    expect(writeRuler(21)).toBe("....,....10...,....20");
  });

  test('should generate ruler string for length 5', () => {
    expect(writeRuler(5)).toBe("....,");
  });
});

