import { h } from "preact";

export function MainMenuScreen() {
  return (
    <main class="main-menu">
      <div class="main-menu__content">
        <h1 class="main-menu__title">Personal Idol</h1>
        <h2 class="main-menu__title-sub">Apocalyptic Adventure</h2>
        <nav class="main-menu__nav">
          <button disabled>Continue</button>
          <button>New Game</button>
          <button disabled>Load Game</button>
          <button disabled>Options</button>
          <button disabled>Credits</button>
        </nav>
      </div>
    </main>
  );
}
