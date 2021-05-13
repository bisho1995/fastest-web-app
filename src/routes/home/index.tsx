import { h, Component } from "preact";
// import style from './style.css';
import style from "./style.module.scss";

const CACHE_NAME = "dynamic";

interface IPodcast {
  id: string;
  src: string;
  image: string;
  title: string;
  subtitle: string;
  duration: string;
  size: number;
  state: "stored" | "not-stored";
  progress: number;
}
interface Props {}
interface State {
  podcasts: IPodcast[];
}

export default class Home extends Component<Props, State> {
  getItemsFromFeed = async (response: Response): Promise<IPodcast[]> => {
    const dom = new DOMParser().parseFromString(
      await response.text(),
      "text/xml"
    );
    const itemPromises: Promise<IPodcast[]> = Array.from(
      dom.querySelectorAll("item")
    ).map(async (domItem): Promise<IPodcast> => {
      const src = new URL(
        domItem.querySelector("enclosure")!.attributes.url.value
      );
      src.protocol = "https";
      const id = `podcast-${/\/([^\/]+)\.(mp3|m4a)($|\?)/.exec(src)[1]}`;
      const image = new URL(
        domItem.querySelector("image")!.getAttribute("href")!
      );
      image.protocol = "https";

      return {
        id,
        src: src.href,
        image: image.href,
        title: domItem.querySelector("title")!.textContent!,
        subtitle: domItem.querySelector("subtitle")!.textContent!,
        duration: domItem.querySelector("duration")!.textContent!,
        size: Number(
          domItem.querySelector("enclosure")!.getAttribute("length")
        ),
        state: await globalThis?.caches
          .has(id)
          .then((stored) => (stored ? "stored" : "not-stored")),
        progress: 0,
      };
    });

    return Promise.all(itemPromises);
  };
  async componentDidMount() {
    if (globalThis?.navigator?.storage?.persist) {
      globalThis.navigator.storage.persist().then((persistent) => {
        console.log(persistent);
      });

      const cache = await globalThis?.caches.open(CACHE_NAME);
      const cachedFeed = await cache?.match("/feed");

      if (cachedFeed) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ podcasts: await this.getItemsFromFeed(cachedFeed) });
      }

      const networkFeed = await fetch(
        "https://towering-traveling-sternum.glitch.me/feed"
      );
      if (networkFeed.ok) {
        cache.put("/feed", networkFeed.clone());
        const newItems = await this.getItemsFromFeed(networkFeed);

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ podcasts: newItems });
      }
    }
  }
  render() {
    console.log(this.state.podcasts);
    return (
      <div class={style.home}>
        <h1 class={style["site-title"]}>
          <img
            src="https://cdn.glitch.com/6801d344-cd53-4f92-aedc-9202eb8d91c4%2Fhero.jpg?1538735805226"
            alt="HTTP 203 Podcast"
          />
        </h1>
        <div>Some 1</div>
      </div>
    );
  }
}
