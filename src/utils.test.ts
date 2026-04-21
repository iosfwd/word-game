import { describe, expect, test } from 'vitest'
import { evaluateGuess } from './utils';

describe('evaluateGuess', () => {
  test('all correct', () => {
    expect(evaluateGuess('SALET', 'SALET')).toEqual([
      { letter: 'S', status: 'correct' },
      { letter: 'A', status: 'correct' },
      { letter: 'L', status: 'correct' },
      { letter: 'E', status: 'correct' },
      { letter: 'T', status: 'correct' },
    ])
  });

  test('all absent', () => {
    expect(evaluateGuess('SALET', 'RUNIC')).toEqual([
      { letter: 'S', status: 'absent' },
      { letter: 'A', status: 'absent' },
      { letter: 'L', status: 'absent' },
      { letter: 'E', status: 'absent' },
      { letter: 'T', status: 'absent' },
    ])
  })

  test('one correct', () => {
    expect(evaluateGuess('CRONY', 'CLUMP')).toEqual([
      { letter: 'C', status: 'correct' },
      { letter: 'R', status: 'absent' },
      { letter: 'O', status: 'absent' },
      { letter: 'N', status: 'absent' },
      { letter: 'Y', status: 'absent' },
    ])
  })

  test('one present', () => {
    expect(evaluateGuess('SALET', 'CLUMP')).toEqual([
      { letter: 'S', status: 'absent' },
      { letter: 'A', status: 'absent' },
      { letter: 'L', status: 'present' },
      { letter: 'E', status: 'absent' },
      { letter: 'T', status: 'absent' },
    ])
  })

  test('one correct but second absent', () => {
    expect(evaluateGuess('SPEED', 'ABCDE')).toEqual([
      { letter: 'S', status: 'absent' },
      { letter: 'P', status: 'absent' },
      { letter: 'E', status: 'present' },
      { letter: 'E', status: 'absent' },
      { letter: 'D', status: 'present' },
    ])
  })

  test('two correct correct but third absent', () => {
    expect(evaluateGuess('AAABB', 'AABBB')).toEqual([
      { letter: 'A', status: 'correct' },
      { letter: 'A', status: 'correct' },
      { letter: 'A', status: 'absent' },
      { letter: 'B', status: 'correct' },
      { letter: 'B', status: 'correct' },
    ])
  })
});
