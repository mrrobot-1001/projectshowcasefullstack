// Categories for the showcase
export const CATEGORIES = [
  'Clubs and Chapter',
  'AI/ML',
  'Cybersecurity and Blockchain',
  'Open Innovation',
  'Software and Automation'
] as const

export type Category = typeof CATEGORIES[number]

// Judge names
export const JUDGES = [
  'Amit Kumar Soni',
  'Piyush Jha',
  'Ananya Sengupta',
  'Varun Sharma',
  'Aashi Nath',
  'Ashwani Chopra',
  'Santosh Kumar Venkanna',
  'Gopi Daggumilli',
  'Shivendra Kaura',
  'Nikhil Beniwal',
  'Manish Singh',
  'Ganesh Kashyap',
  'Prashant Verma',
  'Sunpreet Singh',
  'Rahul Kumar',
  'Dr. Nishant Sinha',
  'Puneet Bansal',
  'Varun Marothia'
] as const

export type JudgeName = typeof JUDGES[number]

// Student Cabinet Board Members
export const CABINET_MEMBERS = {
  president: 'Aashi Shukla',
  vicePresident: 'Namit Joshi',
  generalSecretary: 'Sumukh Chhabra'
} as const
