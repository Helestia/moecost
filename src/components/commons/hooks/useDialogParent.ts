import React from 'react';

/**
 * useDialogParent : ダイアログ呼出元のコンポーネントで使用。
 */
type tUseDialogParentReturn = {
    isOpen:boolean,
    handleOpen: () => void,
    handleClose: () => void
};
type tUseDialogParent = () => tUseDialogParentReturn;
export const useDialogPearent:tUseDialogParent = () => {
    const [isOpen,setIsOpen] = React.useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return {
        isOpen: isOpen,
        handleOpen: handleOpen,
        handleClose: handleClose
    }
}

export default useDialogPearent;
