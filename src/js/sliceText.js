export const sliceText = (text, maxLength) => {
return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}