import {lcm} from './lcm';

/**
 * 配列要素の最小公倍数算出
 * lcmArray([a,b,c]) = lcm(a , lcm(b, c))
 */
export const lcmArray:(args:number[]) => number = (args) => {
    if(args.length === 0) return 1;
    if(args.length === 1) return args[0];
    if(args.length === 2) return lcm(args[0], args[1]);
    const args0 = args[0];
    const nextArgs = args.filter((a,i) => i !== 0);
    return lcm(args0,lcmArray(nextArgs));
}