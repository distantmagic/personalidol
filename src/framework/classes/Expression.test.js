// @flow

import Expression from "./Expression";
import ExpressionCasterBoolean from "./ExpressionCaster/Boolean";
import ExpressionCasterNumber from "./ExpressionCaster/Number";
import ExpressionCasterString from "./ExpressionCaster/String";

declare var expect: any;
declare var it: any;

const booleanCaster = new ExpressionCasterBoolean();
const numberCaster = new ExpressionCasterNumber();
const stringCaster = new ExpressionCasterString();

it("performs math calculations", () => {
  const expression = new Expression<number>("{{ 2 + 2 }}", numberCaster);
  const result = expression.execute();

  expect(result).resolves.toBe(4);
});

it("uses variables", () => {
  const expression = new Expression<number>("{{ 2 + foo }}", numberCaster);
  const result = expression.execute({
    foo: 3
  });

  expect(result).resolves.toBe(5);
});

it("uses objects", () => {
  const expression = new Expression<string>(
    `Greetings {{ character.player().name }}`,
    stringCaster
  );
  const result = expression.execute({
    character: {
      player: () => ({ name: "CHARNAME" })
    }
  });

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("uses promises", () => {
  const expression = new Expression<string>(
    `Greetings {{ character.player().name }}`,
    stringCaster
  );
  const result = expression.execute({
    character: {
      player: () => ({
        name: Promise.resolve("CHARNAME")
      })
    }
  });

  expect(result).resolves.toBe("Greetings CHARNAME");
});

it("resolves conditions with promises", () => {
  const expression = new Expression<boolean>(
    `
    {{ not character.player().knows() and character.player().aims() }}
  `,
    booleanCaster
  );
  const result = expression.execute({
    character: {
      player: () => ({
        aims: () => Promise.resolve(true),
        knows: () => Promise.resolve(false)
      })
    }
  });

  expect(result).resolves.toBe(true);
});
