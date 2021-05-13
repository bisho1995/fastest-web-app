import { h, Component } from "preact";
// import style from './style.css';
import style from "./style.module.scss";
import podcastService from "../../service/Podcast/PodcastService";

const CACHE_NAME = "dynamic";

interface IPodcast {
  id: string;
  src: string;
  image: string;
  title: string;
  subtitle: string;
  duration: string;
  size: number;
}
interface Props {}
interface State {
  podcasts: IPodcast[];
}

export default class Home extends Component<Props, State> {
  state = {
    podcasts: [],
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
        this.setState({
          podcasts: await podcastService.getItemsFromFeed(cachedFeed),
        });
      }

      podcastService
        .fetchPodcasts((networkFeed) => {
          cache.put("/feed", networkFeed.clone());
        })
        .then((feeds) => {
          this.setState({ podcasts: feeds });
        });
    }
  }
  render() {
    const { podcasts } = this.state;
    return (
      <div class={style.home}>
        <h1 class={style["site-title"]}>
          <img
            src="https://cdn.glitch.com/6801d344-cd53-4f92-aedc-9202eb8d91c4%2Fhero.jpg?1538735805226"
            alt="HTTP 203 Podcast"
          />
        </h1>
        {podcasts.map((podcast: IPodcast) => {
          const { id, title, subtitle, image } = podcast;
          return (
            <div key={id} class="flex flex-row">
              <img src={image} width={100} height={100} />
              <div class="flex flex-col flex-1  ">
                <div
                  class="font-semibold leading-5"
                  onClick={() => {
                    podcastService.downloadPodcast(podcast);
                  }}
                >
                  {title}
                </div>
                <div>{subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
