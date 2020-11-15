



export const numDeform = (num:number) => {
	return (Math.round(Number(num)*100) / 100).toString().replace(/(\d)(?=(?:\d{3}){2,}(?:\.|$))|(\d)(\d{3}(?:\.\d*)?$)/g, '$1$2,$3');
}