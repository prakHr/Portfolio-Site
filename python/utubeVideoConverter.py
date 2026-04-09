import yt_dlp

def download_mp3(url):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': '%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

id_list = [
    # 'UG0FwNfB8SQ',
    'fFCBJDqMEm8'
]
for song in id_list:
    download_mp3(f"https://www.youtube.com/watch?v={song}")
