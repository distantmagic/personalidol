// @flow

import * as React from "react";

import Character from "../framework/classes/Entity/Person/Character";

type Props = {|
  character: Character
|};

export default function HudModalCharacterBiography(props: Props) {
  return (
    <div className="dd-tp__formatted-text">
      <p>
        Młoda, inteligentna, piękna. Wychowana tylko do tego, żeby trafić do
        pałacu jako luksusowa niewolnica, do czego faktycznie ma wszystkie
        predyspozycje. Większość życia spędziła w wygodzie, dlatego nie ma
        dobrej kondycji.
      </p>
      <p>
        Nigdy nie akceptowała do końca swego losu, mimo, że w gruncie rzeczy
        oferował komfort (i względną beztroskę) i zawsze w miarę możliwości
        zakradała się do biblioteki, żeby dowiedzieć się czegoś o świecie
        przynajmniej w ten sposób. Zawsze liczyła na to, że może kiedyś będzie
        miała okazję wyrwać się  i sama o siebie zadbać, a wtedy każda wiedza
        może się przydać.
      </p>
      <p>
        Podejrzanie mocno interesuje się czarnymi kotami i kurzymi łapkami, a
        nocą podczas podróży często patrzy w gwiazdy. Moore wydaje się czasami
        podejrzewać ją o czarną magię, ale ona parska śmiechem, kiedy zauważa
        takie niedorzeczne sugestie.
      </p>
    </div>
  );
}
