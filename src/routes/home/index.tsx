import { FunctionalComponent, h } from "preact";
// import style from './style.css';
import style from "./style.module.scss";

export default function Home() {
  return (
    <div class={style.home}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
    </div>
  );
}
