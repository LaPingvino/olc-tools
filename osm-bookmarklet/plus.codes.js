input=location.href.match(/[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{0,3}/).toString();
location.href= "https://www.openstreetmap.org/search?query=" + OpenLocationCode.decode(input).latitudeCenter + ",%20" + OpenLocationCode.decode(input).longitudeCenter;
