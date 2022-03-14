import { FormikValues } from './FormikValues.model';
import { WisdomObj } from './WisdomObj.model';

export interface HandleEditArgs {
  values: FormikValues;
  storedWisdoms: WisdomObj[];
  wisdomid: string;
  setShowEdit: (value: boolean) => void;
}
