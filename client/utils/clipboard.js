import { fluxToMagnitude, daysSinceBeginning } from "utils";

export async function copyLCData({data}){
    const header = ['Date', 'DayNo', 'Magnitude']
    const starData = data.reduce((p, c) => [...p, [c.date, daysSinceBeginning(c.date),  fluxToMagnitude(c.flux)]], [header])
    const starDataTxt = starData.map(x => x.join('\t')).join('\r\n')
    if (document){
         var input = document.createElement('textarea');
        input.innerHTML = starDataTxt;
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        alert("Copied")
    }
}
