export function createAudio(src) {
  return new Audio(src);
}

export function stopAudio(audio) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}
