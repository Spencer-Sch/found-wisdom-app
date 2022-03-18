export interface FormikValues {
  source: string;
  text: string;
}

// export interface EditedWisdom {
//   wisdomData: {
//     date: string;
//     id: string;
//     next: boolean;
//     source: string;
//     text: string;
//   };
// }
export interface EditedWisdom {
  id: string;
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
  currentWisdom: WisdomObj;
}

export type HandleEdit = (
  values: FormikValues,
  currentWisdom: WisdomObj
) => WisdomObj;
