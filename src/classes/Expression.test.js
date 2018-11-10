// @flow

import Expression from './Expression';

declare var expect: any;
declare var it: any;

it('performs math calculations', () => {
  const expression = new Expression('2 + 2');
  const result = expression.execute();

  expect(result).toBe('4');
});

it('uses variables', () => {
  const expression = new Expression('2 + foo');
  const result = expression.execute({
    foo: 3,
  });

  expect(result).toBe('5');
});

it('uses objects', () => {
  const expression = new Expression(`"Greetings " ~ character.player().name`);
  const result = expression.execute({
    character: {
      player: () => ({ name: 'CHARNAME' }),
    },
  });

  expect(result).toBe('Greetings CHARNAME');
});
