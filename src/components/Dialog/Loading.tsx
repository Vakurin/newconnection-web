import * as React from "react";
import { XIcon } from "@heroicons/react/solid";
import { DisclosureState } from "ariakit";
import { Dialog, DialogDismiss, DialogHeading } from "ariakit/dialog";
import classNames from "classnames";

interface LoadingDialogProps {
    dialog: DisclosureState;
    title: string | React.ReactNode | null;
    children: React.ReactNode;
    className?: string;
}

export const LoadingDialog = ({ dialog, title, className, children }: LoadingDialogProps) => {
    return (
        <Dialog
            state={dialog}
            className={classNames("dialog", className)}
            hideOnInteractOutside={false}
            hideOnEscape={false}
        >
            <header className="font-exo relative flex items-center justify-between text-lg font-medium">
                <DialogHeading>{title}</DialogHeading>
            </header>
            <div className="mt-4">{children}</div>
        </Dialog>
    );
};