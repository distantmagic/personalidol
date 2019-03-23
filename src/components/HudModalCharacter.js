// @flow

import * as React from "react";
import autoBind from "auto-bind";
import upperFirst from "lodash/upperFirst";

import type { Match } from "react-router";

type Props = {|
  match: Match
|};

type State = {||};

export default class HudModalRouter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  render() {
    const characterId = String(this.props.match.params.characterId);
    const characterName = upperFirst(characterId);

    return (
      <div className="dd__frame dd__modal__character">
        <div className="dd__modal__character__avatar">
          <img
            alt="portrait"
            className="dd__modal__character__avatar__image"
            src={`/assets/portrait-${characterId}.jpg`}
          />
          <div className="dd__modal__character__avatar__name">
            {characterName}
          </div>
          <div className="dd__modal__character__avatar__bio dd-tp__formatted-text">
            {"arlance" === characterId && (
              <React.Fragment>
                <p>
                  Młody i nieopierzony, rycerz, idealista. Chce walczyć za
                  lepszy świat, odnaleźć Prawdę i podzielić się nią ze
                  wszystkimi potrzebującymi.
                </p>
                <p>
                  Rodzice wpoili mu szacunek do Boga i ludzi, zapewnili możliwie
                  dobre wykształcenie. Marzyli o tym, żeby trafił do klasztoru,
                  ale Arlance nie chciał tego, bo świat i przygody pociągały go
                  bardziej niż cela i kałamarz.
                </p>
                <p>
                  W podróżach zachował pobożonść i romantyczną wizję świata, ale
                  nie brakuje mu też wprawy w walce i odwagi.
                </p>
              </React.Fragment>
            )}
            {"moore" === characterId && (
              <React.Fragment>
                <p>
                  Doświadczony w walce, nagły, silny i pewny siebie. Dąży do
                  celu po trupach (często dosłownie). W przygodach odniósł
                  sukces, obecnie majętny i czasami pozwala sobie spocząć na
                  włościach. Ambicja nie pozwoliła mu jednak zaniedbać się i
                  stracić wprawę w umiejętnościach.
                </p>
                <p>
                  Nigdy nie mówi nic o sobie, ani swojej przeszłości, ale ze
                  sposobu bycia i słownictwa można się domyślać, że nie jest
                  wykształcony, ani z dobrego domu. Być może chce zamaskować
                  mało imponujące korzenie i przeszłość. Zdecydowanie nie
                  brakuje mu jednak mądrości ulicy.
                </p>
              </React.Fragment>
            )}
            {"circassia" === characterId && (
              <React.Fragment>
                <p>
                  Młoda, inteligentna, piękna, jednak bez dobrej kondycji.
                  Wychowana tylko do tego, żeby w trafić do pałacu jako
                  luksusowa niewolnica, do czego faktycznie ma wszystkie
                  predyspozycje.
                </p>
                <p>
                  Nigdy nie akceptowała do końca swego losu, mimo, że w gruncie
                  rzeczy oferował komfortowe życie i zawsze w miarę możliwości
                  zakradała się do biblioteki, żeby dowiedzieć się czegoś o
                  świecie przynajmniej w ten sposób. Zawsze liczyła na to, że
                  może kiedyś będzie miała okazję wyrwać się i sama o siebie
                  zadbać, a wtedy każda wiedza może się przydać.
                </p>
                <p>
                  Podejrzanie mocno interesuje się czarnymi kotami i kurzymi
                  łapkami, a nocą podczas podróży często patrzy w gwiazdy. Moore
                  wydaje się czasami podejrzewać ją o czarną magię, ale ona
                  parska śmiechem, kiedy zauważa takie niedorzeczne sugestie.
                </p>
              </React.Fragment>
            )}
          </div>
        </div>
        <table className="dd__modal__character__stats">
          <thead />
          <tbody />
        </table>
        <div className="dd__modal__character__content" />
      </div>
    );
  }
}
