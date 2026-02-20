import { Content } from '../../domain/entities/Content';

export const INITIAL_CONTENT: Content[] = [
  {
    id: '1',
    type: 'word',
    original: 'Saudade',
    translation: 'Nostalgia / Echar de menos',
    pronunciation: '/saw.ˈda.dɨ/',
    exampleOriginal: 'Tenho muitas saudades de você.',
    exampleTranslation: 'Te echo mucho de menos.',
    category: 'Emociones'
  },
  {
    id: '2',
    type: 'phrase',
    original: 'Bom dia',
    translation: 'Buenos días',
    pronunciation: '/bõ ˈdʒi.ɐ/',
    exampleOriginal: 'Bom dia, como você está?',
    exampleTranslation: 'Buenos días, ¿cómo estás?',
    category: 'Saludos'
  },
  {
    id: '3',
    type: 'word',
    original: 'Obrigado',
    translation: 'Gracias (dicho por hombre)',
    pronunciation: '/o.bɾi.ˈɡa.du/',
    exampleOriginal: 'Muito obrigado pela ajuda.',
    exampleTranslation: 'Muchas gracias por la ayuda.',
    category: 'Cortesía'
  },
  {
    id: '4',
    type: 'word',
    original: 'Esquecer',
    translation: 'Olvidar',
    pronunciation: '/is.ke.ˈseɾ/',
    exampleOriginal: 'Não esqueça de trancar a porta.',
    exampleTranslation: 'No olvides cerrar la puerta con llave.',
    category: 'Verbos'
  },
  {
    id: '5',
    type: 'phrase',
    original: 'Com licença',
    translation: 'Con permiso / Disculpe',
    pronunciation: '/kõ li.ˈsẽ.sɐ/',
    exampleOriginal: 'Com licença, posso passar?',
    exampleTranslation: 'Con permiso, ¿puedo pasar?',
    category: 'Cortesía'
  },
  {
    id: '6',
    type: 'word',
    original: 'Café da manhã',
    translation: 'Desayuno',
    pronunciation: '/ka.ˈfɛ da mɐ.ˈɲɐ̃/',
    exampleOriginal: 'O que você quer para o café da manhã?',
    exampleTranslation: '¿Qué quieres para el desayuno?',
    category: 'Comida'
  },
  {
    id: '7',
    type: 'word',
    original: 'Devagar',
    translation: 'Despacio',
    pronunciation: '/de.va.ˈɡaɾ/',
    exampleOriginal: 'Fale mais devagar, por favor.',
    exampleTranslation: 'Hable más despacio, por favor.',
    category: 'Adverbios'
  },
  {
    id: '8',
    type: 'phrase',
    original: 'Tudo bem?',
    translation: '¿Todo bien? / ¿Cómo estás?',
    pronunciation: '/ˈtu.du bẽj̃/',
    exampleOriginal: 'Oi, tudo bem com você?',
    exampleTranslation: 'Hola, ¿todo bien contigo?',
    category: 'Saludos'
  },
  {
    id: '9',
    type: 'word',
    original: 'Janela',
    translation: 'Ventana',
    pronunciation: '/ʒa.ˈnɛ.lɐ/',
    exampleOriginal: 'Abra a janela, está calor.',
    exampleTranslation: 'Abre la ventana, hace calor.',
    category: 'Casa'
  },
  {
    id: '10',
    type: 'word',
    original: 'Coragem',
    translation: 'Coraje / Valor',
    pronunciation: '/ko.ˈɾa.ʒẽj̃/',
    exampleOriginal: 'Tenha coragem para enfrentar os problemas.',
    exampleTranslation: 'Ten coraje para enfrentar los problemas.',
    category: 'Cualidades'
  }
];
