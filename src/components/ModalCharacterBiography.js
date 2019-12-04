// @flow

import * as React from "react";

import Character from "../framework/classes/Entity/Person/Character";

type Props = {|
  character: Character,
|};

export default function ModalCharacterBiography(props: Props) {
  return (
    <div className="dd-tp__formatted-text">
      <blockquote>
        Duch kędy chce wieje, i głos jego słyszysz, ale nie wiesz skąd idzie, albo gdzie odchodzi.
        <footer>Jan 3:7</footer>
      </blockquote>
      <p>
        Młoda, inteligentna, piękna. Wychowana tylko do tego, żeby trafić do pałacu jako luksusowa niewolnica, do czego faktycznie ma wszystkie predyspozycje. Większość życia
        spędziła w wygodzie, dlatego nie ma dobrej kondycji.
      </p>
      <p>
        Nigdy nie akceptowała do końca swego losu, mimo, że w gruncie rzeczy oferował komfort (i względną beztroskę) i zawsze w miarę możliwości zakradała się do biblioteki, żeby
        dowiedzieć się czegoś o świecie przynajmniej w ten sposób. Zawsze liczyła na to, że może kiedyś będzie miała okazję wyrwać się  i sama o siebie zadbać, a wtedy każda wiedza
        może się przydać.
      </p>
      <p>
        Podejrzanie mocno interesuje się czarnymi kotami i kurzymi łapkami, a nocą podczas podróży często patrzy w gwiazdy. Moore wydaje się czasami podejrzewać ją o czarną magię,
        ale ona parska śmiechem, kiedy zauważa takie niedorzeczne sugestie.
      </p>
      <p>
        Irure dolor cillum dolore excepteur incididunt dolor enim dolor eiusmod sit enim sed commodo elit in ut fugiat officia dolor dolore sunt dolore. Deserunt ut dolor anim
        consectetur cupidatat velit velit non enim fugiat voluptate ut pariatur consequat qui dolor magna nostrud consectetur duis. labore culpa ut dolore excepteur mollit velit in
        consectetur officia fugiat esse dolor dolore sunt id anim reprehenderit dolor dolor aute labore ut deserunt voluptate ullamco aute eu sit tempor non sint eiusmod enim esse
        nisi culpa ut adipisicing tempor veniam sit adipisicing nostrud
      </p>
      <p>
        consequat voluptate exercitation laborum ut esse labore consequat duis exercitation ut minim qui sit excepteur velit exercitation et in voluptate anim do dolore culpa ut
        consectetur in pariatur laboris non commodo velit anim dolore ex eiusmod anim enim pariatur nostrud aliqua fugiat anim aliqua ea ullamco aute reprehenderit ullamco quis
        anim non pariatur ad sed veniam pariatur proident dolore aute eiusmod do consectetur laboris ea irure consequat dolor amet magna consequat dolor sed sint qui officia eu
        cillum ut ut consectetur aliqua adipisicing.
      </p>
    </div>
  );
}
