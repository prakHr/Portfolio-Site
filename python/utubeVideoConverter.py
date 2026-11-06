import yt_dlp
song_id = "cO_5pZDqtBs"
url = f"https://www.youtube.com/watch?v={song_id}"

options = {
    "format": "bestaudio[ext=webm]",
    "outtmpl": "%(title)s.%(ext)s",
}

with yt_dlp.YoutubeDL(options) as ydl:
    ydl.download([url])
