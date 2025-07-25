import type { ITheme } from '@/types'

const theme: ITheme = {
  name: 'my',
  fontStyle: {
    family: 'MiSans Regular',
    size: 12,
  },
  blockStyles: {
    logic_blocks: {
      colourPrimary: '#be52f2',
      colourSecondary: '#c567f5',
      colourTertiary: '#cc7af7',
    },
    loop_blocks: {
      colourPrimary: '#ffcf5c',
      colourSecondary: '#ffd471',
      colourTertiary: '#ffd983',
    },
    math_blocks: {
      colourPrimary: '#0084f4',
      colourSecondary: '#3492f6',
      colourTertiary: '#509ff9',
    },
    text_blocks: {
      colourPrimary: '#ff647c',
      colourSecondary: '#ff7689',
      colourTertiary: '#ff8795',
    },
    list_blocks: {
      colourPrimary: '#6979f8',
      colourSecondary: '#7688fa',
      colourTertiary: '#8496fc',
    },
    variable_blocks: {
      colourPrimary: '#f2994a',
      colourSecondary: '#f4a460',
      colourTertiary: '#f6ae73',
    },
    variable_dynamic_blocks: {
      colourPrimary: '#ef9a9a',
      colourSecondary: '#f2a4a4',
      colourTertiary: '#f4aeae',
    },
    procedure_blocks: {
      colourPrimary: '#00c48c',
      colourSecondary: '#42ca97',
      colourTertiary: '#60d1a2',
    },
  },
  // blockStyles: {
  //   logic_blocks: {
  //     colourPrimary: '#BE52F2',
  //     colourSecondary: '#A158C3',
  //     colourTertiary: '#7D4397',
  //     // hat: '',
  //   },
  //   loop_blocks: {
  //     colourPrimary: '#FFCF5C',
  //     colourSecondary: '#FFCF5C',
  //     colourTertiary: '#FFCF5C',
  //     // hat: '',
  //   },
  //   math_blocks: {
  //     colourPrimary: '#0084F4',
  //     colourSecondary: '#0084F4',
  //     colourTertiary: '#0084F4',
  //     // hat: '',
  //   },
  //   text_blocks: {
  //     colourPrimary: '#FF647C',
  //     colourSecondary: '#FF647C',
  //     colourTertiary: '#FF647C',
  //     // hat: '',
  //   },
  //   list_blocks: {
  //     colourPrimary: '#6979F8',
  //     colourSecondary: '#6979F8',
  //     colourTertiary: '#6979F8',
  //     // hat: '',
  //   },
  //   variable_blocks: {
  //     colourPrimary: '#F2994A',
  //     colourSecondary: '#F2994A',
  //     colourTertiary: '#F2994A',
  //     // hat: '',
  //   },
  //   variable_dynamic_blocks: {
  //     colourPrimary: '#EF9A9A',
  //     colourSecondary: '#FFEBEE',
  //     colourTertiary: '#EF5350',
  //     // hat: '',
  //   },
  //   procedure_blocks: {
  //     colourPrimary: '#00C48C',
  //     colourSecondary: '#00C48C',
  //     colourTertiary: '#00C48C',
  //     // hat: 'cap',
  //   },
  // },
  categoryStyles: {
    logic_category: {
      colour: '#BE52F2',
    },
    loop_category: {
      colour: '#FFCF5C',
    },
    math_category: {
      colour: '#0084F4',
    },
    text_category: {
      colour: '#FF647C',
    },
    list_category: {
      colour: '#6979F8',
    },
    variable_category: {
      colour: '#F2994A',
    },
    procedure_category: {
      colour: '#00C48C',
    },
  },
}

export default theme
