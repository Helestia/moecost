/**
 * 最大公約数算出
 */
export const gcd = (a:number, b:number) => {
    let t = 0
    while (b !== 0){
        t = b;
        b = a % b;
        a = t
    }
    return a
}