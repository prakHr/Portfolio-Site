import yt_dlp


def download_mp3(url):
    ydl_opts = {
        "format": "bestaudio/best",

        "outtmpl": "%(title)s.%(ext)s",

        # Use Deno for YouTube's JavaScript challenges
        "js_runtimes": {
            "deno": {}
        },

        # Convert downloaded audio to MP3
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],

        "noplaylist": True,
        "quiet": False,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

    except yt_dlp.utils.DownloadError as e:
        print(f"\nDownload failed:\n{e}")


song = "fZYz0sotJWk"

download_mp3(
    f"https://www.youtube.com/watch?v={song}"
)
