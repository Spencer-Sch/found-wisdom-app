export interface FormikValues {
  source: string;
  text: string;
}

export interface WisdomObj {
  id: string;
  source: string;
  date: string;
  text: string;
  next: boolean;
}

export interface HandleEditArgs {
  values: FormikValues;
  storedWisdoms: WisdomObj[];
  wisdomid: string;
  setShowEdit: (value: boolean) => void;
}
