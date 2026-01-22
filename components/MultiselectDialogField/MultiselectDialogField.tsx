"use client";
import { MessageSquareQuote } from "lucide-react";
import {
  cloneElement,
  createContext,
  Dispatch,
  isValidElement,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Input } from "../ui/input";
import Modal from "../Modal/Modal";

interface Props {
  title?: string;
  label?: string;
  children: ReactNode;
  getValue?: (data: any) => string;
  value?: any;
  onChange?: (v: any) => void;
  fetchFirst?: boolean;
}

interface ISelectItem {
  id: string;
  meta?: any;
}

interface IDialogContext {
  onChange?: (value: any) => void;
  selectItem: ISelectItem[];
  setSelectItem: Dispatch<SetStateAction<ISelectItem[]>>;
  multiselectLov: boolean;
}

export const MultiselectDialogContext = createContext<IDialogContext>({
  selectItem: [],
  setSelectItem: () => {},
  multiselectLov: true,
});

const MultiselectDialogField = ({
  children,
  label,
  title = label,
  getValue,
  value = [],
  onChange,
  ...rest
}: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [selectItem, setSelectItem] = useState<ISelectItem[]>(value);

  const shouldFetch = rest.fetchFirst || openModal;

  const onClickHanlder = () => {
    setOpenModal(true);
  };

  const resolvedValue = selectItem
    ?.map((item: { id?: string; name?: string }) => item?.name)
    ?.join(" , ");

  const resolvedChildren = isValidElement(children)
    ? cloneElement(children as any, {
        enabled: shouldFetch,
      })
    : children;

  return (
    <>
      <div onClick={onClickHanlder} className="relative w-full">
        <Input
          {...rest}
          className="caret-transparent focus-visible:ring-0 w-full cursor-auto p-5 pr-12"
          value={getValue ? getValue?.(value) : resolvedValue}
          readOnly
        />
        <MessageSquareQuote className="absolute right-1 top-1/2 -translate-y-1/2 bg-secondary hover:shadow duration-200 text-white p-1 rounded-lg w-8 h-8 cursor-pointer" />
      </div>

      <Modal
        className="overflow-scroll"
        title={title}
        onOpenChange={setOpenModal}
        open={openModal}
        onAction={() => {
          setOpenModal(false);
        }}
        width="md:max-w-5xl"
      >
        <MultiselectDialogContext.Provider
          value={{ selectItem, setSelectItem, multiselectLov: true, onChange }}
        >
          {resolvedChildren}
        </MultiselectDialogContext.Provider>
      </Modal>
    </>
  );
};

export default MultiselectDialogField;
