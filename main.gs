function myFunction(){
  let msg = '';
  const properties = PropertiesService.getScriptProperties();
  const gmailAddress = properties.getProperty('GMAIL_ADDRESS');
  const channel = properties.getProperty('CHANNEL');
  const iconUrl = properties.getProperty('ICON_URL');
  const username = properties.getProperty('USERNAME');

  if (eventList != '') {
    msg += '【本日の予定】\n' + listupEvent(gmailAddress);
  };

  if (msg === '') return;

  postSlack({
    'text': msg,
    'channel': channel,
    'icon_url': iconUrl,
    'username': username,
  });
};

const listupEvent = (gmailAddress) => {
  let eventList = '';
  const events = CalendarApp.getCalendarById(gmailAddress).getEventsForDay(new Date());

  for (let i = 0; i < events.length; i++) {
    let s = '';

    if (events[i].isAllDayEvent()) {
      s += Utilities.formatDate(events[i].getStartTime(), 'GMT+0900', 'MM/dd  ');
    } else {
      s += Utilities.formatDate(events[i].getStartTime(), 'GMT+0900', 'MM/dd HH:mm');
      s += Utilities.formatDate(events[i].getEndTime(), 'GMT+0900', '-HH:mm ');
    };

    s += events[i].getTitle();
    eventList += s + '\n';
  };

  return eventList;
};

const postSlack = (payload) => {
  const option = {
    'method': 'POST',
    'payload': JSON.stringify(payload),
  };
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('WEBHOOK_URL');

  UrlFetchApp.fetch(webhookUrl, option);
};
