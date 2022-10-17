import { formatAddress } from "utils";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export const CopyTextButton = ({ copyText }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleClick = () => {
        setIsCopied(true);
        navigator.clipboard.writeText(copyText).then().catch();

        setTimeout(() => {
            setIsCopied(false);
        }, 500);
    };

    return (
        <div className={"flex text-base-content hover:text-base-content/50 hover:cursor-pointer"} onClick={handleClick}>
            {formatAddress(copyText)}
            {isCopied ? <CheckIcon className="h-6 w-5" /> : <ClipboardIcon className="h-6 w-5" />}
        </div>
    );
};
