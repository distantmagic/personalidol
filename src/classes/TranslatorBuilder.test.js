// @flow

import CommandBuffer from "./CommandBuffer";
import CommandBus from "./CommandBus";
import Logger from "./Logger";
import TranslatorBuilder from "./TranslatorBuilder";

declare var expect: any;
declare var it: any;

const logger: Logger = new Logger();

it("checks if translation exists", async () => {
  const translator = await new TranslatorBuilder(logger).createTranslator();

  expect(translator.exists("test")).toBe(true);
});

it("checks if translation does not exist", async () => {
  const translator = await new TranslatorBuilder(logger).createTranslator();

  expect(translator.exists("test2")).toBe(false);
});

it("gets translation", async () => {
  const translator = await new TranslatorBuilder(logger).createTranslator();

  expect(translator.translate("test")).toBe("foo");
});
