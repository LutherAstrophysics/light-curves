import { fluxToMagnitude, daysSinceBeginning } from "utils";

export async function copyLCData({data, setCopying}){
    const header = ['Date', 'DayNo', 'Magnitude']
    const starData = data.reduce((p, c) => [...p, [c.date, daysSinceBeginning(c.date),  fluxToMagnitude(c.flux)]], [header])
    const starDataTxt = starData.map(x => x.join('\t')).join('\r\n')
    if (document){
         var input = document.createElement('textarea');
        input.innerHTML = starDataTxt;
        await document.body.appendChild(input);
        input.select();
        var result = await document.execCommand('copy');
        setTimeout(() => setCopying(false), 400)
    }
}
