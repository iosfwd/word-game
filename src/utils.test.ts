import { describe, expect, test } from 'vitest'
import { evaluateGuess, isValidWord, getGameStatus } from './utils';
import type { EvaluatedGuess } from './types';

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

describe('getGameStatus', () => {
  test('won', () => {
    const guesses: EvaluatedGuess[] = [];
    guesses.push(evaluateGuess('sigma', 'sigma'));
    expect(getGameStatus(guesses)).toEqual('won');
  })

  test('ongoing after wrong guess', () => {
    const guesses: EvaluatedGuess[] = [];
    guesses.push(evaluateGuess('salet', 'sigma'));
    expect(getGameStatus(guesses)).toEqual('ongoing');
  })

  test('empty ongoing', () => {
    const guesses: EvaluatedGuess[] = [];
    expect(getGameStatus(guesses)).toEqual('ongoing');
  })

  test('lost', () => {
    const guesses: EvaluatedGuess[] = [];
    guesses.push(evaluateGuess('salet', 'ozone'));
    guesses.push(evaluateGuess('sigma', 'ozone'));
    guesses.push(evaluateGuess('pudgy', 'ozone'));
    guesses.push(evaluateGuess('lemon', 'ozone'));
    guesses.push(evaluateGuess('runic', 'ozone'));
    guesses.push(evaluateGuess('crone', 'ozone'));
    expect(getGameStatus(guesses)).toEqual('lost');
  })

  test('last correct', () => {
    const guesses: EvaluatedGuess[] = [];
    guesses.push(evaluateGuess('salet', 'ozone'));
    guesses.push(evaluateGuess('sigma', 'ozone'));
    guesses.push(evaluateGuess('pudgy', 'ozone'));
    guesses.push(evaluateGuess('lemon', 'ozone'));
    guesses.push(evaluateGuess('runic', 'ozone'));
    guesses.push(evaluateGuess('ozone', 'ozone'));
    expect(getGameStatus(guesses)).toEqual('won');
  })

})
