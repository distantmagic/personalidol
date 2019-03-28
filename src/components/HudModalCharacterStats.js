// @flow

import * as React from "react";
import upperFirst from "lodash/upperFirst";

import Character from "../framework/classes/Entity/Person/Character";
import HudModalLoader from "./HudModalLoader";

type Props = {|
  character: Character
|};

export default function HudModalCharacterStats(props: Props) {
  const [state, setState] = React.useState({
    id: null,
    isLoading: true,
    name: null
  });

  React.useEffect(
    function() {
      props.character.name().then(name => {
        setState({
          id: name,
          isLoading: false,
          name: upperFirst(name)
        });
      });
    },
    [props.character]
  );

  if (state.isLoading) {
    return <HudModalLoader />;
  }

  return (
    <div className="dd__frame dd__modal__character">
      <div className="dd__modal__character__avatar">
        <img
          alt="portrait"
          className="dd__modal__character__avatar__image"
          src={`/assets/portrait-${state.id}.jpg`}
        />
      </div>
      <div className="dd__modal__character__name">{state.name}</div>
      <dl className="dd__modal__character__body">
        <dt>Siła</dt>
        <dd>1/1-20</dd>
        <dt>Zręczność</dt>
        <dd>1/1-20</dd>
        <dt>Kondycja</dt>
        <dd>1/1-20</dd>
        <dt>Inteligencja i pamięć</dt>
        <dd>1/1-20</dd>
        <dt>Mądrość i siła woli</dt>
        <dd>1/1-20</dd>
        <dt>Empatia</dt>
        <dd>1/1-20</dd>
      </dl>
      <dl className="dd__modal__character__senses">
        <dt>Wzrok</dt>
        <dd>1/0-20</dd>
        <dt>Słuch</dt>
        <dd>1/0-20</dd>
        <dt>Smak</dt>
        <dd>1/0-20</dd>
        <dt>Węch</dt>
        <dd>1/0-20</dd>
        <dt>Dotyk</dt>
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
        <dt>Brak poczucia rzeczywistości i hipokryzja</dt>
        <dd>20/0-100</dd>
        <dt>Bojaźliwość</dt>
        <dd>20/0-100</dd>
        <dt>Próżność</dt>
        <dd>20/0-100</dd>
        <dt>Pycha (zawyżone poczucie własnej wartości)</dt>
        <dd>20/0-100</dd>
        <dt>
          Podłość, matactwa i chaos
          {/*Łagodność i ład wewnętrzny*/}
        </dt>
        <dd>20/0-100</dd>
        <dt>
          Brak rozsądku (umiejętności odróżniania dobra od zła)
          {/*Łagodność i ład wewnętrzny*/}
        </dt>
        <dd>20/0-100</dd>
      </dl>
    </div>
  );
}
