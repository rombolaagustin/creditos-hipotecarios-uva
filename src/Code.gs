function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Simulador Créditos Hipotecarios UVA')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
