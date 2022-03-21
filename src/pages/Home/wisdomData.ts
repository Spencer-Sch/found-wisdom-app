import { v4 as uuidv4 } from 'uuid';

import { format } from 'date-fns';

import { WisdomData } from '../../models/models';

//////////////////////////////////////////
// THIS FILE IS FOR DEVELOPMENT ONLY
//////////////////////////////////////////

export const wisdomData: WisdomData[] = [
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'Jako Wilink',
    text: 'Discipline = freedom',
    next: true,
  },
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'Jako Wilink',
    text: 'Don\'t focus on what you want to "be"; Focus on what you want to "do"',
    next: false,
  },
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'unknown',
    text: 'Instead of worrying about everything; pray about everything.',
    next: false,
  },
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'Tim Pool',
    text: 'Life is like a teadmill: stand still and you go backwards, walk and you stay in the same place. You have to RUN to make progress.',
    next: false,
  },
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'Pastor Per',
    text: 'In order for the vine to produce good, high quality produce there must be a process of pruning away unnecessary material.',
    next: false,
  },
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'Pastor Booba',
    text: "Your path through Egypt is not meant to break you, but to make you; not to challenge you, but to change you. Don't focus on WHY I am going through this, but HOW am I going through this.",
    next: false,
  },
  {
    id: uuidv4(),
    date: format(new Date(), 'MMM dd, yyyy'),
    source: 'Pastor Booba',
    text: "Egypt is where God grows us and multiplies us. Don't give yp, don't give in. Go through.",
    next: false,
  },
];
