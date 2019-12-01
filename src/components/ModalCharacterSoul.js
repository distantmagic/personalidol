// @flow

import * as React from "react";

import Character from "../framework/classes/Entity/Person/Character";

type Props = {|
  character: Character,
|};

export default function ModalCharacterSoul(props: Props) {
  return (
    <div className="dd__modal__character__attributes">
      <blockquote className="dd-tp__blockquote">
        Bezbożni zaś są jak morze wzburzone, które się nie może uciszyć i którego fale wyrzucają muł i błoto.
        <footer>Iz 57:20</footer>
      </blockquote>
      <dl className="dd__modal__character__specifics dd__modal__character__specifics--soul">
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
        <dt>Rozpusta i nieczystość</dt>
        <dd>20/0-100</dd>
        <dt>Chciwość</dt>
        <dd>20/0-100</dd>
        <dt>Materializm</dt>
        <dd>20/0-100</dd>
        <dt>Brak poczucia rzeczywistości i hipokryzja</dt>
        <dd>20/0-100</dd>
        <dt>Bojaźliwość</dt>
        <dd>20/0-100</dd>
        <dt>Próżność</dt>
        <dd>20/0-100</dd>
        <dt>Pycha (zawyżone poczucie własnej wartości)</dt>
        <dd>20/0-100</dd>
        <dt>Podłość, matactwa i chaos</dt>
        <dd>20/0-100</dd>
        <dt>Brak rozsądku (umiejętności odróżniania dobra od zła)</dt>
        <dd>20/0-100</dd>
      </dl>
    </div>
  );
}
