export function fluxToMagnitude(flux, pixel=4){
    if (pixel === 4)
        return 24.176 - 2.6148*Math.log10(flux) 
    else
        return "NOT IMPLEMENTED"
}
