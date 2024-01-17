export const mockData = {
  semesters: [
    { name: '20.2', isUpdating: false, isNotEligible: false },
    { name: '20.1', isUpdating: false, isNotEligible: false },
    { name: '21.2', isUpdating: false, isNotEligible: true },
    { name: '21.1', isUpdating: false, isNotEligible: false },
    { name: '22.2', isUpdating: false, isNotEligible: false },
    { name: '22.1', isUpdating: false, isNotEligible: false },
    { name: '23.2', isUpdating: true, isNotEligible: false },
    { name: '24.2', isUpdating: false, isNotEligible: false },
    { name: '24.1', isUpdating: false, isNotEligible: false },
    { name: '24.3', isUpdating: false, isNotEligible: false },
  ],
  rankings: ['1', '40', '100', '160'],
  dataset: [
    {
      semester: '20.2',
      ranking: '1',
      average: '7,4',
    },
    {
      semester: '20.1',
      ranking: '100',
      average: '8,5',
    },
    {
      semester: '21.2',
      ranking: null,
      average: null,
    },
    {
      semester: '21.1',
      ranking: '40',
      average: '6,2',
    },
    {
      semester: '22.1',
      ranking: '100',
      average: '6,2',
    },
    {
      semester: '22.2',
      ranking: '160',
      average: '8,2',
    },
    {
      semester: '23.2',
      ranking: null,
      average: null,
    },
    {
      semester: '24.1',
      ranking: '100',
      average: '6,2',
    },
    {
      semester: '24.2',
      ranking: '160',
      average: '8,2',
    },
    {
      semester: '24.3',
      ranking: '40',
      average: '8,2',
    },
  ],
}
