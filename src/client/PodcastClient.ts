import BaseClient from "./BaseClient";

class PodcastClient extends BaseClient {
  private static readonly PODCAST_URL =
    "https://towering-traveling-sternum.glitch.me/feed";
  async fetchPodcasts(): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.get(PodcastClient.PODCAST_URL)
        .then((resp) => {
          if (resp.ok) {
            return resolve(resp);
          }

          return reject(new Error("Fetch Error"));
        })
        .catch(reject);
    });
  }
}

export default new PodcastClient();
