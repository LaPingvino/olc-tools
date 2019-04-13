loc=location.href.match(/(1?[0-9])\/(-?[0-9]+\.?[0-9]*)\/(-?[0-9]+\.[0-9]*)/);
zl=10;
if (loc[1]==19) zl=11;
if (loc[1]<14) zl=8;
if (loc[1]<8) zl=6;
if (loc[1]<5) zl=4;
olc=OpenLocationCode.encode(loc[2],loc[3],zl);
alert(olc);
