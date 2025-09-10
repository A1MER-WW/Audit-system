export const nowThaiBuddhist = () => {
  const now = new Date();
  const d = now.getDate().toString().padStart(2, "0");
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const y = now.getFullYear() + 543;
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${d}/${m}/${y} ${hh}:${mm} น.`;
};
// Thai Buddhist calendar timestamp like: 20/06/2568 14:00 น.