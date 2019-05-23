let input=prompt("Enter OLC:");
let c = OpenLocationCode.decode(input);
location.href= "https://www.openstreetmap.org/search?query=" + c.latitudeCenter + ",%20" + c.longitudeCenter;
