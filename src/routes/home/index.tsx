import { h, Component } from "preact";
// import style from './style.css';
import style from "./style.module.scss";
import podcastService from "../../service/Podcast/PodcastService";
import { IPodcast } from "../../Models/Podcast/Podcast";
import Podcast from "./components/Podcast";

const CACHE_NAME = "dynamic";

export interface IPodcastState extends IPodcast {
  state: "stored" | "not-stored";
  progress: number;
}
interface Props {}
interface State {
  podcasts: IPodcastState[];
  playing: IPodcastState | null;
}

const HERO_IMAGE =
  "https://cdn.glitch.com/6801d344-cd53-4f92-aedc-9202eb8d91c4%2Fhero.jpg?1538735805226";

export default class Home extends Component<Props, State> {
  state = {
    podcasts: [],
    playing: null,
  };
  cache: Cache | null;
  constructor() {
    super();

    this.cache = null;
  }
  private async _storePodcastResponseToState(response: Response) {
    const podcastsTmp = await podcastService.getItemsFromFeed(response);
    const podcasts = [];

    for (let i = 0; i < podcastsTmp.length; i++) {
      const p = podcastsTmp[i];
      const isPodcastStored = await podcastService.isPodcastStored(p);

      podcasts[i] = {
        ...podcastsTmp[i],
        state: isPodcastStored ? "stored" : "not-stored",
        progress: isPodcastStored ? 1 : 0,
      };
    }

    // @ts-ignore
    this.setState({ podcasts });
  }
  private async _getFeedsCache(): Promise<Cache> {
    if (this.cache) return this.cache;
    this.cache = await globalThis?.caches.open(CACHE_NAME);
    return this.cache;
  }

  async componentDidMount() {
    if (globalThis?.navigator?.storage?.persist) {
      globalThis.navigator.storage.persist().then((persistent) => {
        console.log(persistent);
      });

      /**
       * Load the cached feed first then load network feed
       * and replace the cache
       */
      this._loadCachedFeed();
      this._loadNetworkedFeed();
    }
  }
  private async _loadCachedFeed() {
    const cache = await this._getFeedsCache();
    const cachedFeed = await cache?.match("/feed");

    if (cachedFeed) {
      this._storePodcastResponseToState(cachedFeed);
    }
  }
  private async _loadNetworkedFeed() {
    const cache = await this._getFeedsCache();
    const podcastsResponse = await podcastService.fetchPodcasts();
    cache.put("/feed", podcastsResponse.clone());
    this._storePodcastResponseToState(podcastsResponse);
  }
  render() {
    const { podcasts, playing } = this.state;

    // @ts-ignore
    const src = playing?.src;
    return (
      <div class={style.home}>
        <h1 class={style["site-title"]}>
          <img src={HERO_IMAGE} alt="HTTP 203 Podcast" />
        </h1>
        {podcasts.map((podcast: IPodcastState) => {
          const { id, title, subtitle, image, state } = podcast;
          return (
            <Podcast
              key={id}
              title={title}
              image={image}
              subtitle={subtitle}
              state={state}
              onClick={() => {
                this.setState({ playing: podcast });
                if (state === "not-stored") {
                  podcastService.downloadPodcast(podcast);
                }
              }}
            />
          );
        })}
        {playing && (
          <div id={style.player} class="sticky bottom-0 flex justify-center">
            <audio controls autoPlay crossOrigin="true" src={src} />
          </div>
        )}
      </div>
    );
  }
}
