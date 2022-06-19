//https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg
//${format?format:'original'}/
export function makeImagePath(id: string, format?:string) {
    return `https://image.tmdb.org/t/p/${format?format:'original'}/${id}`
}