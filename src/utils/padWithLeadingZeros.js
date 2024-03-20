export default function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}
