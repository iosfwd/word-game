import { beforeEach, describe, expect, test } from 'vitest'
import { evaluateGuess, isValidWord, getGameStatus, initLetterStatuses, updateLetterStatus, updateLetterStatuses } from './utils';
import type { EvaluatedGuess, KeyStatus } from './types';

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

describe('updateLetterStatus', () => {
  let letterStatuses: Map<string, KeyStatus>;

  beforeEach(() => {
    letterStatuses = initLetterStatuses();
  })

  test('unused to absent', () => {
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'absent');
    expect(letterStatuses.get('z')).toEqual('absent');
  })

  test('unused to present', () => {
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'present');
    expect(letterStatuses.get('z')).toEqual('present');
  })

  test('unused to correct', () => {
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'correct');
    expect(letterStatuses.get('z')).toEqual('correct');
  })

  test('present to correct', () => {
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'present');
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'correct');
    expect(letterStatuses.get('z')).toEqual('correct');
  })

  test('correct to present remains correct', () => {
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'correct');
    letterStatuses = updateLetterStatus(letterStatuses, 'z', 'present');
    expect(letterStatuses.get('z')).toEqual('correct');
  })
})

describe('updateLetterStatuses', () => {
  let letterStatuses: Map<string, KeyStatus>;

  beforeEach(() => {
    letterStatuses = initLetterStatuses();
  })

  test('base case', () => {
    const guess = evaluateGuess('salet', 'sigma');
    letterStatuses = updateLetterStatuses(letterStatuses, guess);
    expect.soft(letterStatuses.get('s')).toEqual('correct');
    expect.soft(letterStatuses.get('a')).toEqual('present');
    expect.soft(letterStatuses.get('l')).toEqual('absent');
    expect.soft(letterStatuses.get('e')).toEqual('absent');
    expect.soft(letterStatuses.get('t')).toEqual('absent');
    expect.soft(letterStatuses.get('i')).toEqual('unused');
    expect.soft(letterStatuses.get('g')).toEqual('unused');
    expect.soft(letterStatuses.get('m')).toEqual('unused');
  })

  test('repeated letter', () => {
    const guess = evaluateGuess('speed', 'abcde');
    letterStatuses = updateLetterStatuses(letterStatuses, guess);
    expect.soft(letterStatuses.get('s')).toEqual('absent');
    expect.soft(letterStatuses.get('p')).toEqual('absent');
    expect.soft(letterStatuses.get('e')).toEqual('present');
    expect.soft(letterStatuses.get('d')).toEqual('present');
    expect.soft(letterStatuses.get('a')).toEqual('unused');
    expect.soft(letterStatuses.get('b')).toEqual('unused');
    expect.soft(letterStatuses.get('c')).toEqual('unused');
  })
})
