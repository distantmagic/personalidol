// @flow

import Entity from "../Entity";
import ForgetMemorizable from "../Command/ForgetMemorizable";
import HearMessage from "../Command/HearMessage";
import Knows from "../Query/Knows";
import LearnMemorizable from "../Command/LearnMemorizable";
import TellMessage from "../Command/TellMessage";
import { default as AimCommand } from "../Command/Aim";

import type { Aimable } from "../../interfaces/Memorizable/Aimable";
import type { Aims } from "../../interfaces/Sentient/Aims";
import type { Collection } from "../../../framework/interfaces/Collection";
import type { Hears } from "../../interfaces/Sentient/Perceives/Hears";
import type { Memorizable } from "../../interfaces/Memorizable";
import type { Memorizes } from "../../interfaces/Sentient/Perceives/Memorizes";
import type { Message } from "../../interfaces/Perceivable/Message";
import type { Perceives } from "../../interfaces/Sentient/Perceives";
import type { Sees } from "../../interfaces/Sentient/Perceives/Sees";
import type { Speaks } from "../../interfaces/Sentient/Speaks";
import type { Vocal } from "../../interfaces/Perceivable/Message/Vocal";

export default class Person extends Entity
  implements Aims, Hears, Memorizes, Sees, Speaks {
  aim(aimable: Aimable): void {
    // this.commandBus.source(new AimCommand(this, aimable));
  }

  aware(otherEntity: Entity, knows: Memorizable): void {
    // aware(awareness: Awareness): void {
  }

  feels(/* emotion:  */): void {}

  forget(memorizable: Memorizable): void {
    // this.commandBus.source(new ForgetMemorizable(this, memorizable));
  }

  hear(message: Vocal): void {
    // this.commandBus.source(new HearMessage(this, message));
  }

  async knows(memorizable: Memorizable): Promise<boolean> {
    // return this.queryBus.source<boolean>(new Knows(this, memorizable));
    return false;
  }

  intuition(agains: Entity) {
    // uzaleznione od jakosci postepowania
    // dobre - prawdziwa intuicja
    // zle - nieprawdziwe przeczucie, szalenstwo, paranoja
  }

  learn(memorizable: Memorizable): void {
    // this.commandBus.source(new LearnMemorizable(this, memorizable));
  }

  tell(beings: Collection<Perceives>, message: Message): void {
    beings.forEach(being => {
      // this.commandBus.source(new TellMessage(being, message));
    });
  }
}
