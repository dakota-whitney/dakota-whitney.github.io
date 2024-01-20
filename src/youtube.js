class YTPlaylist {
  constructor(query = {pl: ["LL"], meta: [], size: [10]}){
    this.id = query.pl ? query.pl[0] : "LL";
    this.size = query.size ? query.size[0] : 10;

    const {items: playlist} = getPlaylist(this.id, this.size);
    this.playlist = playlist.map(({snippet}) => {
      Logger.log(snippet);

      const vMeta = {
        videoId: snippet.resourceId.videoId,
        title: snippet.title,
        artist: snippet.videoOwnerChannelTitle.replace(/\s+\-\s+Topic/, ""),
        thumbnails: snippet.thumbnails,
      };

      if(!query.meta) return vMeta;  
      else if(query.meta.includes("description")) vMeta.description = snippet.description;

      return vMeta;
    })
  }
};

const getPlaylist = (id, size) => YouTube.PlaylistItems.list("snippet", {
  playlistId: id,
  maxResults: size <= 50 ? size : 50,
});

const logLikes = () => console.log(new YTPlaylist({meta: ["description"]}).playlist);