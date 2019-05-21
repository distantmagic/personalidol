// @flow

import Entity from "../Entity";
// import ForgetMemorizable from "../Command/ForgetMemorizable";
// import HearMessage from "../Command/HearMessage";
// import Knows from "../Query/Knows";
// import LearnMemorizable from "../Command/LearnMemorizable";
// import TellMessage from "../Command/TellMessage";
// import { default as AimCommand } from "../Command/Aim";

import type { Aimable } from "../../interfaces/Memorizable/Aimable";
import type { Aims } from "../../interfaces/Sentient/Aims";
import type { Hears } from "../../interfaces/Sentient/Perceives/Hears";
import type { Identifiable } from "../../interfaces/Identifiable";
import type { Memorizable } from "../../interfaces/Memorizable";
import type { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";
import type { Message } from "../../interfaces/Perceivable/Message";
import type { Perceives } from "../../interfaces/Sentient/Perceives";
import type { Sees } from "../../interfaces/Sentient/Perceives/Sees";
import type { Speaks } from "../../interfaces/Sentient/Speaks";
import type { Vocal } from "../../interfaces/Perceivable/Message/Vocal";

export default class Person extends Entity implements Aims, Hears, Identifiable, Memorizes, Sees, Speaks {
  +_name: string;

  constructor(name: string) {
    super();

    this._name = name;
  }

  async aim(aimable: Aimable): Promise<void> {
    // this.commandBus.source(new AimCommand(this, aimable));
  }

  async aware(otherEntity: Entity, knows: Memorizable): Promise<void> {
    // aware(awareness: Awareness): Promise<void> {
  }

  async feels(/* emotion:  */): Promise<void> {}

  async forget(memorizable: Memorizable): Promise<void> {
    // this.commandBus.source(new ForgetMemorizable(this, memorizable));
  }

  async hear(message: Vocal): Promise<void> {
    // this.commandBus.source(new HearMessage(this, message));
  }

  async knows(memorizable: Memorizable): Promise<boolean> {
    // return this.queryBus.source<boolean>(new Knows(this, memorizable));
    return false;
  }

  async intuition(against: Entity): Promise<void> {
    // uzaleznione od jakosci postepowania
    // dobre - prawdziwa intuicja
    // zle - nieprawdziwe przeczucie, szalenstwo, paranoja
  }

  async name(): Promise<string> {
    return this._name;
  }

  async learn(memorizable: Memorizable): Promise<void> {
    // this.commandBus.source(new LearnMemorizable(this, memorizable));
  }

  async tell(beings: Set<Perceives>, message: Message): Promise<void> {
    beings.forEach(being => {
      // this.commandBus.source(new TellMessage(being, message));
    });
  }
}
