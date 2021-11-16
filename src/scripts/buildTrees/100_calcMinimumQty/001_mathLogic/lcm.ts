import {gcd} from './gcd';
/**
 * 最小公倍数算出
 */
export const lcm = (a:number, b:number) => {
    return (a * b / gcd(a,b))
}