function timeDifference(current, previous){
  //constants for converting time in milliseconds to years, months, days, hours
  //milliseconds per minute
  const milliSecondsPerMinute = 60 * 1000;
  //milliseconds per hour
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  //milliseconds per day
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  //milliseconds per Month (30 days)
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  //milliseconds per year (365 days)
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  //elapsed time in milliseconds
  const elapsed = current - previous;

  //if less than 1/3 of a minute
  if(elapsed < milliSecondsPerMinute / 3){
    //return just now
    return " " + "just now";
  } else if(elapsed < milliSecondsPerMinute){
    //return less than a minute ago
    return " " + "less than 1 minute ago";
  } else if(elapsed < milliSecondsPerHour){
    //return rounded number of minutes 
    return " " + Math.round(elapsed / milliSecondsPerMinute) + " min ago";
  } else if(elapsed < milliSecondsPerDay){
    //return rounded number of hours
    return " " + Math.round(elapsed / milliSecondsPerHour) + "h ago";
  } else if(elapsed < milliSecondsPerMonth){
    //return rounded number of days
    if(Math.round(elapsed/milliSecondsPerDay) === 1){
      //one day ago
      return " " + 1 + " day ago";
    } else { 
      //multiple days ago
      return " " + Math.round(elapsed / milliSecondsPerDay) + " days ago";
    }
  } else if(elapsed < milliSecondsPerYear){
    //return rounded number of months
    return " " + Math.round(elapsed / milliSecondsPerMonth);
  } else {
    // more than a year ago
    if(Math.round(elapsed/milliSecondsPerYear) === 1){
      // ~1 year ago
      return " " + 1 + " year ago";
    } else {
      // >2 years ago
      return ' ' + Math.round(elapsed/milliSecondsPerYear) + ' years ago';
    }
  }
}

//export function, call timeDifference function
export function timeDifferenceForDate(date){
  //get current time
  const current = new Date().getTime();
  //get time posted (date arg)
  const previous = new Date(date).getTime();
  //return time difference string
  return timeDifference(current, previous);
}