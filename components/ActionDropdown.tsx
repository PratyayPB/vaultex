import React from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Models } from "node-appwrite";
import { useState } from "react";
import { constructDownloadUrl } from "@/lib/utils";
import Link from "next/link";
import { Input } from "./ui/input";
import { renameFile, updateFileUsers } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import {FileDetails} from "./ActionsModalContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [action, setaction] = useState<ActionType | null>(null)
  const [name, setname] = useState(file.name)
  const [isLoading, setisLoading] = useState(second)
  const [emails, setemails] = useState<string[]>([])
  const path=usePathname()
  const closeAllModals=()=>{
    setisModalOpen(false)
    setisDropdownOpen(false)
    setaction(null)
    setname(file.name)
    //setEmails([])
  }

  const handleAction=async()=>{
    if(!action) return
    setisLoading(true)
    let success=false
    const actions={
      rename:()=>renameFile({fileId,name,extension,path,}:{fileId=file.$id,name,extension:file.extension,path}),
      share:()=>{updateFileUsers({fileId,emails,path}:{fileId:file.$id,emails,path})},
      delete:()=>{deleteFile({fileId,path,bucketFileId}:{fileId:file.$id,path,file.bucketFileId})}

    }
    success=await actions[action.value as keyof typeof actions]()
    if(success){
      closeAllModals()
    }
    setisLoading(false)

  }

  const handleRemoveUser=async({email}:{email:string})=>{
    const updatedEmails=emails.filter((e)=>e!==email)
    const success=await updateFileUsers({fileId:file.$id,emails:updatedEmails,path})
    if(!success) setemails(updatedEmails)
      closeAllModals()

  }
  const renderDialogContent=()=>{
    if(!action) return null

    const {value,label}=action
return ( <DialogContent className="shad-dialog button">
    <DialogHeader className="flex flex-col gap-3">
      <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
      {value==="rename" && (<Input type="text" value={name} onChange={(e)=>{setName(e.target.value)}}/>)}
      {value==="details" && (<FileDetails file={file}/>)}
      {value==="share" && (<ShareInput file={ file } onInputChange={setemails} onRemove={handleRemoveUser}/>)}
      {value==="delete" && (
        <p className="delete-confirmation">Are you sure you want to delete {` `} <span className="delete-file-name">{file.name}</span>?</p>
      )}
    </DialogHeader>
    {['rename','share','delete'].includes(value) && (
      <DialogFooter className="flex flex-col gap-3 md:flex-row">
        <Button onClick={closeAllModals} className="modal-cancel-button">Cancel</Button>
        <Button onClick={handleAction} className="modal-submit-button"><p className="capitalize">{value}</p>
        {isLoading && <Image src="assets/icons/loader.svg" width={24} height={24} className="animate-spin" alt="loader"/>}
        </Button>
      </DialogFooter>
    )}
  </DialogContent>)
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setisDropdownOpen}>
        <DropdownMenuTrigger asChild clasname="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-50 truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map(
            //import from index.ts
            (actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className="shad-dropdown=item"
                onClick={()={
                    setAction(actionItem)

                    if(["rename","share","delete","details"].includes(actionItem.value)){
                      setisModalOpen(true)
                    }
                }}

              >

              {ActionDidRevalidateDynamicOnly.value==="download"?  <Link href={constructDownloadUrl(file.bucketFileId)}
                download={file.name} className="flex items-center gap-2">
                  <Image src={actionItem.icon} width={30} height={30} alt={actionItem.label}/>
                  </Link>: <div className="flex items-center gap-2"><Image src={actionItem.icon} width={30} height={30} alt={actionItem.label}/></div> }


                {actionItem.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>

     { renderDialogContent() }
    </Dialog>
  );
};

export default ActionDropdown;
