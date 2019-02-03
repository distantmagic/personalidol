// @flow

import * as React from "react";

type Props = {||};

type State = {||};

export default class HudScene extends React.Component<Props, State> {
  render() {
    return (
      <div className="dd__scene dd__scene--hud dd__scene--text">
        <article>
          <div className="dd-tp__formatted-text">
            <h1>
              Komnata mnicha u zbocza góry
            </h1>
            <p>
              Pustelnik odsłania przed tobą zasłonę oddzielającą komnatę od
              reszty tunelu. Wchodzi do środka i siada na niewielkim stołeczku,
              milczy. Daje ci tym samym chwilę, żebyś mógł przyzwyczaić się do
              nowego miejsca. Gestem zaprasza cię, żebyś rozejrzał się, czeka
              spokojnie na pytania.
            </p>
            <p>
              Masz przed sobą niezbyt obszerną, skromnie wyposażoną komnatę.
              Na pierwszy rzut oka wszystkie przybory, które się w niaj
              znajdują stanowią tylko absolutne minimum potrzebne do
              ascetycznego życia mnicha-zielarza.
              Nie ma tu nic, ponad to co niezbędne, ale nawet ta ascetyczna
              prostota w porównaniu z obszernym pustkowiem na zewnątrz jest dla
              ciebie jak bogaty pałacyk.
            </p>
          </div>
          <h2 className="dd-tp__heading-h2">
            Dostępne interakcje
          </h2>
          <table className="scene__interactions">
            <thead>
              <tr>
                <th
                  className="scene__interactions__entity-header"
                  rowSpan="2"
                  scope="col"
                >
                  Encja
                </th>
                <th
                  colSpan="6"
                  scope="col"
                >
                  Działanie
                </th>
              </tr>
              <tr>
                <th
                  className="scene__interactions__interaction-header"
                  scope="col"
                >
                  Rozmowa
                </th>
                <th
                  className="scene__interactions__interaction-header"
                  scope="col"
                >
                  Brutalna siła
                </th>
                <th
                  className="scene__interactions__interaction-header"
                  scope="col"
                >
                  Czar
                </th>
                <th
                  className="scene__interactions__interaction-header"
                  scope="col"
                >
                  Modlitwa
                </th>
                <th
                  className="scene__interactions__interaction-header"
                  scope="col"
                >
                  Ekwipunek
                </th>
                <th
                  className="scene__interactions__interaction-header"
                  scope="col"
                >
                  Umiejętność specjalna
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Legowisko
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Mnich
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Palenisko
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Regał z książkami, notatkami, pudełkami, szkatułkami, słoikami
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Szafka z ziołami
                  {/*
                    <ol>
                      <li>
                        Piołun
                      </li>
                    </ol>
                  */}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Zapasowe latarki
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Zapasowe pochodnie
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  Zasłona przysłaniająca wejście do tunelu
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    );
  }
}
