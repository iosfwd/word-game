import { describe, expect, test } from 'vitest'
import { evaluateGuess, isValidWord } from './utils';

describe('evaluateGuess', () => {
  test('all correct', () => {
    expect(evaluateGuess('salet', 'salet')).toEqual([
      { letter: 's', status: 'correct' },
      { letter: 'a', status: 'correct' },
      { letter: 'l', status: 'correct' },
      { letter: 'e', status: 'correct' },
      { letter: 't', status: 'correct' },
    ])
  });

  test('all absent', () => {
    expect(evaluateGuess('salet', 'runic')).toEqual([
      { letter: 's', status: 'absent' },
      { letter: 'a', status: 'absent' },
      { letter: 'l', status: 'absent' },
      { letter: 'e', status: 'absent' },
      { letter: 't', status: 'absent' },
    ])
  })

  test('one correct', () => {
    expect(evaluateGuess('crony', 'clump')).toEqual([
      { letter: 'c', status: 'correct' },
      { letter: 'r', status: 'absent' },
      { letter: 'o', status: 'absent' },
      { letter: 'n', status: 'absent' },
      { letter: 'y', status: 'absent' },
    ])
  })

  test('one present', () => {
    expect(evaluateGuess('salet', 'clump')).toEqual([
      { letter: 's', status: 'absent' },
      { letter: 'a', status: 'absent' },
      { letter: 'l', status: 'present' },
      { letter: 'e', status: 'absent' },
      { letter: 't', status: 'absent' },
    ])
  })

  test('one correct but second absent', () => {
    expect(evaluateGuess('speed', 'abcde')).toEqual([
      { letter: 's', status: 'absent' },
      { letter: 'p', status: 'absent' },
      { letter: 'e', status: 'present' },
      { letter: 'e', status: 'absent' },
      { letter: 'd', status: 'present' },
    ])
  })

  test('two correct correct but third absent', () => {
    expect(evaluateGuess('aaabb', 'aabbb')).toEqual([
      { letter: 'a', status: 'correct' },
      { letter: 'a', status: 'correct' },
      { letter: 'a', status: 'absent' },
      { letter: 'b', status: 'correct' },
      { letter: 'b', status: 'correct' },
    ])
  })
});

describe('isValidWord', () => {
  test('valid', () => {
    expect(isValidWord('sigma')).toBe(true)
  })

  test('invalid', () => {
    expect(isValidWord('zzzzz')).toBe(false)
  })

  test('case insensitive', () => {
    expect(isValidWord('SIGMA')).toBe(true)
  })

  test('too short', () => {
    expect(isValidWord('nope')).toBe(false)
  })

  test('too long', () => {
    expect(isValidWord('program')).toBe(false)
  })
})
