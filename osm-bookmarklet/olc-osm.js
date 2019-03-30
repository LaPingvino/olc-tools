input=prompt("Enter OLC:");
location.href= "https://www.openstreetmap.org/search?query=" + OpenLocationCode.decode(input).latitudeCenter + ",%20" + OpenLocationCode.decode(input).longitudeCenter;
