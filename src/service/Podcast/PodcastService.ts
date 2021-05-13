import BaseService from "../BaseService";
import podcastClient from "../../client/PodcastClient";
import { IPodcast } from "../../Models/Podcast/Podcast";

class PodcastService extends BaseService {
  private abortControllers = new Map<string, AbortController>();
  public async isPodcastStored(podcast: IPodcast): Promise<Boolean> {
    const cache = await window.caches.open("podcasts");
    return !!(await cache.match(podcast.src));
  }
  public async downloadPodcast(podcast: IPodcast) {
    const cache = await window.caches.open("podcasts");
    if (await window.caches.has("podcasts")) {
      if (await cache.match(podcast.src)) {
        return await cache.match(podcast.src);
      }
    }

    const controller = new AbortController();
    const { signal } = controller;
    this.abortControllers.set(podcast.id, controller);

    try {
      const response = await fetch(podcast.src, { signal });
      let chunks: Uint8Array[] = [];
      let downloaded = 0;
      let lastUpdated = 0;
      const reader = response.body?.getReader();
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        downloaded += value?.length || 0;
        value && chunks.push(value);
        const now = Date.now();
        const progress = downloaded / podcast.size;
        if (now - lastUpdated > 500 || progress === 1) {
          lastUpdated = now;
        }
        console.log(`Progress: ${progress}`);

        const resp = new Response(new Blob(chunks), {
          headers: response.headers,
        });
        cache.put(podcast.src, resp);
        return resp;
      }
    } catch (error) {
      console.error(
        `There was an error downloading the podcast ${podcast.title}`,
        error
      );
    }
  }
  public async getItemsFromFeed(response: Response): Promise<IPodcast[]> {
    const dom = new DOMParser().parseFromString(
      await response.text(),
      "text/xml"
    );
    // @ts-ignore
    const itemPromises: Promise<IPodcast[]> = Array.from(
      dom.querySelectorAll("item")
    ).map(async (domItem): Promise<IPodcast> => {
      const src = new URL(
        // @ts-ignore
        domItem.querySelector("enclosure")!.attributes.url.value
      )!;
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
      };
    });

    return await Promise.all(itemPromises);
  }
  public async fetchPodcasts(
    onGotPodcast?: (response: Response) => void
  ): Promise<IPodcast[]> {
    return new Promise((resolve, reject) => {
      podcastClient
        .fetchPodcasts()
        .then(async (resp) => {
          onGotPodcast && onGotPodcast(resp);
          const items = await this.getItemsFromFeed(resp);

          resolve(items);
        })
        .catch(reject);
    });
  }
}

export default new PodcastService();
