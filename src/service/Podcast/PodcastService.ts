import BaseService from "../BaseService";
import podcastClient from "../../client/PodcastClient";
import { IPodcast } from "../../Models/Podcast/Podcast";

class PodcastService extends BaseService {
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
