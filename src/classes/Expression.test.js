import Expression from './Expression';

it('performs math calculations', async () => {
  const expression = new Expression('2 + 2');
  const result = expression.execute();

  expect(result).toBe('4');
});

it('uses variables', async () => {
  const expression = new Expression('2 + foo');
  const data = {
    foo: 3,
  };
  const result = expression.execute(data);

  expect(result).toBe('5');
});

it('uses objects', async () => {
  const expression = new Expression(`
    "Greetings " ~ character.player().name
  `);
  const data = {
    character: {
      player: () => ({ name: 'CHARNAME' }),
    },
  };
  const result = expression.execute(data);

  expect(result).toBe('Greetings CHARNAME');
});
