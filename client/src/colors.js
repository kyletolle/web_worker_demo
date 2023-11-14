const colorApiUrl = 'https://kyletolle-random-color-api.deno.dev/'

let numberOfColorsToGenerate = 0;
let isFetchInProgress = false;

onmessage = e => {
  numberOfColorsToGenerate++;
  fetchColors();
}

const fetchColors = async () => {
  if (isFetchInProgress) {
    return;
  }

  isFetchInProgress = true;
  while(numberOfColorsToGenerate > 0) {
    const response = await fetch(colorApiUrl);
    if (!response.ok) {
      console.error('Error fetching color', response);
      numberOfColorsToGenerate--;
      continue;
    }

    // Need to read the color from the page body as text
    const color = await response.text();
    // console.info('Color received from API', color);
    postMessage(color);
    numberOfColorsToGenerate--;
  }
  isFetchInProgress = false;
}
