const oneDay = 24 * 60 * 60 * 1000; 
const timeleft = Math.abs(new Date("2022/01/10 20:55") - new Date());
const dayleft = Math.floor(timeleft/oneDay); 

var minuteleft = Math.floor(((timeleft % oneDay) % 3600000) / 60000) + Math.floor(timeleft / oneDay) * 24 * 60 + Math.floor((timeleft % oneDay) / 3600000) * 60;
var hourleft = Math.floor(minuteleft / 60);

var currentleft2 = (new Date - new Date("2021/12/22 15:00"));
var new_minute = Math.round(((currentleft2 % oneDay) % 3600000) / 60000) + Math.floor(currentleft2 / oneDay) * 24 * 60 + Math.floor((currentleft2 % oneDay) / 3600000) * 60;
if (dayleft >= 1 && dayleft <= 3) {
        console.log("Day "+dayleft);
}
else if (dayleft == 0) {
        if (hourleft > 0)
                console.log("Hour "+hourleft);
        else {
                console.log("minute" +minuteleft);
        }
}
else
        console.log(timeleft);