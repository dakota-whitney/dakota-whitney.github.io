const props = PropertiesService.getScriptProperties();

const doGet = request => {
  doLog(request, "GET");
  return doServe(request);
};

const doPost = request => {
  doLog(request, "POST");
  return doServe(request);
};

const doServe = request => {
  let content = request.parameters;

  if(content.page) content = doPage(request.parameters);

  return ContentService.createTextOutput(JSON.stringify(content))
    .setMimeType(ContentService.MimeType.JSON);
};

const doPage = parameters => {
  switch(parameters.page[0]){
    case "about":
      return new YTPlaylist(parameters).playlist;
    default:
      return parameters;
  };
};

const doLog = (request, method) => {
  Logger.log({
    method: method,
    user: Session.getActiveUser().getEmail(),
    request: JSON.stringify(request),
  })
};