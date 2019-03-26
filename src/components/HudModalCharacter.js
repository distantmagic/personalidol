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
        </div>
        <div className="dd__modal__character__name">{characterName}</div>
        <div className="dd__modal__character__bio">
          Młoda, inteligentna, piękna. Wychowana tylko do tego, żeby w trafić do
          pałacu jako luksusowa niewolnica, do czego faktycznie ma wszystkie
          predyspozycje. Większość życia spędziła w wygodzie, dlatego nie ma
          dobrej kondycji. Nigdy nie akceptowała do końca swego losu, mimo, że w
          gruncie rzeczy oferował komfort (i względną beztroskę) i zawsze w
          miarę możliwości zakradała się do biblioteki, żeby dowiedzieć
          się czegoś o świecie przynajmniej w ten sposób. Zawsze liczyła na to,
          że może kiedyś będzie miała okazję wyrwać się  i sama o siebie zadbać,
          a wtedy każda wiedza może się przydać. Podejrzanie mocno interesuje
          się czarnymi kotami i kurzymi łapkami, a nocą podczas podróży często
          patrzy w gwiazdy. Moore wydaje się czasami podejrzewać ją o czarną
          magię, ale ona parska śmiechem, kiedy zauważa takie niedorzeczne
          sugestie.
        </div>
        <dl className="dd__modal__character__stats">
          <dt>Siła</dt>
          <dd>1/0-20</dd>
          <dt>Zręczność</dt>
          <dd>1/0-20</dd>
          <dt>Kondycja</dt>
          <dd>1/0-20</dd>
          <dt>Inteligencja</dt>
          <dd>1/0-20</dd>
          <dt>Wola</dt>
          <dd>1/0-20</dd>
          <dt>Empatia</dt>
          <dd>1/0-20</dd>
        </dl>
        <dl className="dd__modal__character__soul">
          <dt>Nieufność i nieposłuszeństwo</dt>
          <dd>20/0-100</dd>
          <dt>Skłonność do gniewu</dt>
          <dd>20/0-100</dd>
          <dt>Pamiętliwość</dt>
          <dd>20/0-100</dd>
          <dt>Oszczerstwa i pomówienia</dt>
          <dd>20/0-100</dd>
          <dt>Gadulstwo</dt>
          <dd>20/0-100</dd>
          <dt>Łgarstwo</dt>
          <dd>20/0-100</dd>
          <dt>Przygnębienie i lenistwo</dt>
          <dd>20/0-100</dd>
          <dt>Obżarstwo</dt>
          <dd>20/0-100</dd>
          <dt>
            Rozpusta i nieczystość
            {/*Cnotliwość i czystość cielesna*/}
          </dt>
          <dd>20/0-100</dd>
          <dt>Chciwość</dt>
          <dd>20/0-100</dd>
          <dt>
            Materializm
            {/*Wolność od materializmu*/}
          </dt>
          <dd>20/0-100</dd>
          <dt>Brak poczucia rzeczywistości, niezaangażowanie i dystans</dt>
          <dd>20/0-100</dd>
          <dt>Bojaźliwość</dt>
          <dd>20/0-100</dd>
          <dt>Próżność</dt>
          <dd>20/0-100</dd>
          <dt>Pycha / zawyżone poczucie własnej wartości</dt>
          <dd>20/0-100</dd>
          <dt>
            Podłość, matactwa i chaos
            {/*Łagodność i ład wewnętrzny*/}
          </dt>
          <dd>20/0-100</dd>
          <dt>
            Brak rozsądku
            {/*Łagodność i ład wewnętrzny*/}
          </dt>
          <dd>20/0-100</dd>
        </dl>
      </div>
    );
  }
}
