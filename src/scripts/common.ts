
export const cloneObj_JSON: <T>(obj:T) => T = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

export const numDeform = (num:number) => {
	return (Math.round(Number(num)*100) / 100).toString().replace(/(\d)(?=(?:\d{3}){2,}(?:\.|$))|(\d)(\d{3}(?:\.\d*)?$)/g, '$1$2,$3');
}

export const downloadTextFileProsess = (downloadObject:any, fileName:string) => {
    const downloadContent = JSON.stringify(downloadObject);
    const blob = new Blob([downloadContent], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const elementA = document.createElement("a");
    elementA.download = fileName;
    elementA.href = url;
    elementA.click();
    elementA.remove();
    URL.revokeObjectURL(url);
}
