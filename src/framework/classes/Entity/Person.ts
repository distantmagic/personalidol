import Entity from "src/framework/classes/Entity";

import Aimable from "src/framework/interfaces/Memorizable/Aimable";
import Aims from "src/framework/interfaces/Sentient/Aims";
import Hears from "src/framework/interfaces/Sentient/Perceives/Hears";
import Identifiable from "src/framework/interfaces/Identifiable";
import Memorizable from "src/framework/interfaces/Memorizable";
import Memorizes from "src/framework/interfaces/Sentient/Perceives/Memorizes";
import Message from "src/framework/interfaces/Perceivable/Message";
import Perceives from "src/framework/interfaces/Sentient/Perceives";
import Sees from "src/framework/interfaces/Sentient/Perceives/Sees";
import Speaks from "src/framework/interfaces/Sentient/Speaks";
import Vocal from "src/framework/interfaces/Perceivable/Message/Vocal";

export default class Person extends Entity implements Aims, Hears, Identifiable, Memorizes, Sees, Speaks {
  private readonly _name: string;

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
