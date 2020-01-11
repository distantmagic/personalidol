import * as React from "react";

import Character from "../framework/classes/Entity/Person/Character";

type Props = {
  character: Character;
};

export default function ModalCharacterBody(props: Props) {
  return (
    <div className="dd__modal__character__attributes">
      <blockquote className="dd-tp__blockquote">
        Nie bójcie się tych, którzy zabijają ciało, lecz duszy zabić nie mogą. Bójcie się raczej Tego, który duszę i ciało może zatracić w piekle.
        <footer>Mt 10:28</footer>
      </blockquote>
      <dl className="dd__modal__character__specifics dd__modal__character__specifics--body">
        <dt>Inteligencja</dt>
        <dd>1/1-20</dd>
        <dt>Kondycja</dt>
        <dd>1/1-20</dd>
        <dt>Siła</dt>
        <dd>1/1-20</dd>
        <dt>Zręczność</dt>
        <dd>1/1-20</dd>
      </dl>
      <dl className="dd__modal__character__specifics dd__modal__character__specifics--senses">
        <dt>Dotyk</dt>
        <dd>1/0-20</dd>
        <dt>Smak</dt>
        <dd>1/0-20</dd>
        <dt>Słuch</dt>
        <dd>1/0-20</dd>
        <dt>Węch</dt>
        <dd>1/0-20</dd>
        <dt>Wzrok</dt>
        <dd>1/0-20</dd>
      </dl>
    </div>
  );
}
