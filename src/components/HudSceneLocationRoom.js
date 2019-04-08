// @flow

import * as React from "react";

type Props = {||};

export default function HudSceneLocationRoom(props: Props) {
  return (
    <div className="dd__scene dd__scene--hud dd__scene--text">
      <article>
        <div className="dd-tp__formatted-text">
          <h1>Komnata mnicha u zbocza góry</h1>
          <p>
            Pustelnik odsłania przed tobą zasłonę oddzielającą komnatę od reszty
            tunelu. Wchodzi do środka i siada na niewielkim stołeczku, milczy.
            Daje ci tym samym chwilę, żebyś mógł przyzwyczaić się do nowego
            miejsca. Gestem zaprasza cię, żebyś rozejrzał się, czeka spokojnie
            na pytania.
          </p>
          <p>
            Masz przed sobą niezbyt obszerną, skromnie wyposażoną komnatę. Na
            pierwszy rzut oka wszystkie przybory, które się w niaj znajdują
            stanowią tylko absolutne minimum potrzebne do ascetycznego życia
            mnicha-zielarza. Nie ma tu nic, ponad to co niezbędne, ale nawet ta
            ascetyczna prostota w porównaniu z obszernym pustkowiem na zewnątrz
            jest dla ciebie jak bogaty pałacyk.
          </p>
        </div>
        <h2 className="dd-tp__heading-h2">Dostępne interakcje</h2>
        <table className="dd__table">
          <thead>
            <tr>
              <th rowSpan="2" scope="col">
                Encja
              </th>
              <th rowSpan="2">Stan</th>
              <th colSpan="6" scope="col">
                Działanie
              </th>
            </tr>
            <tr>
              <th scope="col">Rozmowa</th>
              <th scope="col">Brutalna siła</th>
              <th scope="col">Czar</th>
              <th scope="col">Modlitwa</th>
              <th scope="col">Ekwipunek</th>
              <th scope="col">Umiejętność specjalna</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Legowisko</td>
              <td>Wolne</td>
              <td />
              <td>Zniszcz</td>
              <td />
              <td>Rozpocznij modlitwę</td>
              <td />
              <td />
            </tr>
            <tr>
              <td rowSpan="2">Mnich</td>
              <td rowSpan="2">Zdrowy</td>
              <td rowSpan="2">Rozmawiaj</td>
              <td>Znęcaj się</td>
              <td rowSpan="2" />
              <td rowSpan="2">Rozpocznij wspólną modlitwę</td>
              <td rowSpan="2" />
              <td rowSpan="2" />
            </tr>
            <tr>
              <td>Zabij</td>
            </tr>
            <tr>
              <td>Palenisko</td>
              <td>Płonie</td>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td>Zgaś</td>
            </tr>
            <tr>
              <td rowSpan="2">
                Regał z książkami, notatkami, pudełkami, szkatułkami, słoikami
              </td>
              <td>Zamek nie zablokowany</td>
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2" />
            </tr>
            <tr>
              <td>Zamknięty</td>
            </tr>
            <tr>
              <td rowSpan="2">
                Szafka z ziołami
                {/*
                  <ol>
                    <li>
                      Piołun
                    </li>
                  </ol>
                */}
              </td>
              <td>Zamek nie zablokowany</td>
              <td rowSpan="2" />
              <td rowSpan="2">Zniszcz</td>
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2">Zabierz zawartość</td>
              <td rowSpan="2" />
            </tr>
            <tr>
              <td>Zamknięta</td>
            </tr>
            <tr>
              <td rowSpan="2">Zapasowe latarki</td>
              <td>Działające</td>
              <td rowSpan="2" />
              <td rowSpan="2">Zniszcz</td>
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2">Zabierz</td>
              <td rowSpan="2" />
            </tr>
            <tr>
              <td>Wyłączone</td>
            </tr>
            <tr>
              <td rowSpan="2">Zapasowe pochodnie</td>
              <td>Gotowe do zapalenia</td>
              <td rowSpan="2" />
              <td rowSpan="2">Zniszcz</td>
              <td rowSpan="2" />
              <td rowSpan="2" />
              <td rowSpan="2">Zabierz</td>
              <td rowSpan="2" />
            </tr>
            <tr>
              <td>Zgaszone</td>
            </tr>
            <tr>
              <td>Zasłona przysłaniająca wejście do tunelu</td>
              <td>Odsłonięta</td>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  );
}
